from functools import lru_cache
from pydantic_settings import BaseSettings
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.parent
CONFIG_JSON_PATH = ROOT_DIR / "config.json"

class Settings(BaseSettings):
    LOGIN_URL: str = "https://passport.escience.cn/"
    RECONNECT_INTERVAL_MINUTES: int = 1 * 60 # 1 hour

@lru_cache()
def get_settings() -> Settings:
    return Settings()



if __name__ == "__main__":
    # 使用
    from loguru import logger
    logger.debug(ROOT_DIR)
    settings = get_settings()
    print(settings)