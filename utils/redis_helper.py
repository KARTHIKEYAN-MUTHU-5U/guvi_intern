# FILE: utils/redis_helper.py

import redis
import secrets
from config import REDIS_HOST, REDIS_PORT, SESSION_EXPIRE_SECONDS

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

def create_session(email):
    token = secrets.token_urlsafe(32)
    r.set(f"session:{token}", email, ex=SESSION_EXPIRE_SECONDS)
    return token

def get_session_email(token):
    return r.get(f"session:{token}")

def delete_session(token):
    r.delete(f"session:{token}")
