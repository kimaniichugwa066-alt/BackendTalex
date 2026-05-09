# PostgreSQL Setup Guide for BackendTalex

## Current Setup

Your backend is using **Prisma ORM** with PostgreSQL, which is already configured in:
- `prisma/schema.prisma` - Database schema definition
- `.env` - Database connection URL
- `src/prisma/client.ts` - Prisma client initialization

## Database Connection

### 1. Environment Variables (.env)

```env
DATABASE_URL=postgresql://neondb_owner:npg_yZhFQgbPc50I@ep-sweet-water-aph1j617.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**For Render PostgreSQL:**
```env
DATABASE_URL=postgresql://user:password@dpg-xxxxx.render.com:5432/dbname
```

**For Local PostgreSQL:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
```

### 2. SSL Configuration

For Render and cloud PostgreSQL, SSL is **required**:

**Prisma** (already configured):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

The `?sslmode=require` in your DATABASE_URL handles SSL automatically.

**Raw pg connection** (in `db.js`):
```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
```

## Server Startup

Your `src/server.ts` now includes PostgreSQL connection testing:

```typescript
import pool from '../db';

// Test PostgreSQL connection
pool.connect()
  .then(() => {
    console.log("✅ PostgreSQL connected");
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });
```

## Using Prisma (Recommended)

All your controllers use Prisma for database operations:

```typescript
// Create user
const user = await prisma.user.create({
  data: { name, email, phone, password, role: 'USER' }
});

// Find user
const user = await prisma.user.findUnique({ where: { email } });

// Update user
await prisma.user.update({
  where: { email },
  data: { isVerified: true }
});
```

## Raw SQL Queries (Optional)

If you need raw SQL, use `db.js`:

```typescript
import pool from '../db';

// Raw query example
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

## Database Tables (Prisma Models)

Your Prisma schema defines:
- **User** - User accounts with auth fields
- **Job** - Job postings
- **Application** - Job applications
- **Payment** - Payment records
- **Notification** - User notifications
- **Document** - Resume/document storage
- **SupportRequest** - Support tickets
- **Report** - User reports

## Important Notes

1. **SSL is required** for Render and cloud databases
2. **Prisma handles connection pooling** automatically
3. **Use `npm run prisma:migrate`** for database migrations
4. **Use `npm run prisma:generate`** after schema changes
5. The `db.js` pool is used for connection testing, Prisma for operations

## Testing Connection

```bash
npm run dev
# Look for: ✅ PostgreSQL connected
```

## Troubleshooting

**Connection fails:**
- Check `DATABASE_URL` is correct in `.env`
- Ensure SSL is enabled: `?sslmode=require`
- Verify network access (IP whitelist on cloud DB)

**Prisma client errors:**
- Run: `npm run prisma:generate`
- Run: `npm install`

**Migration issues:**
- Run: `npm run prisma:migrate`
- Check `prisma/migrations/` folder

## Render PostgreSQL Setup

1. Create PostgreSQL service on Render
2. Copy connection string from dashboard
3. Add `?sslmode=require` to the URL
4. Set `DATABASE_URL` in `.env`
5. Deploy and test
