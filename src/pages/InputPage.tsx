import { useState, type Dispatch, type SetStateAction } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";
import {
  getTransactions,
  saveTransactions,
  type Transaction,
  type TransactionType,
} from "../types/transaction";

const InputPage = () => {
  const [type, setType] = useState<TransactionType>("expense");

  return (
    <div className="min-h-dvh bg-gray-50 pb-24">
      <InputPageHeader type={type} setType={setType} />
      <InputForm type={type} />
      <Footer />
    </div>
  );
};

export default InputPage;

/* ------------------------------
   支出・収入の切り替え部分
------------------------------ */

type InputPageHeaderProps = {
  type: TransactionType;
  setType: Dispatch<SetStateAction<TransactionType>>;
};

const InputPageHeader = ({ type, setType }: InputPageHeaderProps) => {
  return (
    <header className="bg-blue-400 pb-1 pt-8 text-center">
      <div className="inline-flex gap-8 rounded-full bg-white p-1 shadow-md">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`rounded-full px-4 py-2 shadow-md ${
            type === "expense"
              ? "bg-blue-300 text-white"
              : "bg-white text-black"
          }`}
        >
          支出
        </button>

        <button
          type="button"
          onClick={() => setType("income")}
          className={`rounded-full px-4 py-2 shadow-md ${
            type === "income" ? "bg-blue-300 text-white" : "bg-white text-black"
          }`}
        >
          収入
        </button>
      </div>
    </header>
  );
};

/* ------------------------------
   入力フォーム部分
------------------------------ */

type InputFormProps = {
  type: TransactionType;
};

const InputForm = ({ type }: InputFormProps) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [memo, setMemo] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const typeLabel = type === "expense" ? "支出" : "収入";

  const handlePreviousDate = () => {
    setSelectedDate((currentDate) => {
      const previousDate = new Date(currentDate);
      previousDate.setDate(previousDate.getDate() - 1);
      return previousDate;
    });
  };

  const handleNextDate = () => {
    setSelectedDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate;
    });
  };

  // 画面表示用
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const weekdays = [
      "日曜日",
      "月曜日",
      "火曜日",
      "水曜日",
      "木曜日",
      "金曜日",
      "土曜日",
    ];

    return `${year}年${month}月${day}日${weekdays[date.getDay()]}`;
  };

  // 保存用：2026-08-13形式
  const formatStorageDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 数字以外を除去
    const numericValue = event.target.value.replace(/[^\d]/g, "");
    setAmount(numericValue);
    setMessage("");
  };

  const handleRegister = async () => {
    const numericAmount = Number(amount);

    if (!amount || numericAmount <= 0) {
      setMessage("金額を入力してください");
      return;
    }

    if (!selectedCategory) {
      setMessage("カテゴリーを選択してください");
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      date: formatStorageDate(selectedDate),
      memo: memo.trim(),
      category: selectedCategory,
      amount: numericAmount,
    };

    const currentTransactions = await getTransactions();

    saveTransactions([...currentTransactions, newTransaction]);

    // 登録後に入力内容をリセット
    setMemo("");
    setAmount("");
    setSelectedCategory(null);
    setMessage(`${formatDate(selectedDate)}の${typeLabel}を登録しました`);
  };

  return (
    <div className="px-4 py-3">
      {/* 日付 */}
      <div className="grid grid-cols-[auto_24px_1fr_24px] items-center gap-x-2 border-b pb-3">
        <p>日付</p>

        <button
          type="button"
          aria-label="前日を表示"
          onClick={handlePreviousDate}
        >
          <ChevronLeftIcon className="size-6" />
        </button>

        <p className="w-full rounded-sm bg-blue-200 text-center tracking-wider">
          {formatDate(selectedDate)}
        </p>

        <button type="button" aria-label="翌日を表示" onClick={handleNextDate}>
          <ChevronRightIcon className="size-6" />
        </button>
      </div>

      {/* メモ */}
      <div className="mt-2 grid grid-cols-[auto_24px_1fr_24px] items-center gap-x-2 border-b pb-3 pt-3">
        <p>メモ</p>

        <div aria-hidden="true" />

        <input
          type="text"
          value={memo}
          onChange={(event) => {
            setMemo(event.target.value);
            setMessage("");
          }}
          placeholder="未入力"
          className="w-full rounded-sm px-2 tracking-wider outline-none"
        />

        <div aria-hidden="true" />
      </div>

      {/* 金額 */}
      <div className="mt-2 grid grid-cols-[auto_24px_1fr_24px] items-center gap-x-2 border-b pb-3 pt-3">
        <p>{typeLabel}</p>

        <div aria-hidden="true" />

        <input
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0"
          className="w-full rounded-sm bg-blue-200 px-2 tracking-wider outline-none"
        />

        <p>円</p>
      </div>

      {/* カテゴリー */}
      <CategoryButtons
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {message && (
        <p
          className={`pt-4 text-center text-sm ${
            message.includes("登録しました") ? "text-blue-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {/* 登録ボタン */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleRegister}
          className={`w-full rounded-full py-3 font-medium text-white shadow-md ${
            type === "expense"
              ? "bg-red-400 hover:bg-red-500"
              : "bg-blue-400 hover:bg-blue-500"
          }`}
        >
          {typeLabel}を登録
        </button>
      </div>
    </div>
  );
};

/* ------------------------------
   カテゴリー部分
------------------------------ */

const categories = [
  "食費",
  "日用品",
  "教育費",
  "美容",
  "交際費",
  "医療費",
  "光熱費",
  "交通費",
  "通信費",
  "趣味",
  "投資",
  "自分へのご褒美",
];

type CategoryButtonsProps = {
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<string | null>>;
};

const CategoryButtons = ({
  selectedCategory,
  setSelectedCategory,
}: CategoryButtonsProps) => {
  return (
    <section className="pt-3">
      <p className="mb-3 text-sm font-bold text-gray-700">カテゴリー</p>

      <div className="grid grid-cols-2 gap-3 pt-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`h-12 rounded-lg border text-sm shadow-sm transition-colors ${
                isSelected
                  ? "border-blue-300 bg-blue-300 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
};
