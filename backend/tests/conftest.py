# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from unittest.mock import patch

from main import app

from core.database import get_session as core_get_session
from routers.auth import get_session as auth_get_session

from core.security import create_access_token
from models.user import User

TEST_DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/projectspace_test"
engine = create_engine(TEST_DATABASE_URL)

@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
    
    # 2. Override BOTH dependencies with our test session!
    app.dependency_overrides[core_get_session] = get_session_override
    app.dependency_overrides[auth_get_session] = get_session_override
    
    with patch("main.create_db_and_tables"):
        with TestClient(app) as client:
            yield client
        
    app.dependency_overrides.clear()
@pytest.fixture(name="auth_client")
def authenticated_client_fixture(client, session):
    test_user = User(
        fullname="Test User",
        iitk_email="test@iitk.ac.in",
        secondary_email=None,
        hashed_password="fake_hashed_password",
        is_active=True
    )
    session.add(test_user)
    session.commit()

    token = create_access_token(data={"sub": test_user.iitk_email})

    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }

    yield client