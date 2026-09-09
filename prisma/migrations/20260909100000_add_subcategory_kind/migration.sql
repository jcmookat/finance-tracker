-- AlterEnum
-- Split into its own migration: Postgres forbids using a newly-added enum
-- value in the same transaction that adds it, so the seed insert that uses
-- 'SUB_CATEGORY' lives in the following migration.
ALTER TYPE "TransactionOptionKind" ADD VALUE 'SUB_CATEGORY';
