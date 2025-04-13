import uuid

from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required

from app.models import Note, db

notes = Blueprint("notes", __name__)


@notes.route("", methods=["GET"])
@login_required
def get_notes():
    user_notes = (
        Note.query.filter_by(user_id=current_user.id)
        .order_by(Note.updated_at.desc())
        .all()
    )
    return jsonify([note.to_dict() for note in user_notes]), 200


@notes.route("/<note_id>", methods=["GET"])
@login_required
def get_note(note_id):
    try:
        note_uuid = uuid.UUID(note_id)
        note = Note.query.filter_by(id=note_uuid, user_id=current_user.id).first()

        if not note:
            return jsonify({"error": "Note not found"}), 404

        return jsonify(note.to_dict()), 200
    except ValueError:
        return jsonify({"error": "Invalid note ID format"}), 400


@notes.route("", methods=["POST"])
@login_required
def create_note():
    data = request.json

    if not data or not data.get("title") or not data.get("content"):
        return jsonify({"error": "Missing required fields"}), 400

    tags = data.get("tags")
    tags_string = ",".join(tags) if tags else ""

    new_note = Note(
        user_id=current_user.id,
        title=data["title"],
        content=data["content"],
        tags=tags_string,
    )

    db.session.add(new_note)
    db.session.commit()

    return jsonify(new_note.to_dict()), 201


@notes.route("/<note_id>", methods=["PUT"])
@login_required
def update_note(note_id):
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        note_uuid = uuid.UUID(note_id)
        note = Note.query.filter_by(id=note_uuid, user_id=current_user.id).first()

        if not note:
            return jsonify({"error": "Note not found"}), 404

        if "title" in data:
            note.title = data["title"]

        if "content" in data:
            note.content = data["content"]

        if "tags" in data:
            note.tags = ",".join(data["tags"]) if data["tags"] else ""

        db.session.commit()

        return jsonify(note.to_dict()), 200
    except ValueError:
        return jsonify({"error": "Invalid note ID format"}), 400


@notes.route("/<note_id>", methods=["DELETE"])
@login_required
def delete_note(note_id):
    try:
        note_uuid = uuid.UUID(note_id)
        note = Note.query.filter_by(id=note_uuid, user_id=current_user.id).first()

        if not note:
            return jsonify({"error": "Note not found"}), 404

        db.session.delete(note)
        db.session.commit()

        return jsonify({"message": "Note deleted successfully"}), 200
    except ValueError:
        return jsonify({"error": "Invalid note ID format"}), 400
