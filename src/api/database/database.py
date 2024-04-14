import sqlite3
import logger

log = logger.get_logger(__name__)

class AniFamDatabase:
    """
        Represents the AniFam database.

        A DB connection is opened at instantiation and allowers queries to be made.
        
        Syntax:
        with AniFamDatabase() as db:
            # Insert any queries here

        # Automatically closes the connection after the block
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