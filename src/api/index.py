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

from flask import Flask
from waitress import serve

import logger
import sys

PORT = 4444

log = logger.get_logger(__name__)
app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile("config.py")

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"


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
