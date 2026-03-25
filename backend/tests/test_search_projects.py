from sqlmodel import select
from models.project import Project
from models.user import User


def test_search_projects_basic(auth_client, session):
    user = session.exec(select(User)).first()

    project = Project(
        title="AI Research",
        summary="Machine learning project",
        description="Deep learning",
        creator_id=user.id,
        domains=["AI"]
    )

    session.add(project)
    session.commit()

    response = auth_client.get("/search/projects?q=AI")

    assert response.status_code == 200
    data = response.json()

    assert data["total"] >= 1
    assert len(data["results"]) >= 1
    assert "AI" in data["results"][0]["title"]
def test_search_projects_no_results(auth_client):
    response = auth_client.get("/search/projects?q=nonexistent")

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 0
    assert data["results"] == []
def test_search_projects_domain_filter(auth_client, session):
    from models.user import User
    user = session.exec(select(User)).first()

    project = Project(
        title="Web App",
        summary="Frontend",
        description="React",
        creator_id=user.id,
        domains=["Web"]
    )

    session.add(project)
    session.commit()

    response = auth_client.get("/search/projects?domain=Web")

    assert response.status_code == 200
    data = response.json()

    assert data["total"] >= 1
    assert data["results"][0]["title"] == "Web App"

def test_search_projects_pagination(auth_client, session):
    from models.user import User
    user = session.exec(select(User)).first()

    for i in range(5):
        project = Project(
            title=f"Project {i}",
            summary="test",
            description="test",
            creator_id=user.id
        )
        session.add(project)

    session.commit()

    response = auth_client.get("/search/projects?limit=2&offset=0")

    assert response.status_code == 200
    data = response.json()

    assert len(data["results"]) == 2

def test_search_projects_multiple_domains(auth_client, session):
    from models.project import Project
    from models.user import User

    user = session.exec(select(User)).first()

    project = Project(
        title="AI Web Project",
        summary="Test",
        description="Test",
        creator_id=user.id,
        domains=["AI", "Web"]
    )

    session.add(project)
    session.commit()

    response = auth_client.get(
        "/search/projects",
        params={"domain": ["AI", "Web"]}
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] >= 1