import { supabase } from "../utils/supabase";
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

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    let { data: transactions } = await supabase
      .from("transactions")
      .select("*");

    return transactions as Transaction[];
  } catch {
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
};
