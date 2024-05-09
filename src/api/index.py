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
from util.hasher import verify_hash
from database.database import AniFamDatabase
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

@app.route("/topic", methods=["DELETE"])
@jwt_required()
def delete_topic() -> tuple[Response, int]:
    form_info = request.form
    status_message = ""

    # Check if user is an admin
    is_admin = get_jwt()["is_admin"]
    if not is_admin:
        return jsonify(message="You are not authorized to access this route"), 401
    
    title = form_info["title"]

    log.info("User is attempting to delete topic %s", title)

    with AniFamDatabase() as db:
        topic = db.fetch_topic(title)
        if not topic:
            log.info("Topic %s does not exist", title)
            return jsonify(message="Topic does not exist", status=404)
        if db.delete_topic(title):
            log.info("Topic %s has been deleted", title)
            status_message = "Success"
            status = 200
        else:
            log.info("Topic %s failed to delete", title)
            status_message = "Failed to delete"
            status = 500

    return jsonify(status=status, message=status_message)

@app.route("/user", methods=["DELETE"])
@jwt_required()
def delete_user() -> tuple[Response, int]:
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

@app.route("/user", methods=["GET"])
@jwt_required()
def get_user() -> tuple[Response, int]:
    user = get_jwt_identity()
    is_admin = get_jwt()["is_admin"]
    username = request.args.get("username")

    if not username:
        return jsonify(logged_in_as=user, message="Username not provided", status=400)
    
    with AniFamDatabase() as db:
        user = db.fetch_user(username)
        if not user:
            return jsonify(logged_in_as=user, message="User does not exist", status=404)
    
    return jsonify(logged_in_as=user, is_admin=is_admin, user=user), 200

@app.route("/homepage", methods=["GET"])
@jwt_required()
def home_page() -> tuple[Response, int]:
    user = get_jwt_identity()
    is_admin = get_jwt()["is_admin"]

    animes = None
    search_query = request.args.get("search")
    
    if search_query:
        with AniFamDatabase() as db:
            animes = db.query_animes_by_name_inclusive(search_query)
    else:
        with AniFamDatabase() as db:
            animes = db.fetch_top_rated_animes(20)

    if not animes:
        return jsonify(logged_in_as=user, message="No animes found", status=404, hottest_hits=[], is_admin=is_admin)
    
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
    episode = request.args.get("episode")

    episodes = []
    comments = []

    if not anime_name:
        return jsonify(logged_in_as=user, message="Anime name not provided", status=400, episodes=episodes, comments=comments), 404

    with AniFamDatabase() as db:
        episodes = db.fetch_episodes_from_anime(anime_name)

    if not episodes:
        return jsonify(logged_in_as=user, is_admin=user_is_admin, message="Anime does not exist", status=404, episodes=episodes, comments=comments), 404
    
    if episodes[0] == '':
        episodes = []
    
    with AniFamDatabase() as db:
        comments = db.fetch_comments(anime_name, episode)
    
    return jsonify(logged_in_as=user, is_admin=user_is_admin, episodes=episodes, comments=comments), 200

@app.route("/topicpage", methods=["GET"])
@jwt_required()
def topic_page() -> tuple[Response, int]:
    user = get_jwt_identity()
    user_is_admin = get_jwt()["is_admin"]
    topic_title = request.args.get("title")
    comments = []
 
    if not topic_title:
        return jsonify( message="Topic title not provided", status=400)
    
    with AniFamDatabase() as db:
        topic = db.fetch_topic(topic_title)
        comments = db.fetch_topic_comments(topic_title)
    
    if not topic:
        return jsonify(logged_in_as=user, is_admin=user_is_admin, message="Topic does not exist", status=404)
    topic_dict = {
        "title": topic.title,
        "long_description": topic.long_description,
        "short_description": topic.short_description,
        "user": topic.user
    }
    return jsonify(topic=topic_dict, comments=comments, logged_in_as=user, is_admin=user_is_admin), 200

@app.route("/topic_comments/delete", methods=["DELETE"])
@jwt_required()
def delete_comment():
    user = get_jwt_identity()
    form_data = request.form
    comment_id = form_data.get("comment_id")

    if not comment_id:
        return jsonify(message="Comment ID is required"), 400

    with AniFamDatabase() as db:
        comment = db.fetch_comment_by_id(comment_id)
        if not comment:
            return jsonify(message="Comment not found"), 404
        
        if comment['user'] != user and not get_jwt()["is_admin"]:
            return jsonify(message="Unauthorized to delete this comment"), 403

        if db.delete_topic_comment(comment_id):
            return jsonify(message="Comment successfully deleted"), 200
        else:
            return jsonify(message="Failed to delete comment"), 500



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
    topics = []
    with AniFamDatabase() as db:
        topics = db.fetch_all_topics()
    
    if topics is None:
        return jsonify(logged_in_as=user, message="No topics found"), 404
    
    if topics:
        topics_info = [{
            "topic_id": topic.topic_id,
            "title": topic.title,
            "long_description": topic.long_description,
            "short_description": topic.short_description,
            "user": topic.user,
        } for topic in topics]

        return jsonify(logged_in_as=user, is_admin=user_is_admin, topics=topics_info), 200
    
    return jsonify(logged_in_as=user, is_admin=user_is_admin, topics=topics), 200

@app.route("/forums/upload", methods=["POST"])
@jwt_required()
def create_topic() -> tuple[Response, int]:
    user = get_jwt_identity()
    user_is_admin = get_jwt()["is_admin"]
    form_data = request.form

    if not form_data["title"] or not form_data["long_description"] or not form_data["short_description"]:
        return jsonify(message="Missing required topic information."), 400

    with AniFamDatabase() as db:
        success = db.save_topic(form_data["title"], form_data["long_description"], form_data["short_description"], user)
        if success:
            return jsonify(logged_in_as=user, is_admin=user_is_admin, message="Topic saved successfully"), 201
        else:
            return jsonify(logged_in_as=user, is_admin=user_is_admin, message="Failed to save topic"), 500


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

