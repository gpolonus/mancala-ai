
const express = require('express');
const path = require('path');
const app = express();
const {
  runFull,
  calculateOdds,
  Mancala
} = require("./Mancala");

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/runFull', function ({query: {bl, pi}}, res) {
  console.log('/runFull hit')
  const choiceTree = runFull(bl, pi);
  res.send(JSON.stringify(choiceTree));
});

app.get('/odds', function ({query: {m}}, res) {
  console.log('/odds hit')
  const currentBoard = Mancala.copy(m);
  const theOdds = calculateOdds(currentBoard);
  res.send(theOdds);
});

const port = 8082;
app.listen(port, function () {
  console.log('Listening on http://localhost:' + port);
});