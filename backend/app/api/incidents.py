from datetime import datetime

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.incident import Incident

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])


class IncidentCreate(BaseModel):
	title: str = Field(min_length=3, max_length=200)
	description: str = Field(min_length=10)
	severity: str = Field(default="Medium", pattern="^(Low|Medium|High|Critical)$")


class IncidentResponse(BaseModel):
	id: int
	title: str
	description: str
	severity: str
	status: str
	created_at: datetime | None


@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(
	payload: IncidentCreate,
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	incident = Incident(user_id=current_user.id, **payload.model_dump())
	db.add(incident)
	db.commit()
	db.refresh(incident)
	return incident


@router.get("", response_model=list[IncidentResponse])
def list_incidents(
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	query = db.query(Incident)
	if current_user.role.role_name.upper() == "EMPLOYEE":
		query = query.filter(Incident.user_id == current_user.id)
	return query.order_by(Incident.created_at.desc(), Incident.id.desc()).all()
