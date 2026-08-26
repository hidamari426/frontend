import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { WalletIcon } from "@heroicons/react/24/outline";
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
      setMessage(
        "Google ログインを開始できませんでした。設定を確認してください。",
      );
    }
  };

  if (isAuthenticated === null) {
    return <div className="min-h-dvh bg-blue-400" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[900px] flex-col bg-gray-50">
      <header className="bg-blue-400 px-5 pb-20 pt-12 text-center text-white">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white/20 shadow-sm">
          <WalletIcon className="size-9" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">My家計簿</h1>
        <p className="mt-2 text-sm text-blue-50">
          毎日の支出を、かんたんに記録
        </p>
      </header>

      <section className="mx-5 -mt-10 rounded-2xl bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-700">
            さあ、はじめましょう
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Googleアカウントで安全にログインできます
          </p>
        </div>

        <div className="mt-6 h-px bg-gray-100" />

        <div className="pt-8">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <span className="text-lg font-bold text-red-500">G</span>
            {isSubmitting ? "Google に移動中…" : "Google でログイン"}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </section>

      <p className="mt-auto px-5 pb-8 text-center text-xs text-gray-400">
        家計簿データはログインしたアカウントごとに管理されます
      </p>
    </main>
  );
};

export default LoginPage;
