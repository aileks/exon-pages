import uuid
from datetime import datetime
from .db import db, environment, SCHEMA


class Note(db.Model):
    __tablename__ = "notes"
    if environment == "prod":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(
        db.UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False
    )
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    tags = db.Column(db.String(255))  # Comma-separated tags

    user = db.relationship("User", back_populates="notes")

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "title": self.title,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "tags": self.tags.split(",") if self.tags else [],
        }


class Experiment(db.Model):
    __tablename__ = "experiments"
    if environment == "prod":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(
        db.UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False
    )
    title = db.Column(db.String(255), nullable=False)
    hypothesis = db.Column(db.Text, nullable=False)
    materials = db.Column(db.Text)
    methods = db.Column(db.Text, nullable=False)
    results = db.Column(db.Text)
    conclusion = db.Column(db.Text)
    status = db.Column(
        db.String(50), default="planned"
    )  # planned, in_progress, completed, failed
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    references = db.Column(db.Text)

    user = db.relationship("User", back_populates="experiments")
    steps = db.relationship(
        "ExperimentStep", back_populates="experiment", cascade="all, delete-orphan"
    )
    attachments = db.relationship(
        "ExperimentAttachment",
        back_populates="experiment",
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "title": self.title,
            "hypothesis": self.hypothesis,
            "materials": self.materials,
            "methods": self.methods,
            "results": self.results,
            "conclusion": self.conclusion,
            "status": self.status,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": (
                self.completed_at.isoformat() if self.completed_at else None
            ),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "references": self.references,
            "steps": [step.to_dict() for step in self.steps],
            "attachments": [attachment.to_dict() for attachment in self.attachments],
        }


class ExperimentStep(db.Model):
    __tablename__ = "experiment_steps"
    if environment == "prod":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    experiment_id = db.Column(
        db.UUID(as_uuid=True), db.ForeignKey("experiments.id"), nullable=False
    )
    step_number = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=False)
    observation = db.Column(db.Text)
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    experiment = db.relationship("Experiment", back_populates="steps")

    def to_dict(self):
        return {
            "id": str(self.id),
            "experiment_id": str(self.experiment_id),
            "step_number": self.step_number,
            "description": self.description,
            "observation": self.observation,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": (
                self.completed_at.isoformat() if self.completed_at else None
            ),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class ExperimentAttachment(db.Model):
    __tablename__ = "experiment_attachments"
    if environment == "prod":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    experiment_id = db.Column(
        db.UUID(as_uuid=True), db.ForeignKey("experiments.id"), nullable=False
    )
    file_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(100), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    experiment = db.relationship("Experiment", back_populates="attachments")

    def to_dict(self):
        return {
            "id": str(self.id),
            "experiment_id": str(self.experiment_id),
            "file_name": self.file_name,
            "file_type": self.file_type,
            "file_path": self.file_path,
            "description": self.description,
            "created_at": self.created_at.isoformat(),
        }
