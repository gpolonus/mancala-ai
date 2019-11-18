
# Mancala AI

## Stack

This game uses Node.js with Express to serve the game UI build in Hyperapp and provides REST API endpoints to allow for a AI opponent to beat you at Mancala.

## Installation

```
cd ./client
npm i
cd ../server
npm i
```

## Running

```
cd ./client
npm run build
cd ../server
npm run start
```


## TODOs

### Backend
- Add Lerna to install packages for client and server at the same time
- Add checking for infinite loops when running the full game choice tree
- Provide endpoints for checking the best next move based on the decision tree that was previously calculated

### Frontend
- Display the game
- Make interactive for 2 human players
- Add Computer AI as a player