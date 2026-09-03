import { test, expect } from '@playwright/test';
import { AccountSchema, TransactionSchema, InvoiceSchema } from '../../src/accounting/types';
import { accountingService } from '../../src/accounting/api';

test.describe('Accounting Module', () => {
  test('should validate Account Schema', () => {
    const validAccount = {
      name: 'Test Customer',
      type: 'customer',
      balance: 100,
      currency: 'TRY'
    };

    expect(() => AccountSchema.parse(validAccount)).not.toThrow();

    const invalidAccount = {
      type: 'invalid', // should fail
      balance: -100
    };

    expect(() => AccountSchema.parse(invalidAccount)).toThrow();
  });

  test('should validate Transaction Schema', () => {
    const validTransaction = {
      account_id: '123e4567-e89b-12d3-a456-426614174000',
      type: 'income',
      amount: 500,
      currency: 'TRY'
    };

    expect(() => TransactionSchema.parse(validTransaction)).not.toThrow();

    const invalidTransaction = {
      account_id: '123e4567-e89b-12d3-a456-426614174000',
      type: 'income',
      amount: -500 // should be positive
    };

    expect(() => TransactionSchema.parse(invalidTransaction)).toThrow();
  });

  test('should validate Invoice Schema', () => {
    const validInvoice = {
      account_id: '123e4567-e89b-12d3-a456-426614174000',
      invoice_number: 'INV-001',
      type: 'sales',
      status: 'pending',
      amount: 1000,
      tax_amount: 180,
      total_amount: 1180,
      currency: 'TRY'
    };

    expect(() => InvoiceSchema.parse(validInvoice)).not.toThrow();
  });

  test('accountingService should have all CRUD methods for Accounts', () => {
    expect(typeof accountingService.getAccounts).toBe('function');
    expect(typeof accountingService.getAccount).toBe('function');
    expect(typeof accountingService.createAccount).toBe('function');
    expect(typeof accountingService.updateAccount).toBe('function');
    expect(typeof accountingService.deleteAccount).toBe('function');
  });

  test('accountingService should have all CRUD methods for Transactions', () => {
    expect(typeof accountingService.getTransactions).toBe('function');
    expect(typeof accountingService.getTransaction).toBe('function');
    expect(typeof accountingService.createTransaction).toBe('function');
    expect(typeof accountingService.updateTransaction).toBe('function');
    expect(typeof accountingService.deleteTransaction).toBe('function');
  });

  test('accountingService should have all CRUD methods for Invoices', () => {
    expect(typeof accountingService.getInvoices).toBe('function');
    expect(typeof accountingService.getInvoice).toBe('function');
    expect(typeof accountingService.createInvoice).toBe('function');
    expect(typeof accountingService.updateInvoice).toBe('function');
    expect(typeof accountingService.deleteInvoice).toBe('function');
  });
});
