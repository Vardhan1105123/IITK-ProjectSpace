from sqlmodel import select
from models.notification import Notification
from core.utils import NotificationType


def test_get_notifications_empty(auth_client):
    response = auth_client.get("/notifications")

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 0
    assert data["unread_count"] == 0
    assert data["results"] == []


def test_get_notifications_with_data(auth_client, session):
    # Get test user
    user_id = session.exec(select(Notification)).first()
    
    # Create notification manually
    notif = Notification(
        recipient_id=auth_client.headers,  # we’ll fix below
        type=NotificationType.VERIFICATION_REQUEST,
        title="Test Notification",
        message="Hello",
        link="/test"
    )

    # IMPORTANT: get actual user id
    from models.user import User
    user = session.exec(select(User)).first()

    notif.recipient_id = user.id

    session.add(notif)
    session.commit()

    response = auth_client.get("/notifications")

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 1
    assert len(data["results"]) == 1
    assert data["results"][0]["title"] == "Test Notification"

def test_mark_notification_read(auth_client, session):
    from models.user import User

    user = session.exec(select(User)).first()

    notif = Notification(
        recipient_id=user.id,
        type=NotificationType.VERIFICATION_REQUEST,
        title="Test",
        message="Msg",
        link="/test",
        is_read=False
    )

    session.add(notif)
    session.commit()
    session.refresh(notif)

    response = auth_client.patch(f"/notifications/{notif.id}/read")

    assert response.status_code == 200
    assert response.json()["message"] == "Notification marked as read"

    updated = session.get(Notification, notif.id)
    assert updated.is_read is True

def test_mark_all_notifications_read(auth_client, session):
    from models.user import User

    user = session.exec(select(User)).first()

    notif1 = Notification(
        recipient_id=user.id,
        type=NotificationType.VERIFICATION_REQUEST,
        title="N1",
        message="Msg",
        link="/test",
        is_read=False
    )

    notif2 = Notification(
        recipient_id=user.id,
        type=NotificationType.VERIFICATION_REQUEST,
        title="N2",
        message="Msg",
        link="/test",
        is_read=False
    )

    session.add(notif1)
    session.add(notif2)
    session.commit()

    response = auth_client.patch("/notifications/read-all")

    assert response.status_code == 200

    updated1 = session.get(Notification, notif1.id)
    updated2 = session.get(Notification, notif2.id)

    assert updated1.is_read is True
    assert updated2.is_read is True
def test_notifications_user_specific(auth_client, session):
    from models.notification import Notification
    from models.user import User
    from core.utils import NotificationType

    # create another user
    other_user = User(
        fullname="Other User",
        iitk_email="other@iitk.ac.in",
        hashed_password="fake",
        is_active=True
    )

    session.add(other_user)
    session.commit()

    # notification for other user
    notif = Notification(
        recipient_id=other_user.id,
        type=NotificationType.VERIFICATION_REQUEST,
        title="Other",
        message="Test",
        link="/test"
    )

    session.add(notif)
    session.commit()

    response = auth_client.get("/notifications")

    data = response.json()

    # logged-in user should not see it
    assert data["total"] == 0