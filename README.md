# Ani x Family
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

Ani x Family (A play on words to the show Spy x Family) is an anime-based plex server that aims to allow users to stream anime without the annoying ads and bloat that other public streaming services have. 

However, still provide live ratings and synopsis of every show based on public information. Ani x Family also provides forums and working comments sections platform in order for anime watchers to share their opinions and just communicate their enjoyment of their favorite shows with other anime watchers.

## Technical Information
### Tech Stack
Ani x Family targets the following versions:
- TypeScript 5+
- Python 3.11+
- Next.js 13+
- Node.js 21+

*Note: This is not an exhaustive list*  
*Note2: The core team uses VS Code*

**Ani x Family** is intended to be run on Ubuntu in production; the core team develops on Windows 11. Hence, the tech stack is compatible with both Windows and UNIX-like OSes.
## Setup (Steps to be done in numbered order)
### Set-up Development Environment Development (Initial)
> [!IMPORTANT]
These instructions are applicable to Windows environment only.
0. Clone the [repository](https://github.com/Bratah123/AniFam)
1. Install [Python 3.11+](https://www.python.org/downloads/); [NOTE] IT IS IMPORTANT THAT YOU SET IT TO PATH
  ![image](https://github.com/Bratah123/AniFam/assets/58405975/53613b44-3e0d-4f68-ad89-de69775a2776)
2. Install [Node.js](https://nodejs.org/en)
3. Open `AniFam` (should be cloned from step 0) in `VSCode`
4. Working directory is `/src` unless otherwise specified, open up the `VSCode` terminal (Or any terminal of your chance).
5. Run: `cd src`
6. Run: `npm install`
7. Run: `python -m venv venv`
8. Run: `venv/Scripts/activate` (Windows)
    - This puts you into the venv python shell
9. Run: `pip install -r requirements.txt`
10. Navigate to [src/instance](https://github.com/Bratah123/AniFam/tree/main/src/instance) and follow the instructions there.

### Running the Server (**Development**)
The web application has two different servers, the NextJS front-end server and the Flask back-end server.
Therefore there must be two instances of a terminal open.
1. Open up two terminals of your choice
2. Change the directories to be in the `/src` of the project in both terminals
3. In one terminal run command: `npm run next-dev`
4. Open up the other terminal and run: `./start.bat` and choose the development option when prompted.
5. Now open up `localhost:3000` in any web browser!

### Running the Server (**Production**)
> [!IMPORTANT]
These instructions are only applicable to a Linux OS Environment as intended.
1. TBD

# Disclaimer
`Ani x Family` is an open-source full stack web application that collects anime-related metadata and media, and serves them to end users. `Ani x Family` is an educational project for demonstrating various techniques, such as web scraping and UI design.
The creators of `Ani x Family` urge users and end users of the project, and/or any derivatives of `Ani x Family`, to support the creators of anime titles by purchasing their works, merchandise, and/or a subscription for consuming them, through official channels. `Ani x Family` is non-monetised, and provided as is. Every reasonable effort has been taken to ensure correctness and reliability of `Ani x Family`. We will not be liable for any special, direct, indirect, or consequential damages or any damages whatsoever resulting from loss of use, data or profits, whether in an action if contract, negligence or other tortious action, arising out of or in connection with the use of `Ani x Family` (in part or in whole).
