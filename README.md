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
11. In a terminal assuming the terminal is in `AniFam/src` run the command `python api/database/init_database.py` to initialize the database.
    - This should create both an `admin` account and a `guest` account. The admin account has password: `admin` and guest account with password: `guest`

### Running the Server (**Development**)
The web application has two different servers, the NextJS front-end server and the Flask back-end server.
Therefore there must be two instances of a terminal open.
1. Open up two terminals of your choice
2. Change the directories to be in the `/src` of the project in both terminals
3. In one terminal run command: `npm run next-dev`
4. Open up the other terminal and run: `./start.bat` and choose the development option when prompted.
5. Now open up `localhost:3000` in any web browser!

### Running the Server (**Production for Windows**)
These instructions assume that the [Environment](https://github.com/Bratah123/AniFam?tab=readme-ov-file#setup-steps-to-be-done-in-numbered-order) has been properly setup.
1. Open up two terminals of your choice
2. Change the directories to be in the `/src` of the project in both terminals
3. In one terminal run command: `npm run build`
4. In that same terminal run `npm run start`
5. Open up the other terminal and run: `./start.bat` and choose the production option when prompted
6. Now the website should be live on your local network at `http://public_ipv4_address:3000/`.

### Opening the Website to Public (**Production**)
These instructions are if you want to be able to access the website on a network where the website isn't hosted.
1. Port forward the following ports (TCP): `3000` and `5328` (Flask Server)
2. Change the [IP_ADDRESS](https://github.com/Bratah123/AniFam/blob/main/src/app/media/page.tsx#L30) constant to the machine's public IPv4 network.
3. Done!

### Running the Server (**Production**)
> [!IMPORTANT]
These instructions are only applicable to a Linux OS Environment as intended.
1. TBD

## Gallery
![Login](https://github.com/Bratah123/AniFam/assets/58405975/4f80f5d8-02a4-4d71-8201-7073b9771ab6)
![Homepage](https://github.com/Bratah123/AniFam/assets/58405975/6f6f96a8-cf3c-44d8-bc67-acc89aa3d423)
![Admin](https://github.com/Bratah123/AniFam/assets/58405975/5045e263-e95e-443f-b817-26f8deafba56)

# Disclaimer
`Ani x Family` is an open-source full stack web application that collects anime-related metadata and media, and serves them to end users. `Ani x Family` is an educational project for demonstrating various techniques, such as web scraping and UI design. The creators of `Ani x Family` urge users and end users of the project, and/or any derivatives of `Ani x Family`, to support the creators of anime titles by purchasing their works, merchandise, and/or a subscription for consuming them, through official channels. `Ani x Family` is non-monetised, and provided as is. Every reasonable effort has been taken to ensure correctness and reliability of `Ani x Family`. We will not be liable for any special, direct, indirect, or consequential damages or any damages whatsoever resulting from loss of use, data or profits, whether in an action if contract, negligence or other tortious action, arising out of or in connection with the use of `Ani x Family` (in part or in whole).
