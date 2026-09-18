from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.notification import Notification

router = APIRouter(
	prefix="/api/notifications",
	tags=["Notifications"],
)


class NotificationResponse(BaseModel):
	id: int
	title: str
	description: str
	notification_type: str
	is_read: bool
	created_at: datetime | None


class NotificationListResponse(BaseModel):
	notifications: list[NotificationResponse]
	unread_count: int


class NotificationCreate(BaseModel):
	user_id: int = Field(gt=0)
	title: str = Field(min_length=1, max_length=200)
	description: str = Field(min_length=1)
	notification_type: str = Field(default="info", min_length=1, max_length=30)


def serialize_notification(notification):
	return NotificationResponse(
		id=notification.id,
		title=notification.title,
		description=notification.description,
		notification_type=notification.notification_type,
		is_read=notification.is_read,
		created_at=notification.created_at,
	)


@router.get("", response_model=NotificationListResponse)
def list_notifications(
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	notifications = (
		db.query(Notification)
		.filter(Notification.user_id == current_user.id)
		.order_by(Notification.created_at.desc(), Notification.id.desc())
		.all()
	)
	unread_count = sum(not notification.is_read for notification in notifications)

	return NotificationListResponse(
		notifications=[serialize_notification(item) for item in notifications],
		unread_count=unread_count,
	)


@router.get("/unread-count")
def unread_notification_count(
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	unread_count = (
		db.query(Notification)
		.filter(
			Notification.user_id == current_user.id,
			Notification.is_read.is_(False),
		)
		.count()
	)
	return {"unread_count": unread_count}


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
	notification_id: int,
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	notification = (
		db.query(Notification)
		.filter(
			Notification.id == notification_id,
			Notification.user_id == current_user.id,
		)
		.first()
	)
	if notification is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Notification not found",
		)

	notification.is_read = True
	db.commit()
	db.refresh(notification)
	return serialize_notification(notification)


@router.patch("/read-all")
def mark_all_notifications_read(
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	updated = (
		db.query(Notification)
		.filter(
			Notification.user_id == current_user.id,
			Notification.is_read.is_(False),
		)
		.update({Notification.is_read: True}, synchronize_session=False)
	)
	db.commit()
	return {"updated": updated}


@router.post("", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(
	payload: NotificationCreate,
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	if current_user.role.role_name.upper() not in {"ADMIN", "ANALYST"}:
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Only administrators and analysts can create notifications",
		)

	notification = Notification(**payload.model_dump())
	db.add(notification)
	db.commit()
	db.refresh(notification)
	return serialize_notification(notification)
