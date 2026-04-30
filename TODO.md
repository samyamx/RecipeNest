# Fix MongoDB TLS Error on Windows 11

## Steps
- [x] 1. Edit `lib/mongodb.ts` - add conditional TLS options to MongoClient
- [x] 2. Edit `lib/auth.ts` - replace `getDatabase()` with `getDatabaseSafely()`, add null checks
- [x] 3. Verify with TypeScript and production build
