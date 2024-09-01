from functools import lru_cache
from pydantic_settings import BaseSettings
from pathlib import Path
import json
from typing import Dict, Any

ROOT_DIR = Path(__file__).parent.parent.parent
CONFIG_JSON_PATH = ROOT_DIR / "config.json"
SETTING_JSON_PATH = ROOT_DIR / "setting.json"


class Settings(BaseSettings):
    LOGIN_URL: str = "https://passport.escience.cn/oauth2/authorize?client_id=47447&redirect_uri=https%3A%2F%2Fwired.ime.ac.cn%2Fsrun_portal_sso&response_type=code&state=1&theme=simple"
    RECONNECT_INTERVAL_MINUTES: int = 1 * 60  # 1 hour
    HEAD_LESS: bool = True

    @classmethod
    def load_from_file(cls, file_path: Path) -> 'Settings':
        if file_path.exists():
            with file_path.open('r') as f:
                config_data = json.load(f)
            return cls(**config_data)
        return cls()

    def save_to_file(self, file_path: Path):
        config_data = self.dict()
        with file_path.open('w') as f:
            json.dump(config_data, f, indent=2)


class SettingsManager:
    def __init__(self, config_path: Path = SETTING_JSON_PATH):
        self.config_path = config_path
        self.settings = Settings.load_from_file(config_path)

    def get_settings(self) -> Settings:
        return self.settings

    def update_settings(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self.settings, key):
                setattr(self.settings, key, value)
        self.settings.save_to_file(self.config_path)

    def reload_settings(self):
        self.settings = Settings.load_from_file(self.config_path)


settings_manager = SettingsManager()


def get_settings() -> Settings:
    return settings_manager.get_settings()


if __name__ == "__main__":
    from loguru import logger

    logger.debug(ROOT_DIR)

    # Load settings from file
    settings = get_settings()
    print("Initial settings:", settings)

    # Update a setting
    settings_manager.update_settings(HEAD_LESS=True)

    # Clear the lru_cache to force a refresh

    # Get updated settings
    updated_settings = get_settings()
    print("Updated settings:", updated_settings)

    # Reload settings from file
    settings_manager.reload_settings()
    reloaded_settings = get_settings()
    print("Reloaded settings:", reloaded_settings)