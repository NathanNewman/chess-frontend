# Chess

A place to hone in your chess skills.

## About

Chess is a class project for Springboard which allows users to play chess against the stockfish game engine. It was created using React for the frontend and Node Express for the backend. This repository is for the frontend code. The web address to the backend repository is... https://github.com/NathanNewman/chess-backend/blob/c0d62f1db9663af217bf0d1cc377dcdf54cae20a/README.md

## Deployed Version

https://64e39b741c12a50a1100fa64--vermillion-gelato-67522b.netlify.app/#/

## Features

- User signup/login/logout
    This feature was included so that other features can also be included, such as replays, leaderboard, etc.
- Play vs stockfish AI
    When deciding on how to implement play for my site, I decided player vs AI was the route I wanted to go. In one sense, it's challenging as I had to learn how to work with the stockfish AI. On the other hand, player vs AI is easier for a single person to test as opposed to player vs player.
- Difficulty adjusts based on player ranking
    Initially I planned on having a difficulty slider. I found it more interesting to have the difficult adjust to player rankings. Difficulty in stockfish is based on search depth. Basically, how many moves the AI thinks ahead. The player's elo is used to determine the depth.
- Leaderboard
    The leaderboard includes the top 10 players registered on the website. Players are ranked based on elo.
- Match replay system
    After a match is completed, the match data which includes every move from the match is sent to the Node Express API to be stored in a postgres database. Users can view a list of their previous matches and click on them to start the replay. The replay system uses two buttons, forward and back, to navigate through the moves. This method was chosen because it gives users the opportunity to examine moves at their own pace.

## User Flow
1. User visits the site and is redirected to the login page. If the user is not registered, the login page has a link to the signup page. Sign up and login can also be accessed through the navbar. All other navbar links are currently disabled.
2. After the user logs in or signs up, the browser redirects to a game. At this point, all the links in the navbar are now usable. Signup and Login are replaced with the username, which links to the profile page, and logout.
3. After completing a game, the user will be given an offer to play again. The user can access game data as well as watch a replay of the game by clicking the replay link in the navbar. The user can also access the leaderboard.
4. The user can view information and delete account on the profile page.

## Install

Make sure your computer has Node and NPM installed. Download the respository. Navigator to the chess-frontend directory inside your terminal. Use 'npm install' to install the files.

## Run/Test

 - To run, use 'npm start' inside the chess-frontend directory.
 - To test, use 'npm test' inside the chess-frontend directory.