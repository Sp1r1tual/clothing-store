-- Migration: make-address-carrier-warehouse-required
-- Makes carrier and warehouse NOT NULL in the addresses table.
-- Step 1: Delete any existing rows where carrier or warehouse is NULL
--         (these are incomplete/invalid addresses that can't be migrated)
DELETE FROM addresses WHERE carrier IS NULL OR warehouse IS NULL;

-- Step 2: Alter columns to NOT NULL
ALTER TABLE addresses
  ALTER COLUMN carrier SET NOT NULL,
  ALTER COLUMN warehouse SET NOT NULL;
