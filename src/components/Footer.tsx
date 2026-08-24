import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRightStartOnRectangleIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "../utils/supabase";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isInputPage = location.pathname === "/";
  const isCalendarPage = location.pathname === "/calendar";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <footer className="fixed inset-x-0 bottom-0 z-10 flex justify-center bg-white px-4 py-3">
      <nav className="flex w-full max-w-[900px] rounded-full border border-gray-200 bg-gray-50 p-1">
        <button
          type="button"
          onClick={() => navigate("/")}
          className={`flex flex-1 flex-col items-center rounded-full py-2 text-xs ${
            isInputPage ? "bg-blue-200 text-blue-700" : "text-gray-600"
          }`}
        >
          <PencilSquareIcon className="size-6" />
          <span className="mt-1">入力</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/calendar")}
          className={`flex flex-1 flex-col items-center rounded-full py-2 text-xs ${
            isCalendarPage ? "bg-blue-200 text-blue-700" : "text-gray-600"
          }`}
        >
          <CalendarDaysIcon className="size-6" />
          <span className="mt-1">カレンダー</span>
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex flex-1 flex-col items-center rounded-full py-2 text-xs text-gray-600"
        >
          <ArrowRightStartOnRectangleIcon className="size-6" />
          <span className="mt-1">ログアウト</span>
        </button>
      </nav>
    </footer>
  );
};

export default Footer;
