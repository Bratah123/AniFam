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
import os

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

@app.route("/register", methods=["POST"])
@jwt_required()
def register() -> tuple[Response, int]:
    form_info = request.form
    status_message = ""

    # Check if user is an admin
    is_admin = get_jwt()["is_admin"]
    if not is_admin:
        return jsonify(message="You are not authorized to access this route"), 401
    
    username = form_info["username"]
    password = form_info["password"]

    log.info("User %s is attempting to register", username)

    with AniFamDatabase() as db:
        user = db.fetch_user(username)
        if user:
            log.info("User %s already exists", username)
            return jsonify(message="User already exists", status=409)
        if db.register_user(username, password):
            log.info("User %s has been registered", username)
            status_message = "Success"
            status = 200
        else:
            log.info("User %s failed to register", username)
            status_message = "Failed to register"
            status = 500

    return jsonify(status=status, message=status_message)

@app.route("/user", methods=["DELETE"])
@jwt_required()
def register() -> tuple[Response, int]:
    form_info = request.form
    status_message = ""

    # Check if user is an admin
    is_admin = get_jwt()["is_admin"]
    if not is_admin:
        return jsonify(message="You are not authorized to access this route"), 401
    
    username = form_info["username"]

    log.info("User %s is attempting to delete", username)
    
    with AniFamDatabase() as db:
        user = db.fetch_user(username)
        if not user:
            log.info("User %s does not exist", username)
            return jsonify(message="User does not exist", status=404)
        if db.delete_user(username):
            log.info("User %s has been deleted", username)
            status_message = "Success"
            status = 200
        else:
            log.info("User %s failed to delete", username)
            status_message = "Failed to delete"
            status = 500

    return jsonify(status=status, message=status_message)


@app.route("/homepage", methods=["GET"])
@jwt_required()
def home_page() -> tuple[Response, int]:
    user = get_jwt_identity()
    is_admin = get_jwt()["is_admin"]

    hottest_hits = []
    # TODO: Add logic for animes loading
    with AniFamDatabase() as db:
        animes = db.fetch_top_rated_animes(20)
        hottest_hits = [
            {
                "title": anime.title,
                "available_episodes": len(anime.episodes),
                "total_episodes": anime.total_episodes,
                "rating": anime.rating,
                "synopsis": anime.synopsis,
                "genres": anime.genre,
                "image": anime.image,
                "episodes": anime.episodes
            } for anime in animes
        ]

    return jsonify(logged_in_as=user, hottest_hits=hottest_hits, is_admin=is_admin)

@app.route("/mediapage", methods=["GET"])
@jwt_required()
def media_page() -> tuple[Response, int]:
    user = get_jwt_identity()
    user_is_admin = get_jwt()["is_admin"]
    anime_name = request.args.get("animeName")

    if not anime_name:
        return jsonify(logged_in_as=user, message="Anime name not provided", status=400)
    
    episodes = []

    with AniFamDatabase() as db:
        episodes = db.fetch_episodes_from_anime(anime_name)
    
    if not episodes:
        return jsonify(logged_in_as=user, message="Anime does not exist", status=404)
    
    return jsonify(logged_in_as=user, is_admin=user_is_admin, episodes=episodes), 200

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

@app.route("/forums", methods=["GET"])
@jwt_required()
def forums() -> tuple[Response, int]:
    user = get_jwt_identity()
    user_is_admin = get_jwt()["is_admin"]
    return jsonify(logged_in_as=user, is_admin=user_is_admin), 200

@app.route("/admin/upload", methods=["POST"])
@jwt_required()
def anime_upload() -> tuple[Response, int]:
    """
        This is the route where the input form for uploading an anime will be displayed.
    """
    user = get_jwt_identity()
    user_is_admin = get_jwt()["is_admin"]
    if not user_is_admin:
        return jsonify(logged_in_as=user, message="You are not authorized to access this route"), 401

    form_data = request.form
    anime_upload_data = {
        'title': form_data["title"],
        'episode': form_data["episode"],
        'synopsis': form_data["synopsis"],
        'rating': form_data["rating"],
        'genres': form_data["genres"],
        'image': form_data["imageUrl"],
    }
    
    with AniFamDatabase() as db:
        anime = db.fetch_anime(anime_upload_data["title"])
        if anime: # If the anime already exists, then check if the episode already exists
            if form_data["episode"] in anime.episodes:
                return jsonify(logged_in_as=user, message="Episode already exists", status=409)
            # If the episode does not exist, then update the episode list
            result = db.update_anime(anime_upload_data)
            log.info("Anime %s has been updated in the database", anime_upload_data["title"])
        else:
            result = db.save_anime(anime_upload_data)
            if not result:
                return jsonify(logged_in_as=user, message="Error saving anime to database", status=500)
            log.info("Anime %s has been saved to the database", anime_upload_data["title"])

    anime_episode_file = request.files['file'] # Should always be one file
    anime_file_name = f"E{form_data['episode']}.mp4"
    anime_folder_name = form_data["title"]

    # Create a folder for the anime if it does not exist
    if not os.path.exists(os.path.join(app.static_folder, anime_folder_name)):
        log.info("Creating folder for anime %s", anime_folder_name)
        os.makedirs(os.path.join(app.static_folder, anime_folder_name))
    
    # Check if the video already exists
    if os.path.exists(os.path.join(app.static_folder, anime_folder_name, anime_file_name)):
        log.info("User %s tried to upload an episode that already exists.")
        return jsonify(logged_in_as=user, message="Episode already exists", status=409)
    
    # Save the file to the folder
    try:
        anime_episode_file.save(os.path.join(app.static_folder, anime_folder_name, anime_file_name))
    except Exception as e:
        log.error("Error saving file: %s", e)
        return jsonify(logged_in_as=user, message="Error saving file", status=500)

    return jsonify(logged_in_as=user, is_admin=user_is_admin, status=200)

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
