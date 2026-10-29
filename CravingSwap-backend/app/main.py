import logging
import time
import uuid

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1 import (
    auth,
    users,
    cravings,
    outcomes,
    analytics,
    health,
)

logging.basicConfig(level="INFO")

app = FastAPI(
    title="CravingSwap.ai API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_id(req: Request, call_next):
    rid = req.headers.get(
        "X-Request-ID",
        str(uuid.uuid4()),
    )

    req.state.request_id = rid
    start = time.perf_counter()

    res = await call_next(req)

    res.headers["X-Request-ID"] = rid

    logging.info(
        "%s %s %s %.2fms",
        rid,
        req.url.path,
        res.status_code,
        (time.perf_counter() - start) * 1000,
    )

    return res


for router in [
    auth.r,
    users.r,        # important
    cravings.r,
    outcomes.r,
    analytics.r,
    health.r,
]:
    app.include_router(
        router,
        prefix="/api/v1",
    )