from unittest.mock import patch
from sqlmodel import select
from models.user import User
from models.project import ProjectPendingLink

def test_create_project_with_invites_complete(auth_client, session):
    # Create a friend to invite
    friend = User(
        fullname="Alan Turing",
        iitk_email="alan@iitk.ac.in",
        secondary_email=None,
        hashed_password="fake_password",
        is_active=True
    )
    session.add(friend)
    session.commit()
    session.refresh(friend) 

    project_data = {
        "title": "Enigma Machine Simulator",
        "summary": "Breaking codes.",
        "description": "Top secret project.",
        "team_member_ids": [str(friend.id)]
    }

    with patch("routers.projects.create_notification") as mock_notify:
        response = auth_client.post("/projects/", json=project_data)

    # API Response Assertions
    assert response.status_code == 201
    data = response.json()
    
    assert data["title"] == "Enigma Machine Simulator"
    assert data["creator_name"] == "Test User"
    assert data["creator_id"] is not None

    # Database State Assertions
    pending_invite = session.exec(
        select(ProjectPendingLink).where(ProjectPendingLink.user_id == friend.id)
    ).first()
    
    assert pending_invite is not None
    assert str(pending_invite.project_id) == data["id"]

    # Notification System Assertions
    mock_notify.assert_called_once()
    
    _, kwargs = mock_notify.call_args
    assert kwargs["recipient_id"] == friend.id
    assert kwargs["title"] == "Project Team Invitation"
    assert "invited you to join" in kwargs["message"]