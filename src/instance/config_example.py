"""Stores environmental secrets
"""
from datetime import timedelta

SECRET_KEY = "Insert Some Secure Secret Key Here"
JWT_SECRET_KEY = "A very secret JWT key"
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=5)