from sqlmodel import select
from models.user import User


def test_search_users_basic(auth_client, session):
    user = User(
        fullname="Rahul Sharma",
        iitk_email="rahul@iitk.ac.in",
        hashed_password="fake",
        is_active=True
    )

    session.add(user)
    session.commit()

    response = auth_client.get("/search/users?q=Rahul")

    assert response.status_code == 200
    data = response.json()

    assert data["total"] >= 1
    assert len(data["results"]) >= 1
    assert "Rahul" in data["results"][0]["fullname"]


def test_search_users_email(auth_client, session):
    user = User(
        fullname="Ankit Verma",
        iitk_email="ankit@iitk.ac.in",
        hashed_password="fake",
        is_active=True
    )

    session.add(user)
    session.commit()

    response = auth_client.get("/search/users?q=ankit@iitk")

    assert response.status_code == 200
    data = response.json()

    assert data["total"] >= 1


def test_search_users_no_results(auth_client):
    response = auth_client.get("/search/users?q=nonexistentuser")

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 0
    assert data["results"] == []


def test_search_users_pagination(auth_client, session):
    for i in range(5):
        user = User(
            fullname=f"User {i}",
            iitk_email=f"user{i}@iitk.ac.in",
            hashed_password="fake",
            is_active=True
        )
        session.add(user)

    session.commit()

    response = auth_client.get("/search/users?limit=2&offset=0")

    assert response.status_code == 200
    data = response.json()

    assert len(data["results"]) == 2


def test_search_users_filter_department(auth_client, session):
    from core.utils import Department
    from models.user import User

    user = User(
        fullname="CSE Student",
        iitk_email="cse@iitk.ac.in",
        hashed_password="fake",
        is_active=True,
        department=Department.CSE
    )

    session.add(user)
    session.commit()

    response = auth_client.get(
        "/search/users",
        params={"department": [Department.CSE.value]}
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] >= 1
def test_search_users_case_insensitive(auth_client, session):
    from models.user import User

    user = User(
        fullname="Rahul Sharma",
        iitk_email="rahul@iitk.ac.in",
        hashed_password="fake",
        is_active=True
    )

    session.add(user)
    session.commit()

    response = auth_client.get("/search/users?q=rahul")

    assert response.status_code == 200
    data = response.json()

    assert data["total"] >= 1
def test_search_users_query_and_department(auth_client, session):
    from models.user import User
    from core.utils import Department

    user = User(
        fullname="Ankit CSE",
        iitk_email="ankit@iitk.ac.in",
        hashed_password="fake",
        is_active=True,
        department=Department.CSE
    )

    session.add(user)
    session.commit()

    response = auth_client.get(
        "/search/users",
        params={
            "q": "Ankit",
            "department": [Department.CSE.value]
        }
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] >= 1