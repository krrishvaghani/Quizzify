from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routes.auth import router as auth_router
from app.routes.quiz import router as quiz_router
from app.routes.analytics import router as analytics_router
from app.routes.google_auth import router as google_auth_router
from app.routes.chat import router as chat_router
from app.core.database import connect_to_mongo, close_mongo_connection, ping_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Adaptive Learning Platform API", 
        version="0.1.0",
        lifespan=lifespan
    )

    # CORS for frontend dev server
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
    app.include_router(quiz_router, prefix="/api/quiz", tags=["quiz"])
    app.include_router(analytics_router, prefix="/api/analytics", tags=["analytics"])
    app.include_router(google_auth_router, prefix="/api/auth", tags=["auth"])
    app.include_router(chat_router, prefix="/api/chat", tags=["chat"])

    @app.get("/api/health")
    async def health() -> dict:
        db_status = await ping_database()
        return {
            "status": "ok",
            "database": "connected" if db_status else "disconnected"
        }

    @app.get("/")
    async def root() -> RedirectResponse:
        return RedirectResponse(url="/docs")

    return app


app = create_app()


