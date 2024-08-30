import asyncio

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from src.imecas_auto_reconnect.configs import get_settings
from src.imecas_auto_reconnect.login_manager import login_async

class ReconnectScheduler:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.setup_job()

    def setup_job(self):
        self.scheduler.add_job(
            login_async,
            trigger=IntervalTrigger(minutes=get_settings().RECONNECT_INTERVAL_MINUTES),
            id="reconnect",
            name=f"Reconnect usage limits every {get_settings().RECONNECT_INTERVAL_MINUTES} minutes",
            replace_existing=True,
        )

    async def start(self):
        # just run it first
        await login_async()
        self.scheduler.start()
        try:
            # Keep the scheduler running
            while True:
                await asyncio.sleep(1)
        except (KeyboardInterrupt, SystemExit):
            await self.shutdown()

    async def shutdown(self):
        self.scheduler.shutdown()