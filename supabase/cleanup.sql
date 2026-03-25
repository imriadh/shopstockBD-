-- ⚠️ WARNING: This will delete ALL data and tables in your public schema
-- Run this BEFORE running migrations.sql

-- Drop all tables in the correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS public.transaction_items CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop any existing indexes (in case they exist independently)
DROP INDEX IF EXISTS public.idx_products_user_id CASCADE;
DROP INDEX IF EXISTS public.idx_products_barcode CASCADE;
DROP INDEX IF EXISTS public.idx_products_sku CASCADE;
DROP INDEX IF EXISTS public.idx_products_user_barcode_unique CASCADE;
DROP INDEX IF EXISTS public.idx_transactions_user_id CASCADE;
DROP INDEX IF EXISTS public.idx_transactions_created_at CASCADE;
DROP INDEX IF EXISTS public.idx_transaction_items_transaction_id CASCADE;
DROP INDEX IF EXISTS public.idx_categories_user_id CASCADE;

-- Note: This does NOT delete auth.users - those are managed by Supabase Auth
-- If you want to delete test users, do that in Supabase Dashboard -> Authentication -> Users
