import os

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("SECRET_KEY", "test-secret-key-for-pytest")

from src.main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