@app.route("/admin/upload_episode", methods=["POST"])
@jwt_required()
def upload_episode() -> tuple[Response, int]:
    user = get_jwt_identity()
    user_is_admin = get_jwt()["is_admin"]
    if not user_is_admin:
        return jsonify(logged_in_as=user, message="You are not authorized to access this route"), 401

    form_data = request.form
    anime_name = form_data["title"]
    episode_number = form_data["episode"]

    with AniFamDatabase() as db:
        anime = db.fetch_anime(anime_name)
        if not anime:
            return jsonify(logged_in_as=user, message="Anime does not exist", status=404)
        if episode_number in anime.episodes:
            return jsonify(logged_in_as=user, message="Episode already exists", status=409)
    
    anime_episode_file = request.files['file']
    anime_file_name = f"E{episode_number}.mp4"
    anime_folder_name = anime_name

    # Add the episode to the static folder
    if not os.path.exists(os.path.join(app.static_folder, anime_folder_name)):
        log.info("Creating folder for anime %s", anime_folder_name)
        try:
            os.makedirs(os.path.join(app.static_folder, anime_folder_name))
        except Exception as e:
            log.error("Error creating folder: %s", e)
            return jsonify(logged_in_as=user, message="Error creating folder", status=500)
        
    try:
        anime_episode_file.save(os.path.join(app.static_folder, anime_folder_name, anime_file_name))
    except Exception as e:
        log.error("Error saving file: %s", e)
        return jsonify(logged_in_as=user, message="Error saving file", status=500)
    
    with AniFamDatabase() as db:
        result = db.update_anime_episode(anime_name, episode_number)
        if not result:
            return jsonify(logged_in_as=user, message="Error saving episode to database", status=500)
        
    return jsonify(logged_in_as=user, is_admin=user_is_admin, status=200)

    
@app.route("/admin/delete", methods=["DELETE"])
@jwt_required()
def delete_anime() -> tuple[Response, int]:
    user = get_jwt_identity()
    user_is_admin = get_jwt()["is_admin"]
    request_form = request.form

    if not user_is_admin:
        return jsonify(logged_in_as=user, message="You are not authorized to access this route"), 401

    anime_name = request_form.get("title")
    episode_number = request_form.get("episode")

    if not anime_name or not episode_number:
        return jsonify(logged_in_as=user, message="Anime name or episode number not provided", status=400)

    with AniFamDatabase() as db:
        anime = db.fetch_anime(anime_name)
        if not anime:
            return jsonify(logged_in_as=user, message="Anime does not exist", status=404)
        if episode_number not in anime.episodes:
            return jsonify(logged_in_as=user, message="Episode does not exist", status=404)
        
    # Delete the episode from the static folder
    anime_folder_name = anime_name
    anime_file_name = f"E{episode_number}.mp4"
    if os.path.exists(os.path.join(app.static_folder, anime_folder_name, anime_file_name)):
        try:
            log.info("Deleting episode %s from anime %s", episode_number, anime_name)
            os.remove(os.path.join(app.static_folder, anime_folder_name, anime_file_name))
        except Exception as e:
            log.error("Error deleting file: %s", e)
            return jsonify(logged_in_as=user, message="Error deleting file", status=500)
    else:
        return jsonify(logged_in_as=user, message="Episode does not exist", status=404)
    
    with AniFamDatabase() as db:
        result = db.delete_anime_episode(anime_name, episode_number)
        if not result:
            return jsonify(logged_in_as=user, message="Error deleting episode", status=500)

    return jsonify(logged_in_as=user, is_admin=user_is_admin, status=200)

# This is the route for comments on anime NOT to be confused with the forums
@app.route("/comment/upload", methods=["POST"])
@jwt_required()
def upload_comment() -> tuple[Response, int]:
    user = get_jwt_identity()
    user_is_admin = get_jwt()["is_admin"]
    form_data = request.form

    anime_name = form_data["animeName"]
    episode_number = form_data["animeEpisode"]
    comment = form_data["comment"]

    with AniFamDatabase() as db:
        anime = db.fetch_anime(anime_name)
        if not anime:
            return jsonify(logged_in_as=user, message="Anime does not exist", status=404), 404
        if episode_number not in anime.episodes:
            return jsonify(logged_in_as=user, message="Episode does not exist", status=404), 404
        result = db.save_comment(user, anime_name, episode_number, comment)
        if not result:
            return jsonify(logged_in_as=user, message="Error saving comment", status=500), 500

    return jsonify(logged_in_as=user, is_admin=user_is_admin, status=200), 200

# This is the route for topic_comments
@app.route("/topic_comment/upload", methods=["POST"])
@jwt_required()
def upload_topic_comment() -> tuple[Response, int]:
    user = get_jwt_identity()
    user_is_admin = get_jwt()["is_admin"]
    form_data = request.form
    topic_title = form_data["title"]
    comment = form_data["comment"]

    with AniFamDatabase() as db:
        title = db.fetch_topic(topic_title)
        if not title:
            return jsonify(logged_in_as=user, message="Topic does not exist", status=404), 404
        comment_id = db.save_topic_comment(user, topic_title, comment)
        if comment_id == -1:
            return jsonify(logged_in_as=user, message="Error saving comment", status=500), 500
        
    return jsonify(logged_in_as=user, is_admin=user_is_admin, status=200, commentId=comment_id), 200


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
