-- accounting_accounts (Cari Hesaplar)
CREATE TABLE IF NOT EXISTS public.accounting_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('customer', 'supplier', 'bank', 'cash', 'other')),
  balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- accounting_transactions (Gelir/Gider Kayıtları)
CREATE TABLE IF NOT EXISTS public.accounting_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.accounting_accounts(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY' NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_id UUID, -- Optional link to invoice
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- accounting_invoices (Faturalar)
CREATE TABLE IF NOT EXISTS public.accounting_invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.accounting_accounts(id) ON DELETE CASCADE,
  invoice_number VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('sales', 'purchase')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'pending', 'paid', 'cancelled', 'overdue')),
  amount DECIMAL(15, 2) NOT NULL,
  tax_amount DECIMAL(15, 2) DEFAULT 0.00,
  total_amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY' NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to update account balance on transaction insert/update/delete
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'income' THEN
      UPDATE public.accounting_accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSIF NEW.type = 'expense' THEN
      UPDATE public.accounting_accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.type = 'income' THEN
      UPDATE public.accounting_accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
    ELSIF OLD.type = 'expense' THEN
      UPDATE public.accounting_accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- First remove old impact
    IF OLD.type = 'income' THEN
      UPDATE public.accounting_accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
    ELSIF OLD.type = 'expense' THEN
      UPDATE public.accounting_accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
    END IF;

    -- Then apply new impact
    IF NEW.type = 'income' THEN
      UPDATE public.accounting_accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSIF NEW.type = 'expense' THEN
      UPDATE public.accounting_accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_balance_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.accounting_transactions
FOR EACH ROW EXECUTE FUNCTION update_account_balance();

-- Set Row Level Security (RLS)
ALTER TABLE public.accounting_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_invoices ENABLE ROW LEVEL SECURITY;

-- Create Policies (Admin only access for simplicity as requested 'yalnızca yetkili kullanıcıların erişebileceği')
-- For a robust system we can check profiles.role = 'admin'
-- Reusing standard auth policy pattern, assuming auth.uid() can join profiles table
CREATE POLICY "Admins can view accounts"
ON public.accounting_accounts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert accounts"
ON public.accounting_accounts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update accounts"
ON public.accounting_accounts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete accounts"
ON public.accounting_accounts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Similarly for transactions
CREATE POLICY "Admins can view transactions"
ON public.accounting_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert transactions"
ON public.accounting_transactions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update transactions"
ON public.accounting_transactions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete transactions"
ON public.accounting_transactions FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Similarly for invoices
CREATE POLICY "Admins can view invoices"
ON public.accounting_invoices FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert invoices"
ON public.accounting_invoices FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update invoices"
ON public.accounting_invoices FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete invoices"
ON public.accounting_invoices FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
