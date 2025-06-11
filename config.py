import os

# Load secrets from environment if present, or use defaults for local/dev.
MYSQL_CONFIG = {
    'host': os.environ.get('MYSQL_HOST', 'localhost'),
    'user': os.environ.get('MYSQL_USER', 'root'),
    'password': os.environ.get('MYSQL_PASSWORD', ''),
    'database': os.environ.get('MYSQL_DB', 'guvi'),
    'port': int(os.environ.get('MYSQL_PORT', 3306))
}

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.environ.get('REDIS_PORT', 6379))

SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key')
UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'static/uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 2 * 1024 * 1024  # 2MB max upload size
SESSION_COOKIE_NAME = 'guvi_session'
SESSION_EXPIRE_SECONDS = 3600  # 1 hour
