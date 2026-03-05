-- BRAIDLY Clean Schema - Drop All Old Tables First
-- Run this FIRST to clean up

DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS braiders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Verify all tables are gone
SELECT 'All tables dropped successfully' as status;
