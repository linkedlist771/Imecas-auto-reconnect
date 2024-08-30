import asyncio
from src.imecas_auto_reconnect.scheduler import ReconnectScheduler


async def main():
    scheduler = ReconnectScheduler()
    await scheduler.start()

if __name__ == "__main__":
    asyncio.run(main())