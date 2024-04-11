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
from flask_jwt_extended import create_access_token, JWTManager
from waitress import serve
from database.database import AniFamDatabase
from util.hasher import verify_hash

import logger
import sys

PORT = 5328

log = logger.get_logger(__name__)
app = Flask(__name__, instance_relative_config=True)
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
            access_token = create_access_token(username)
        else: # If the user exists but the password is incorrect
            log.info("User %s has failed to login due to wrong password.", username)
            status_message = "Invalid password"

    return jsonify(
        status=status,
        message=status_message,
        access_token=access_token
    )


def main(): # Entry point of flask server
    cli_arguments = sys.argv

    if "--dev_mode" in cli_arguments: # Development
        log.info("Start logging for development server")
        app.run(debug=True, port=PORT)
        logger.shutdown_logger()
    else: # Production
        serve(app, host="localhost", port=PORT)
        logger.shutdown_logger()


if __name__ == "__main__":
    main()
