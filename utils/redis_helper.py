import redis
from config import REDIS_HOST, REDIS_PORT

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

def set_session(email):
    r.set(email, "active", ex=3600)

def get_session(email):
    return r.get(email)