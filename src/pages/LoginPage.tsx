import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

const LoginPage = () => {
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

  const handleGoogleSignIn = async () => {
    setMessage("");
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    setIsSubmitting(false);

    if (error) {
      setMessage("Google ログインを開始できませんでした。設定を確認してください。");
    }
  };

  if (isAuthenticated === null) {
    return <div className="min-h-dvh bg-gray-50" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[900px] items-center bg-gray-50 px-5 py-10">
      <section className="w-full rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-blue-500">MoneyBook</h1>
          <p className="mt-2 text-sm text-gray-500">
            Google アカウントでログインして家計簿を管理
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white py-3 font-medium text-gray-700 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <span className="text-lg font-bold text-red-500">G</span>
          {isSubmitting ? "Google に移動中…" : "Google でログイン"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}

      </section>
    </main>
  );
};

export default LoginPage;
