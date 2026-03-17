# Vercel Deployment Fix - TODO

✅ **1. Create/update TODO.md** (done)

⏳ **2. Edit frontend/package.json** - Downgrade Next.js to 15.4.0, React 18.3.1, Tailwind 3.4.0, eslint-config-next@15

⏳ **3. Update frontend/next.config.ts** - Add experimental.turbo.noTurbo: true

⏳ **4. Delete frontend/package-lock.json**

⏳ **5. execute_command: cd frontend && npm install**

⏳ **6. execute_command: cd frontend && npm run build** (local test)

⏳ **7. Commit changes & push** (manual: git add/commit/push)

⏳ **8. Redeploy on Vercel** (triggers on push)
