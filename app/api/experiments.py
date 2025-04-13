from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
import uuid
from datetime import datetime

from app.models import Experiment, ExperimentStep, ExperimentAttachment, db

experiments = Blueprint("experiments", __name__)


@experiments.route("", methods=["GET"])
@login_required
def get_experiments():
    user_experiments = (
        Experiment.query.filter_by(user_id=current_user.id)
        .order_by(Experiment.updated_at.desc())
        .all()
    )
    return jsonify([experiment.to_dict() for experiment in user_experiments]), 200


@experiments.route("/<experiment_id>", methods=["GET"])
@login_required
def get_experiment(experiment_id):
    try:
        experiment_uuid = uuid.UUID(experiment_id)
        experiment = Experiment.query.filter_by(
            id=experiment_uuid, user_id=current_user.id
        ).first()

        if not experiment:
            return jsonify({"error": "Experiment not found"}), 404

        return jsonify(experiment.to_dict()), 200
    except ValueError:
        return jsonify({"error": "Invalid experiment ID format"}), 400


@experiments.route("", methods=["POST"])
@login_required
def create_experiment():
    data = request.json

    if (
        not data
        or not data.get("title")
        or not data.get("hypothesis")
        or not data.get("methods")
    ):
        return jsonify({"error": "Missing required fields"}), 400

    new_experiment = Experiment(
        user_id=current_user.id,
        title=data["title"],
        hypothesis=data["hypothesis"],
        materials=data.get("materials", ""),
        methods=data["methods"],
        status="planned",
    )

    if data.get("steps"):
        for i, step_data in enumerate(data["steps"]):
            step = ExperimentStep(
                step_number=i + 1,
                description=step_data["description"],
                observation=step_data.get("observation", ""),
            )
            new_experiment.steps.append(step)

    db.session.add(new_experiment)
    db.session.commit()

    return jsonify(new_experiment.to_dict()), 201


