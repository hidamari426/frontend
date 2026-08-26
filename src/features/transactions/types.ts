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
