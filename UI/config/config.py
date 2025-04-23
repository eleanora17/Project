import os

class Config:
    """Base config class with common settings."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-default-secret-key')  # Set a secret key for session management
    APP_NAME = "Visual Scripting"
    APP_PORT = 5000
    

class DevelopmentConfig(Config):
    """Development-specific configuration."""
    DEBUG = True  # Enable debugging in development
    DATABASE_URI = os.environ.get('DEV_DATABASE_URI', 'sqlite:///dev.db')  # Example database URI for dev (replace as needed)
    LOGGING_LEVEL = 'DEBUG'  # More detailed logs during development

class ProductionConfig(Config):
    """Production-specific configuration."""
    DEBUG = False  # Disable debugging in production
    DATABASE_URI = os.environ.get('PROD_DATABASE_URI', 'sqlite:///prod.db')  # Example database URI for prod (replace as needed)
    LOGGING_LEVEL = 'ERROR'  # Log only errors in production

