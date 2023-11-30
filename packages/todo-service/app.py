from flask import Flask, request, jsonify, g
from flask_restful import Resource, Api
import sqlite3
import jwt
import os
import requests

app = Flask(__name__)
api = Api(app)

# Secret key for JWT - should be kept secret and safe
SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# Database setup
DATABASE = "todos.db"


def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db


def initialize_database():
    with app.app_context():
        db = get_db()
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                text TEXT NOT NULL
            )
        """
        )
        db.commit()


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def insert_db(query, args=()):
    cur = get_db().cursor()
    cur.execute(query, args)
    get_db().commit()
    return cur.lastrowid


# Utility function for token verification
def verify_token(token):
    try:
        # Test user service - need to implement correctly
        requests.get("http://user-service-885045017:4000/users/status")
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.PyJWTError:
        return None


class Status(Resource):
    def get(self):
        return jsonify({"status": "OK", "message": "Todo Service is up and running"})


class AddTodo(Resource):
    def post(self):
        token = request.headers.get("Authorization")
        user_id = verify_token(token)
        if not user_id:
            return {"message": "Invalid or missing token"}, 401

        data = request.json
        todo_text = data["todo"]
        todo_id = insert_db(
            "INSERT INTO todos (user_id, text) VALUES (?, ?)", [user_id, todo_text]
        )
        # Test notification service - need to implement correctly
        requests.get("http://notification-service-2269431989:7000/notifications/status")
        return {"todo_id": todo_id}, 201


class GetTodos(Resource):
    def get(self):
        token = request.headers.get("Authorization")
        user_id = verify_token(token)
        if not user_id:
            return {"message": "Invalid or missing token"}, 401

        todos = query_db("SELECT * FROM todos WHERE user_id = ?", [user_id])
        return jsonify(todos)


class DeleteTodo(Resource):
    def delete(self, todo_id):
        token = request.headers.get("Authorization")
        user_id = verify_token(token)
        if not user_id:
            return {"message": "Invalid or missing token"}, 401

        query_db("DELETE FROM todos WHERE id = ? AND user_id = ?", [todo_id, user_id])
        return {"message": "Todo deleted"}, 200


api.add_resource(Status, "/todos/status")
api.add_resource(AddTodo, "/todos/add_todo")
api.add_resource(GetTodos, "/todos/get_todos")
api.add_resource(DeleteTodo, "/todos/delete_todo/<int:todo_id>")

if __name__ == "__main__":
    initialize_database()
    app.run(debug=True)