@experiments.route("/<experiment_id>", methods=["PUT"])
@login_required
def update_experiment(experiment_id):
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        experiment_uuid = uuid.UUID(experiment_id)
        experiment = Experiment.query.filter_by(
            id=experiment_uuid, user_id=current_user.id
        ).first()

        if not experiment:
            return jsonify({"error": "Experiment not found"}), 404

        for field in [
            "title",
            "hypothesis",
            "materials",
            "methods",
            "results",
            "conclusion",
            "references",
        ]:
            if field in data:
                setattr(experiment, field, data[field])

        if "status" in data:
            old_status = experiment.status
            new_status = data["status"]
            experiment.status = new_status

            if old_status != "in_progress" and new_status == "in_progress":
                experiment.started_at = datetime.utcnow()
            elif old_status != "completed" and new_status == "completed":
                experiment.completed_at = datetime.utcnow()

        if "steps" in data:
            for step in experiment.steps:
                db.session.delete(step)

            for i, step_data in enumerate(data["steps"]):
                step = ExperimentStep(
                    experiment_id=experiment.id,
                    step_number=i + 1,
                    description=step_data["description"],
                    observation=step_data.get("observation", ""),
                    started_at=(
                        datetime.fromisoformat(step_data["started_at"])
                        if step_data.get("started_at")
                        else None
                    ),
                    completed_at=(
                        datetime.fromisoformat(step_data["completed_at"])
                        if step_data.get("completed_at")
                        else None
                    ),
                )
                experiment.steps.append(step)

        db.session.commit()

        return jsonify(experiment.to_dict()), 200
    except ValueError:
        return jsonify({"error": "Invalid experiment ID format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@experiments.route("/<experiment_id>", methods=["DELETE"])
@login_required
def delete_experiment(experiment_id):
    try:
        experiment_uuid = uuid.UUID(experiment_id)
        experiment = Experiment.query.filter_by(
            id=experiment_uuid, user_id=current_user.id
        ).first()

        if not experiment:
            return jsonify({"error": "Experiment not found"}), 404

        db.session.delete(experiment)
        db.session.commit()

        return jsonify({"message": "Experiment deleted successfully"}), 200
    except ValueError:
        return jsonify({"error": "Invalid experiment ID format"}), 400


@experiments.route("/<experiment_id>/steps", methods=["POST"])
@login_required
def add_experiment_step(experiment_id):
    data = request.json

    if not data or not data.get("description"):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        experiment_uuid = uuid.UUID(experiment_id)
        experiment = Experiment.query.filter_by(
            id=experiment_uuid, user_id=current_user.id
        ).first()

        if not experiment:
            return jsonify({"error": "Experiment not found"}), 404

        highest_step = (
            db.session.query(db.func.max(ExperimentStep.step_number))
            .filter_by(experiment_id=experiment.id)
            .scalar()
            or 0
        )

        new_step = ExperimentStep(
            experiment_id=experiment.id,
            step_number=highest_step + 1,
            description=data["description"],
            observation=data.get("observation", ""),
        )

        db.session.add(new_step)
        db.session.commit()

        return jsonify(new_step.to_dict()), 201
    except ValueError:
        return jsonify({"error": "Invalid experiment ID format"}), 400


@experiments.route("/<experiment_id>/steps/<step_id>", methods=["PUT"])
@login_required
def update_experiment_step(experiment_id, step_id):
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        experiment_uuid = uuid.UUID(experiment_id)
        step_uuid = uuid.UUID(step_id)

        experiment = Experiment.query.filter_by(
            id=experiment_uuid, user_id=current_user.id
        ).first()
        if not experiment:
            return jsonify({"error": "Experiment not found"}), 404

        step = ExperimentStep.query.filter_by(
            id=step_uuid, experiment_id=experiment.id
        ).first()
        if not step:
            return jsonify({"error": "Step not found"}), 404

        for field in ["description", "observation"]:
            if field in data:
                setattr(step, field, data[field])

        if "started_at" in data and data["started_at"]:
            step.started_at = datetime.fromisoformat(data["started_at"])

        if "completed_at" in data and data["completed_at"]:
            step.completed_at = datetime.fromisoformat(data["completed_at"])

        db.session.commit()

        return jsonify(step.to_dict()), 200
    except ValueError:
        return jsonify({"error": "Invalid ID format"}), 400


@experiments.route("/<experiment_id>/steps/<step_id>", methods=["DELETE"])
@login_required
def delete_experiment_step(experiment_id, step_id):
    try:
        experiment_uuid = uuid.UUID(experiment_id)
        step_uuid = uuid.UUID(step_id)

        experiment = Experiment.query.filter_by(
            id=experiment_uuid, user_id=current_user.id
        ).first()
        if not experiment:
            return jsonify({"error": "Experiment not found"}), 404

        step = ExperimentStep.query.filter_by(
            id=step_uuid, experiment_id=experiment.id
        ).first()
        if not step:
            return jsonify({"error": "Step not found"}), 404

        step_number = step.step_number

        db.session.delete(step)

        for s in experiment.steps:
            if s.step_number > step_number:
                s.step_number -= 1

        db.session.commit()

        return jsonify({"message": "Step deleted successfully"}), 200
    except ValueError:
        return jsonify({"error": "Invalid ID format"}), 400


@experiments.route("/<experiment_id>/attachments", methods=["POST"])
@login_required
def add_experiment_attachment(experiment_id):
    data = request.json

    if not data or not data.get("file_name") or not data.get("file_type"):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        experiment_uuid = uuid.UUID(experiment_id)
        experiment = Experiment.query.filter_by(
            id=experiment_uuid, user_id=current_user.id
        ).first()

        if not experiment:
            return jsonify({"error": "Experiment not found"}), 404

        new_attachment = ExperimentAttachment(
            experiment_id=experiment.id,
            file_name=data["file_name"],
            file_type=data["file_type"],
            file_path=data.get(
                "file_path", f"/uploads/{experiment.id}/{data['file_name']}"
            ),
            description=data.get("description", ""),
        )

        db.session.add(new_attachment)
        db.session.commit()

        return jsonify(new_attachment.to_dict()), 201
    except ValueError:
        return jsonify({"error": "Invalid experiment ID format"}), 400


@experiments.route("/<experiment_id>/attachments/<attachment_id>", methods=["DELETE"])
@login_required
def delete_experiment_attachment(experiment_id, attachment_id):
    try:
        experiment_uuid = uuid.UUID(experiment_id)
        attachment_uuid = uuid.UUID(attachment_id)

        experiment = Experiment.query.filter_by(
            id=experiment_uuid, user_id=current_user.id
        ).first()
        if not experiment:
            return jsonify({"error": "Experiment not found"}), 404

        attachment = ExperimentAttachment.query.filter_by(
            id=attachment_uuid, experiment_id=experiment.id
        ).first()
        if not attachment:
            return jsonify({"error": "Attachment not found"}), 404

        db.session.delete(attachment)
        db.session.commit()

        return jsonify({"message": "Attachment deleted successfully"}), 200
    except ValueError:
        return jsonify({"error": "Invalid ID format"}), 400
