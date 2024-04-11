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
"""
    This script is be run once to initialize the database.
"""
import sqlite3
from argon2 import PasswordHasher

def init_db():
    print("Initializing database...")
    con = sqlite3.connect("anifam.db") # Creates the database if it doesn't exist
    con.execute(
        "CREATE TABLE IF NOT EXISTS user (username TEXT, password TEXT, email TEXT, is_admin BOOL)"
    )
    # Create a guest admin account if it doesn't exist
    # Query for the admin account
    admin = con.execute("SELECT * FROM user WHERE username = 'admin'").fetchone()
    admin_password = PasswordHasher().hash("admin")
    guest_password = PasswordHasher().hash("guest")

    if admin:
        print("Admin account already exists!")
    else:
        con.execute(
            f"INSERT INTO user (username, password, email, is_admin) VALUES ('admin', '{admin_password}', '', 1)"
        )
        print("Created admin account!")

    guest = con.execute("SELECT * FROM user WHERE username = 'guest'").fetchone()
    if guest:
        print("Guest account already exists!")
    else:
        con.execute(
            f"INSERT INTO user (username, password, email, is_admin) VALUES ('guest', '{guest_password}', '', 0)"
        )
        print("Created guest account!")

    # TODO: Complete the database schema
    con.commit()
    con.close()
    print("Done initializing database!")

if __name__ == "__main__":
    init_db()
