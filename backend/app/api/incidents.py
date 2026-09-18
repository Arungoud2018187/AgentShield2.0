from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
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
	log_file_name: str | None = None
	log_file_content: str | None = None


class IncidentResponse(BaseModel):
	id: int
	title: str
	description: str
	severity: str
	status: str
	created_at: datetime | None
	reporter_name: str | None = None
	reporter_email: str | None = None
	reporter_employee_id: str | None = None
	reporter_department: str | None = None
	log_file_name: str | None = None
	log_file_content: str | None = None


def _to_response(inc: Incident) -> IncidentResponse:
	user = inc.user
	dept_name = user.department.department_name if (user and user.department) else None
	return IncidentResponse(
		id=inc.id,
		title=inc.title,
		description=inc.description,
		severity=inc.severity,
		status=inc.status,
		created_at=inc.created_at,
		reporter_name=user.full_name if user else "Employee",
		reporter_email=user.email if user else None,
		reporter_employee_id=user.employee_id if user else None,
		reporter_department=dept_name,
		log_file_name=inc.log_file_name,
		log_file_content=inc.log_file_content,
	)


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
	return _to_response(incident)


@router.get("", response_model=list[IncidentResponse])
def list_incidents(
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	query = db.query(Incident)
	if current_user.role.role_name.upper() == "EMPLOYEE":
		query = query.filter(Incident.user_id == current_user.id)
	incidents = query.order_by(Incident.created_at.desc(), Incident.id.desc()).all()
	return [_to_response(inc) for inc in incidents]


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(
	incident_id: int,
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	incident = db.query(Incident).filter(Incident.id == incident_id).first()
	if not incident:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
	if current_user.role.role_name.upper() == "EMPLOYEE" and incident.user_id != current_user.id:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
	return _to_response(incident)


@router.get("/{incident_id}/download")
def download_incident(
	incident_id: int,
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	incident = db.query(Incident).filter(Incident.id == incident_id).first()
	if not incident:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
	if current_user.role.role_name.upper() == "EMPLOYEE" and incident.user_id != current_user.id:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

	user = incident.user
	dept_name = user.department.department_name if (user and user.department) else "General"
	payload_data = {
		"report_metadata": {
			"system": "AgentShield AI Security Platform",
			"schema": "AgentShield-Incident-Report-v1",
			"exported_at": datetime.utcnow().isoformat() + "Z",
			"exported_by": current_user.full_name,
			"classification": "INTERNAL CONFIDENTIAL - SOC INCIDENT REPORT",
		},
		"incident": {
			"incident_id": f"INC-{incident.id:04d}",
			"id": incident.id,
			"title": incident.title,
			"severity": incident.severity,
			"status": incident.status,
			"created_at": incident.created_at.isoformat() if incident.created_at else None,
			"description": incident.description,
			"evidence_log_file": {
				"filename": incident.log_file_name,
				"content": incident.log_file_content,
			} if incident.log_file_name else None,
		},
		"reporter": {
			"full_name": user.full_name if user else "Employee",
			"employee_id": user.employee_id if user else "EMP003",
			"email": user.email if user else "employee@agentshield.com",
			"department": dept_name,
		},
		"soc_analyst_instructions": {
			"next_steps": "Open or upload this file into AgentShield Security Copilot to execute automated threat vector analysis, MITRE ATT&CK correlation, and containment playbooks.",
			"triage_priority": "High" if incident.severity in ["High", "Critical"] else "Standard",
		},
	}

	return JSONResponse(
		content=payload_data,
		headers={
			"Content-Disposition": f'attachment; filename="AgentShield-Incident-INC-{incident.id:04d}.json"',
			"Content-Type": "application/json",
		},
	)


@router.get("/{incident_id}/raw-log")
def download_incident_raw_log(
	incident_id: int,
	db: Session = Depends(get_db),
	current_user=Depends(get_current_user),
):
	from fastapi.responses import PlainTextResponse

	incident = db.query(Incident).filter(Incident.id == incident_id).first()
	if not incident or not incident.log_file_content:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No log file attached to this incident")
	if current_user.role.role_name.upper() == "EMPLOYEE" and incident.user_id != current_user.id:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

	filename = incident.log_file_name or f"incident_{incident.id}_evidence.log"
	return PlainTextResponse(
		content=incident.log_file_content,
		headers={
			"Content-Disposition": f'attachment; filename="{filename}"',
			"Content-Type": "text/plain; charset=utf-8",
		},
	)
