from fastapi import FastAPI

from backend.app.api.router import api_router
from backend.app.core.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()

    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
    )
    application.include_router(
        api_router,
        prefix=settings.api_prefix,
    )

    return application


app = create_app()
