import { z } from 'zod';

export const AccountTypeSchema = z.enum(['customer', 'supplier', 'bank', 'cash', 'other']);
export type AccountType = z.infer<typeof AccountTypeSchema>;

export const TransactionTypeSchema = z.enum(['income', 'expense']);
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

export const InvoiceTypeSchema = z.enum(['sales', 'purchase']);
export type InvoiceType = z.infer<typeof InvoiceTypeSchema>;

export const InvoiceStatusSchema = z.enum(['draft', 'pending', 'paid', 'cancelled', 'overdue']);
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

export const AccountSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  type: AccountTypeSchema,
  balance: z.number().default(0),
  currency: z.string().default('TRY'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Account = z.infer<typeof AccountSchema>;

export const TransactionSchema = z.object({
  id: z.string().uuid().optional(),
  account_id: z.string().uuid(),
  type: TransactionTypeSchema,
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default('TRY'),
  description: z.string().optional(),
  transaction_date: z.string().optional(), // ISO date string
  reference_id: z.string().uuid().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const InvoiceSchema = z.object({
  id: z.string().uuid().optional(),
  account_id: z.string().uuid(),
  invoice_number: z.string().min(1, "Invoice number is required"),
  type: InvoiceTypeSchema,
  status: InvoiceStatusSchema,
  amount: z.number().positive("Amount must be positive"),
  tax_amount: z.number().min(0).default(0),
  total_amount: z.number().positive("Total amount must be positive"),
  currency: z.string().default('TRY'),
  issue_date: z.string().optional(),
  due_date: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
