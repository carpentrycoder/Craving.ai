# CravingSwap.ai Backend

FastAPI backend created from the supplied Vadapav.ai files. The original SerpApi distance-filtering idea is generalized to arbitrary healthier-food searches. MCP is not required for the REST frontend contract.

## Included
JWT registration/login/refresh/logout, PostgreSQL SQLAlchemy models, Alembic, craving analysis with Groq JSON validation and deterministic fallback, three suggestion levels, SerpApi nearby search, Open-Meteo context, outcome/relapse tracking, Decimal savings, analytics, ownership isolation, Docker, request IDs and tests.

## Run
```bash
python -m venv .venv
pip install -r requirements.txt
cp .env.example .env
# put Neon DATABASE_URL and API keys only in .env
alembic upgrade head
uvicorn app.main:app --reload
```
Open `/docs`. Health is `/api/v1/health`; readiness is `/api/v1/health/ready`.

## Docker
```bash
docker compose up --build
```
For local Compose use `postgresql+psycopg://cravingswap:local_change_me@db:5432/cravingswap` as DATABASE_URL. For Neon use the provider URL with `postgresql+psycopg://` and required SSL query parameters.

## Main endpoints
- `POST /api/v1/auth/register`, `/login`, `/refresh`, `/logout`; `GET /me`
- `POST /api/v1/cravings/analyze`; `GET /api/v1/cravings`; `GET/DELETE /api/v1/cravings/{id}`
- `POST /api/v1/outcomes/sessions/{id}`
- `GET /api/v1/analytics/overview`, `/craving-patterns`

## Example
```bash
curl -X POST http://localhost:8000/api/v1/auth/register -H 'Content-Type: application/json' -d '{"email":"user@example.com","password":"strong-password"}'
curl -X POST http://localhost:8000/api/v1/cravings/analyze -H 'Authorization: Bearer ACCESS_TOKEN' -H 'Content-Type: application/json' -d '{"craving":"spicy cheese pizza","latitude":19.076,"longitude":72.877,"includeNearby":true}'
```

## Tests
```bash
pytest -q
python -m compileall app tests alembic
```
External services are isolated behind services and should be mocked in expanded API tests.

## Production notes
Review the initial migration against an existing production schema before applying it. Back up data first. Use `alembic downgrade -1` for rollback. Secrets are never committed; `.env` is ignored. Add gateway rate limiting through Azure API Management, Cloudflare, or NGINX before public exposure. Location is used per request and is not persisted. Rotate any credential that has been shared publicly.
