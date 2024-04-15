# Copyright 2023 Brandon Nguyen, Tung Nguyen
#
# This file is part of AniFam.
# AniFam is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# AniFam is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with AniFam. If not, see <https://www.gnu.org/licenses/>.
#
# Contact via Discord: `newhashmap` (Brandon)

from flask import Flask, Response, request, jsonify
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt, get_jwt_identity
from waitress import serve
from database.database import AniFamDatabase
from util.hasher import verify_hash

import logger
import sys

PORT = 5328

log = logger.get_logger(__name__)
app = Flask(__name__, instance_relative_config=True, static_folder="static")
app.config.from_pyfile("config.py")

jwt = JWTManager(app)

@app.route("/login/request", methods=["POST"])
def login() -> tuple[Response, int]:
    form_info = request.form
    status_message = ""

    status = 401
    access_token = None

    username = form_info["username"]
    password = form_info["password"]

    log.info("User %s is attempting to log in", username)
    
    with AniFamDatabase() as db:
        user = db.fetch_user(username)
        # if user cannot be found based off the username in the database
        if not user:
            log.info("User %s does not exist", username)
            status_message = "User does not exist"
        elif verify_hash(password, user[1]): # If user exists, then check if the password is correct
            log.info("User %s has logged in.", username)
            status = 200
            status_message = "Success"
            # Create the JWT access token which allows us to authenticate the user
            access_token = create_access_token(identity=username, additional_claims={"is_admin": user[3]})
        else: # If the user exists but the password is incorrect
            log.info("User %s has failed to login due to wrong password.", username)
            status_message = "Invalid password"

    return jsonify(
        status=status,
        message=status_message,
        access_token=access_token
    )

@app.route("/homepage", methods=["GET"])
@jwt_required()
def home_page() -> tuple[Response, int]:
    user = get_jwt_identity()
    is_admin = get_jwt()["is_admin"]

    # TODO: Add logic for animes loading
    mock_animes = [ # This will be shown to users
        {
            "title": "Spy x Family",
            "available_episodes": 0,
            "total_episodes": 12,
            "rating": 9.5,
            "synopsis": "Watch anya go on dangerous missions with her family!",
            "genres": ["Action", "Comedy", "Adventure"],
            "image": "https://cdn.myanimelist.net/images/anime/1441/122795.jpg",
        },
        {
            "title": "Bunny Girl Senpai",
            "available_episodes": 0,
            "total_episodes": 12,
            "rating": 10,
            "synopsis": "The rare and inexplicable Puberty Syndrome is thought of as a myth. It is a rare disease which only affects teenagers, and its symptoms are so supernatural that hardly anyone recognizes it as a legitimate occurrence",
            "genres": ["Drama", "Romance", "Supernatural"],
            "image": "https://cdn.myanimelist.net/images/anime/1301/93586.jpg",
        }
    ]

    return jsonify(logged_in_as=user, hottest_hits=mock_animes, is_admin=is_admin)

@app.route("/mediapage", methods=["GET"])
@jwt_required()
def media_page() -> tuple[Response, int]:
    user = get_jwt_identity()
    user_is_admin = get_jwt()["is_admin"]
    return jsonify(logged_in_as=user, is_admin=user_is_admin), 200

@app.route("/users", methods=["GET"])
@jwt_required()
def get_users() -> tuple[Response, int]:
    # Only admins can access this route
    user = get_jwt_identity()
    is_admin = get_jwt()["is_admin"]
    if not is_admin:
        return jsonify(logged_in_as=user, message="You are not authorized to access this route"), 401
    users = []
    with AniFamDatabase() as db:
        users = db.fetch_all_users()
    return jsonify(users=users), 200

def main(): # Entry point of flask server
    cli_arguments = sys.argv

    if "--dev_mode" in cli_arguments: # Development
        log.info("Start logging for development server")
        app.run(debug=True, port=PORT)
        logger.shutdown_logger()
    else: # Production
        serve(app, host="0.0.0.0", port=PORT)
        logger.shutdown_logger()


if __name__ == "__main__":
    main()
