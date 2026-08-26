import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";
import {
  createTransaction,
  type TransactionInput,
  type TransactionType,
} from "../types/transaction";

const InputPage = () => {
  const [type, setType] = useState<TransactionType>("expense");

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[900px] bg-gray-50 pb-24">
      <InputPageHeader type={type} setType={setType} />
      <InputForm type={type} />
      <Footer />
    </div>
  );
};

export default InputPage;

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

  useEffect(() => {
    setSelectedCategory(null);
  }, [type]);

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

  const formatStorageDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const newTransaction: TransactionInput = {
      type,
      date: formatStorageDate(selectedDate),
      memo: memo.trim(),
      category: selectedCategory,
      amount: numericAmount,
    };

    try {
      await createTransaction(newTransaction);
      setMemo("");
      setAmount("");
      setSelectedCategory(null);
      setMessage(`${formatDate(selectedDate)}の${typeLabel}を登録しました`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "取引データを登録できませんでした",
      );
    }
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

      <CategoryButtons
        type={type}
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

const categoriesByType: Record<TransactionType, string[]> = {
  expense: [
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
  ],
  income: ["給料", "おこづかい", "賞与", "副業", "投資", "売却", "手当"],
};

type CategoryButtonsProps = {
  type: TransactionType;
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<string | null>>;
};

const CategoryButtons = ({
  type,
  selectedCategory,
  setSelectedCategory,
}: CategoryButtonsProps) => {
  const categories = categoriesByType[type];

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
