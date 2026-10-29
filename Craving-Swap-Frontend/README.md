# CravingSwap.ai Frontend
Next.js App Router frontend using the supplied brutalist Vadapav.ai design as visual reference and the two supplied graphics as final assets.

## Run
```powershell
copy .env.example .env.local
npm install
npm run dev
```
Keep FastAPI running on port 8000. Open the frontend on Next.js's printed local URL.

## API integration
Only supplied endpoints are used: auth register/login/refresh/me, craving analyze/history, outcomes, analytics overview/patterns. Profile editing, weekly analytics/timeline, richer dashboard fields and dedicated nearby endpoints were not present in the supplied backend contract, so the UI does not fabricate them.

## Security note
Only `NEXT_API_BASE_URL` belongs in frontend environment configuration. Never put Groq, SerpApi or database credentials here. The current backend returns bearer tokens in JSON, so this implementation stores them client-side. For a stronger production setup, change backend auth to secure HttpOnly cookies and then remove browser token storage.

## Assets
`public/terminal.jpg` and `public/vadapav.png` are copied from the supplied graphics.
