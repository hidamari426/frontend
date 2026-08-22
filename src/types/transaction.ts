export type TransactionType = "expense" | "income";

export type Transaction = {
  id: string;
  type: TransactionType;
  date: string;
  memo: string;
  category: string;
  amount: number;
};

export const TRANSACTION_STORAGE_KEY = "money-app-transactions";

export const getTransactions = (): Transaction[] => {
  try {
    const savedTransactions = localStorage.getItem(TRANSACTION_STORAGE_KEY);

    if (!savedTransactions) {
      return [];
    }

    return JSON.parse(savedTransactions) as Transaction[];
  } catch {
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
};
