import { supabase } from "../../utils/supabase";
import type { Transaction, TransactionInput } from "./types";

type DatabaseTransaction = TransactionInput & {
  id: string | number;
};

const normalizeTransaction = (transaction: DatabaseTransaction): Transaction => ({
  ...transaction,
  id: String(transaction.id),
});

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*");

  if (error) {
    throw new Error("取引データを取得できませんでした");
  }

  return (transactions as DatabaseTransaction[] ?? []).map(normalizeTransaction);
};

export const createTransaction = async (
  transaction: TransactionInput,
): Promise<Transaction> => {
  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select()
    .single();

  if (error) {
    throw new Error("取引データを登録できませんでした");
  }

  return normalizeTransaction(data as DatabaseTransaction);
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

  return normalizeTransaction(data as DatabaseTransaction);
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    throw new Error("取引データを削除できませんでした");
  }
};
