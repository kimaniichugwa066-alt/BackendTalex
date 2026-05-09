# Migration 20260510_optional_phone

This migration makes the `phone` field on the `User` table optional by allowing NULL values.

Run:

```bash
npx prisma migrate deploy
```
