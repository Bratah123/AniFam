# Copyright 2023 Brandon Nguyen, Tung Nguyen
#
# This file is part of Ani x Family.
# Ani x Family is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Ani x Family is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Ani x Family. If not, see <https://www.gnu.org/licenses/>.

"""Hashing module.

Abstracts the logic for password hashing and verification
"""
from argon2 import PasswordHasher


def hash_string(string: str) -> str:
    """Performs hashing using Argon2id with random salt

    Args:
        string: The string to be hashed

    Returns:
        The result after hashing with secure salt
    """
    return PasswordHasher().hash(string)


def verify_hash(string: str, hashed: str) -> bool:
    """Checks if the string matches the hash

    argon2-cffi uses exceptions both for non-matching hashes, and
    invalid hashes. We do not need to differentiate between these, since
    the feedback we give back to the end user will still be the same:
    "Invalid password".

    Args:
        string: Plain text password from HTML form
        hashed: Hashed representation queried from the database

    Returns:
        `true` for matching, and `false` for not matching
    """
    try:
        res = PasswordHasher().verify(hashed, string)
    except Exception:
        return False
    return res
