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

export type TransactionInput = Omit<Transaction, "id">;

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*");

  if (error) {
    throw new Error("取引データを取得できませんでした");
  }

  return (transactions ?? []) as Transaction[];
};

export const createTransaction = async (
  transaction: Transaction,
): Promise<Transaction> => {
  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select()
    .single();

  if (error) {
    throw new Error("取引データを登録できませんでした");
  }

  return data as Transaction;
};

export const updateTransaction = async (
  id: string,
  transaction: Partial<TransactionInput>,
): Promise<Transaction> => {
  const { data, error } = await supabase
    .from("transactions")
    .update(transaction)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("取引データを更新できませんでした");
  }

  return data as Transaction;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    throw new Error("取引データを削除できませんでした");
  }
};
