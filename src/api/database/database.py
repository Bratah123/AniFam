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
import sqlite3
import logger
from util.hasher import hash_string
from sqlite3 import Cursor

log = logger.get_logger(__name__)

class AnimeData:
    def __init__(self) -> None:
        self.anime_id = 0
        self.title = ''
        self.description = ''
        self.rating = 0.0
        self.synopsis = ''
        self.image = ''
        self.genre = []
        self.episodes = []
        self.total_episodes = ''

    def load(self, data: tuple) -> None:
        self.anime_id = int(data[0])
        self.title = data[1]
        self.description = data[2]
        self.rating = float(data[3])
        self.synopsis = data[4]
        self.image = data[5]
        self.genre = data[6].split(',')
        self.episodes = data[7].split(',')
        self.total_episodes = int(data[9])
        return self

class AniFamDatabase:
    """
        Represents the AniFam database.

        A DB connection is opened at instantiation and allowers queries to be made.
        
        Syntax:
        with AniFamDatabase() as db:
            # Insert any queries here
        # Automatically closes the connection after the block

        The following database tables are available:
        user:
            username TEXT
            password TEXT
            email TEXT
            is_admin BOOL
        animes:
            anime_id INTEGER PRIMARY KEY
            title TEXT
            description TEXT
            rating REAL
            synopsis TEXT
            image TEXT : cdn.myanimelist.net URL
            genre TEXT : comma separated list of genres I.E. "Action, Adventure"
            episodes TEXT : comma separated list of episode numbers I.E. "1,2,3,4"
            date_edited datetime
            total_episodes INTEGER : This keeps track of how many episodes total the anime SHOULD have not how many are available.
        topics:
            topicId INTEGER PRIMARY KEY
            title TEXT
            long_description TEXT
            short_description TEXT
    """

    def __init__(self):
        self.con = None

    def __enter__(self):
        self.con = sqlite3.connect("anifam.db")
        return self
    
    def __exit__(self, exc_type, exc_value, traceback):
        self.con.close()
    
    def fetch_user(self, username: str) -> tuple[str, str] | None:
        """
            Fetches a user from the database by username.

            Args:
                username (str): The username to search for

            Returns:
                tuple: A tuple of the user's data
        """
        cursor = self.con.cursor()
        
        try:
            cursor.execute(
                "SELECT * FROM user WHERE username=?",
                (username,)
                )
        except sqlite3.OperationalError as e:
            log.error("Error fetching user: %s", e)
            return None
        return cursor.fetchone()

    def fetch_topic_by_id(self, topic_id: int) -> tuple[str, str, str] | None:
        cursor = self.con.cursor()
        try:
            cursor.execute(
                "SELECT * FROM topics WHERE topic_id=?",
                (topic_id,)
            )
        except sqlite3.OperationalError as e:
            log.error("Error fetching topic by ID: %s", e)
            return None
        return cursor.fetchone()
    
    def fetch_all_users(self) -> list[dict[str, str] | None]:
        """Fetch all users

        Returns:
            A list of dictionaries where each dictionary represents a row with column names as keys.
        """
        cursor = self.con.cursor()
        try:
            cursor.execute("SELECT * FROM user")
        except sqlite3.OperationalError as e:
            log.error("Error fetching all users: %s", e)
            return None

        column_names = [description[0] for description in cursor.description]
        results = []

        for row in cursor.fetchall():
            user_dict = {column_names[i]: row[i] for i in range(len(column_names))}
            results.append(user_dict)

        return results
    
    # This is for first time inputing in a new anime into the database
    def save_anime(self, anime_data):
        """
            anime_data (dict): A dictionary containing the anime data to save
            anime_data = {
                'title': str,
                'episode': str,
                'synopsis': str,
                'rating': str,
                'genres': str, Comma separated list of genres
                'image': str
            }
        """
        cursor = self.con.cursor()
        try:
            cursor.execute(
                "INSERT INTO animes (title, rating, synopsis, image, genre, episodes, date_edited, total_episodes) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), 0)",
                (
                    anime_data["title"],
                    anime_data["rating"],
                    anime_data["synopsis"],
                    anime_data["image"],
                    anime_data["genres"],
                    anime_data["episode"],
                )
            )
        except sqlite3.OperationalError as e:
            log.error("Error saving anime: %s", e)
            return False
        self.con.commit()
        return True
    
    def update_anime(self, anime_data):
        """
            anime_data (dict): A dictionary containing the anime data to save
            anime_data = {
                'title': str,
                'episode': str,
                'synopsis': str,
                'rating': str,
                'genres': str, Comma separated list of genres
                'image': str
            }
        """
        # Fetch the anime first to get the episode list
        anime = self.fetch_anime(anime_data["title"])
        if not anime:
            return False
        episodes = anime.episodes
        if anime_data["episode"] not in episodes:
            episodes.append(anime_data["episode"])
            episodes = ','.join(episodes)
        cursor = self.con.cursor()

        try:
            cursor.execute(
                "UPDATE animes SET rating=?, synopsis=?, image=?, genre=?, episodes=?, date_edited=datetime('now') WHERE title=?",
                (
                    anime_data["rating"],
                    anime_data["synopsis"],
                    anime_data["image"],
                    anime_data["genres"],
                    episodes,
                    anime_data["title"],
                )
            )
        except sqlite3.OperationalError as e:
            log.error("Error updating anime: %s", e)
            return False
        self.con.commit()
        return True

    def fetch_anime(self, title: str) -> AnimeData | None:
        cursor = self.con.cursor()
        try:
            cursor.execute(
                "SELECT * FROM animes WHERE title=?",
                (title,)
            )
        except sqlite3.OperationalError as e:
            log.error("Error fetching anime: %s", e)
            return None
        anime = cursor.fetchone()
        if not anime:
            return None
        anime_data = AnimeData()
        anime_data.load(anime)
        return anime_data
    
    def fetch_top_rated_animes(self, limit: int) -> list[AnimeData]:
        cursor = self.con.cursor()
        try:
            cursor.execute(
                "SELECT * FROM animes ORDER BY rating DESC LIMIT ?",
                (limit,)
            )
        except sqlite3.OperationalError as e:
            log.error("Error fetching top rated animes: %s", e)
            return None
        animes = cursor.fetchall()
        if not animes:
            return []
        anime_data = []
        for anime in animes:
            anime_data.append(AnimeData().load(anime))
        return anime_data
    
    def fetch_episodes_from_anime(self, title: str) -> list[str] | None:
        cursor = self.con.cursor()
        try:
            cursor.execute(
                "SELECT episodes FROM animes WHERE title=?",
                (title,)
            )
        except sqlite3.OperationalError as e:
            log.error("Error fetching episodes from anime: %s", e)
            return None
        episodes = cursor.fetchone()
        if not episodes:
            return None
        return episodes[0].split(',')
    
    def register_user(self, username : str, password : str) -> bool:
        """
            Registers a user with the given username and password.

            Args:
                username (str): The username of the user
                password (str): The password of the user

            Returns:
                bool: True if the user was registered successfully, False otherwise
        """
        hashed_password = hash_string(password)
        cursor = self.con.cursor()
        try:
            cursor.execute(
                "INSERT INTO user (username, password, is_admin) VALUES (?, ?, ?)",
                (username, hashed_password, False)
            )
        except sqlite3.OperationalError as e:
            log.error("Error registering user: %s", e)
            return False
        self.con.commit()
        return True
    
    def delete_user(self, username: str) -> bool:
        cursor = self.con.cursor()
        try:
            cursor.execute(
                "DELETE FROM user WHERE username=?",
                (username,)
            )
        except sqlite3.OperationalError as e:
            log.error("Error deleting user: %s", e)
            return False
        self.con.commit()
        return True

    def save_topic(self, title: str, long_description: str, short_description: str) -> bool:
        cursor = self.con.cursor()
        try:
            cursor.execute(
                "INSERT INTO topics (title, long_description, short_description) VALUES (?, ?, ?)",
                (title, long_description, short_description)
            )
        except sqlite3.OperationalError as e:
            log.error("Error saving topic: %s", e)
            return False
        self.con.commit()
        return True
    




    
    