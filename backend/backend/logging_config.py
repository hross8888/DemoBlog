import sys

from loguru import logger

logger.remove()

logger.add("logs/app.log",
           enqueue=False,
           rotation="50 MB",
           retention="10 days",
           compression="zip",
           level="DEBUG",
           format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}"
           )


logger.add(
    sys.stdout,
    level="DEBUG",
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level}</level> | {message}"
)
