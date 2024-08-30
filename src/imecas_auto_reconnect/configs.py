from functools import lru_cache
from pydantic_settings import BaseSettings
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.parent
CONFIG_JSON_PATH = ROOT_DIR / "config.json"

class Settings(BaseSettings):
    LOGIN_URL: str = "https://passport.escience.cn/oauth2/authorize?client_id=47447&redirect_uri=https%3A%2F%2Fwired.ime.ac.cn%2Fsrun_portal_sso&response_type=code&state=1&theme=simple"
    RECONNECT_INTERVAL_MINUTES: int = 1 * 60 # 1 hour
    HEAD_LESS: bool = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()



if __name__ == "__main__":
    # 使用
    from loguru import logger
    logger.debug(ROOT_DIR)
    settings = get_settings()
    print(settings)