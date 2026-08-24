import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

type AuthMode = "login" | "signup";

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(Boolean(data.user));
    };

    void loadUser();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setMessage(
        mode === "login"
          ? "メールアドレスまたはパスワードが正しくありません"
          : result.error.message,
      );
      return;
    }

    if (result.data.session) {
      navigate("/", { replace: true });
      return;
    }

    setMessage("確認メールを送信しました。メール内のリンクから登録を完了してください。");
  };

  if (isAuthenticated === null) {
    return <div className="min-h-dvh bg-gray-50" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const isLogin = mode === "login";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[900px] items-center bg-gray-50 px-5 py-10">
      <section className="w-full rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-blue-500">MoneyBook</h1>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin ? "ログインして家計簿を管理" : "アカウントを作成"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            メールアドレス
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-blue-400"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            パスワード
            <input
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-blue-400"
            />
          </label>

          {message && (
            <p className="text-center text-sm text-red-500">{message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-blue-400 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-200"
          >
            {isSubmitting ? "処理中…" : isLogin ? "ログイン" : "新規登録"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(isLogin ? "signup" : "login");
            setMessage("");
          }}
          className="mt-5 w-full text-sm text-blue-500"
        >
          {isLogin ? "アカウントを作成する" : "ログインへ戻る"}
        </button>
      </section>
    </main>
  );
};

export default LoginPage;
