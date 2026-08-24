import {
  useMemo,
  useRef,
  useState,
  useEffect,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Footer from "../components/Footer";
import {
  getTransactions,
  saveTransactions,
  type Transaction,
} from "../types/transaction";

type CalendarDay = {
  date: Date;
  day: number;
  income: number;
  expense: number;
  isCurrentMonth: boolean;
};

type SwipeableTransactionProps = {
  transaction: Transaction;
  onDelete: (id: string) => void;
};

const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
const today = new Date();

const DELETE_BUTTON_WIDTH = 88;
const SWIPE_THRESHOLD = 44;

const SwipeableTransaction = ({
  transaction,
  onDelete,
}: SwipeableTransactionProps) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    startXRef.current = event.clientX;
    startOffsetRef.current = offsetX;
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    const movedDistance = event.clientX - startXRef.current;
    const nextOffset = startOffsetRef.current + movedDistance;

    const limitedOffset = Math.max(
      -DELETE_BUTTON_WIDTH,
      Math.min(0, nextOffset),
    );

    setOffsetX(limitedOffset);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    if (offsetX <= -SWIPE_THRESHOLD) {
      setOffsetX(-DELETE_BUTTON_WIDTH);
    } else {
      setOffsetX(0);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleDelete = () => {
    onDelete(transaction.id);
  };

  return (
    <div className="relative overflow-hidden border-b border-gray-200 bg-red-500">
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`${transaction.category}を削除`}
        className="absolute inset-y-0 right-0 flex w-22 flex-col items-center justify-center gap-1 bg-red-500 text-xs font-bold text-white"
      >
        <TrashIcon className="size-5" />
        <span>削除</span>
      </button>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          touchAction: "pan-y",
          transition: isDragging ? "none" : "transform 200ms ease-out",
        }}
        className="relative flex w-full cursor-grab select-none items-center gap-3 bg-white px-4 py-4 active:cursor-grabbing"
      >
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
            transaction.type === "expense"
              ? "bg-red-50 text-red-500"
              : "bg-blue-50 text-blue-500"
          }`}
        >
          ¥
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-gray-700">
            {transaction.category}
          </p>

          {transaction.memo && (
            <p className="mt-1 truncate text-xs text-gray-400">
              {transaction.memo}
            </p>
          )}
        </div>

        <p
          className={`shrink-0 font-bold ${
            transaction.type === "expense" ? "text-red-500" : "text-blue-500"
          }`}
        >
          {transaction.type === "expense" ? "-" : "+"}
          {transaction.amount.toLocaleString()}円
        </p>

        <ChevronRightIcon className="size-4 shrink-0 text-gray-400" />
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactions = await getTransactions();
      setTransactions(fetchedTransactions);
    };
    fetchTransactions();
  }, []);

  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  const handlePreviousMonth = () => {
    setCurrentMonth(
      (previousMonth) =>
        new Date(previousMonth.getFullYear(), previousMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (previousMonth) =>
        new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 1),
    );
  };

  // 修正の必要有。
  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions((currentTransactions) => {
      const updatedTransactions = currentTransactions.filter(
        (transaction) => transaction.id !== transactionId,
      );

      saveTransactions(updatedTransactions);

      return updatedTransactions;
    });
  };

  const createDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const dailyTotals = useMemo(() => {
    return transactions.reduce<
      Record<string, { income: number; expense: number }>
    >((totals, transaction) => {
      if (!totals[transaction.date]) {
        totals[transaction.date] = {
          income: 0,
          expense: 0,
        };
      }

      totals[transaction.date][transaction.type] += transaction.amount;

      return totals;
    }, {});
  }, [transactions]);

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const firstDayOfMonth = new Date(
      currentYear,
      currentMonthIndex,
      1,
    ).getDay();

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(
        currentYear,
        currentMonthIndex,
        index - firstDayOfMonth + 1,
      );

      const isCurrentMonth =
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonthIndex;

      const dateKey = createDateKey(date);
      const total = dailyTotals[dateKey];

      return {
        date,
        day: date.getDate(),
        income: isCurrentMonth ? (total?.income ?? 0) : 0,
        expense: isCurrentMonth ? (total?.expense ?? 0) : 0,
        isCurrentMonth,
      };
    });
  }, [currentYear, currentMonthIndex, dailyTotals]);

  const visibleTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const [year, month] = transaction.date.split("-").map(Number);

        return year === currentYear && month === currentMonthIndex + 1;
      })
      .sort((a, b) => {
        if (a.date !== b.date) {
          return b.date.localeCompare(a.date);
        }

        return b.id.localeCompare(a.id);
      });
  }, [transactions, currentYear, currentMonthIndex]);

  const monthlyTotal = useMemo(() => {
    return visibleTransactions.reduce(
      (total, transaction) => {
        total[transaction.type] += transaction.amount;
        return total;
      },
      {
        income: 0,
        expense: 0,
      },
    );
  }, [visibleTransactions]);

  const balance = monthlyTotal.income - monthlyTotal.expense;

  const formatTransactionDate = (dateText: string) => {
    const [year, month, day] = dateText.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const weekDay = weekDays[date.getDay()];

    return `${year}年${month}月${day}日（${weekDay}）`;
  };

  const isToday = (date: Date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[900px] flex-col overflow-hidden bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-400 px-4 pb-4 pt-8 text-white">
        <div className="flex items-center justify-center">
          <h1 className="font-bold">カレンダー</h1>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-24">
        <div className="shrink-0">
          <section className="bg-white px-3 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="前月"
                onClick={handlePreviousMonth}
                className="flex size-8 items-center justify-center"
              >
                <ChevronLeftIcon className="size-5" />
              </button>

              <div className="flex-1 rounded-lg bg-blue-50 py-2 text-center">
                <span className="font-bold text-gray-700">
                  {currentYear}年{currentMonthIndex + 1}月
                </span>
              </div>

              <button
                type="button"
                aria-label="翌月"
                onClick={handleNextMonth}
                className="flex size-8 items-center justify-center"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </div>
          </section>

          <div className="grid grid-cols-7 border-b border-t border-gray-200 bg-white">
            {weekDays.map((weekDay, index) => (
              <div
                key={weekDay}
                className={`py-2 text-center text-xs ${
                  index === 0
                    ? "text-red-500"
                    : index === 6
                      ? "text-blue-500"
                      : "text-gray-500"
                }`}
              >
                {weekDay}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-l border-gray-200 bg-white">
            {calendarDays.map((calendarDay, index) => {
              const weekIndex = index % 7;
              const todayCell = isToday(calendarDay.date);

              return (
                <button
                  key={createDateKey(calendarDay.date)}
                  type="button"
                  className={`h-14 border-b border-r border-gray-200 p-1 text-left align-top ${
                    todayCell ? "bg-blue-50" : ""
                  }`}
                >
                  <span
                    className={`flex size-5 items-center justify-center text-xs ${
                      !calendarDay.isCurrentMonth
                        ? "text-gray-300"
                        : todayCell
                          ? "rounded-full bg-blue-500 font-bold text-white"
                          : weekIndex === 0
                            ? "text-red-500"
                            : weekIndex === 6
                              ? "text-blue-500"
                              : "text-gray-600"
                    }`}
                  >
                    {calendarDay.day}
                  </span>

                  {calendarDay.income > 0 && (
                    <span className="block truncate text-right text-[9px] text-blue-500">
                      {calendarDay.income.toLocaleString()}
                    </span>
                  )}

                  {calendarDay.expense > 0 && (
                    <span className="block truncate text-right text-[9px] text-red-500">
                      {calendarDay.expense.toLocaleString()}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <section className="grid grid-cols-3 bg-white px-3 py-4 text-center">
            <div>
              <p className="text-xs text-gray-500">収入</p>
              <p className="text-sm font-bold text-blue-500">
                {monthlyTotal.income.toLocaleString()}円
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">支出</p>
              <p className="text-sm font-bold text-red-500">
                {monthlyTotal.expense.toLocaleString()}円
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">合計</p>
              <p
                className={`text-sm font-bold ${
                  balance < 0 ? "text-red-500" : "text-blue-500"
                }`}
              >
                {balance.toLocaleString()}円
              </p>
            </div>
          </section>
        </div>

        <section className="shrink-0">
          {visibleTransactions.length > 0 ? (
            visibleTransactions.map((transaction) => (
              <div key={transaction.id}>
                <div className="bg-blue-100 px-3 py-1 text-xs text-gray-600">
                  {formatTransactionDate(transaction.date)}
                </div>

                <SwipeableTransaction
                  transaction={transaction}
                  onDelete={handleDeleteTransaction}
                />
              </div>
            ))
          ) : (
            <div className="bg-white px-4 py-8 text-center text-sm text-gray-400">
              この月の明細はありません
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CalendarPage;
