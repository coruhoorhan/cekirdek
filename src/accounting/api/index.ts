import { supabase } from '../../lib/supabaseClient';
import { Account, Transaction, Invoice } from '../types';

export const accountingService = {
  // --- Accounts ---
  async getAccounts(): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounting_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Account[];
  },

  async getAccount(id: string): Promise<Account> {
    const { data, error } = await supabase
      .from('accounting_accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Account;
  },

  async createAccount(account: Omit<Account, 'id' | 'created_at' | 'updated_at'>): Promise<Account> {
    const { data, error } = await supabase
      .from('accounting_accounts')
      .insert(account)
      .select()
      .single();

    if (error) throw error;
    return data as Account;
  },

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    const { data, error } = await supabase
      .from('accounting_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Account;
  },

  async deleteAccount(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounting_accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // --- Transactions ---
  async getTransactions(accountId?: string): Promise<Transaction[]> {
    let query = supabase.from('accounting_transactions').select('*');
    if (accountId) {
      query = query.eq('account_id', accountId);
    }
    const { data, error } = await query.order('transaction_date', { ascending: false });

    if (error) throw error;
    return data as Transaction[];
  },

  async getTransaction(id: string): Promise<Transaction> {
    const { data, error } = await supabase
      .from('accounting_transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Transaction;
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('accounting_transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('accounting_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounting_transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // --- Invoices ---
  async getInvoices(accountId?: string, status?: string): Promise<Invoice[]> {
    let query = supabase.from('accounting_invoices').select('*');
    if (accountId) {
      query = query.eq('account_id', accountId);
    }
    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query.order('issue_date', { ascending: false });

    if (error) throw error;
    return data as Invoice[];
  },

  async getInvoice(id: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from('accounting_invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Invoice;
  },

  async createInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice> {
    const { data, error } = await supabase
      .from('accounting_invoices')
      .insert(invoice)
      .select()
      .single();

    if (error) throw error;
    return data as Invoice;
  },

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const { data, error } = await supabase
      .from('accounting_invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Invoice;
  },

  async deleteInvoice(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounting_invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
