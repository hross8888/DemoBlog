from typing import Optional

import redis

redis_client: Optional[redis.Redis] = None


def get_redis() -> redis.Redis:
    assert redis_client is not None, "Redis client not initialized"
    return redis_client
