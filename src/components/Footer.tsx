import { useLocation, useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isInputPage = location.pathname === "/";
  const isCalendarPage = location.pathname === "/calendar";

  return (
    <footer className="fixed inset-x-0 bottom-0 z-10 flex justify-center bg-white px-4 py-3">
      <nav className="flex w-full max-w-3xl rounded-full border border-gray-200 bg-gray-50 p-1">
        {/* 入力 */}
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

        {/* カレンダー */}
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
      </nav>
    </footer>
  );
};

export default Footer;
