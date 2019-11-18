import { h, app } from "hyperapp";
import { runFull } from "./Mancala";
import Game from "./Game";
import Spinner from "./Spinner";
import axios from "axios";

const _state = {
  pieceInit: 1,
  boardLength: 3,
  loading: false
};

const _actions = {
  changePieceInit: ({target: {value}}) => () => ({pieceInit: value}),
  changeBoardLength: ({target: {value}}) => () => ({boardLength: value}),
  changeLogging: ({target: {checked}}) => () => ({logging: checked}),
  runServer: () => ({boardLength, pieceInit}, {stopLoading}) => {
    const runFullPromise = new Promise(resolve => {
      axios.get(`/runFull`, {
        params: {
          bl: boardLength,
          pi: pieceInit
        }
      }).then((response) => {
        stopLoading();
        resolve(response);
      }).catch((response) => {
        stopLoading();
        console.log(response);
      });
    });

    runFullPromise.then(console.log);

    return {loading: true};
  },
  stopLoading: () => () => {
    return {loading: false};
  },
  runClient: () => ({boardLength, pieceInit}) => {
    console.log(runFull(boardLength, pieceInit));
  }
};

const _view = ({ boardLength, pieceInit, loading }, { changePieceInit, changeBoardLength, changeLogging, runServer, runClient }) =>
  <div id="contents">
    <div id="controls">
      <div><button onclick={runServer} disabled={loading}>Run Full Server</button></div>
      <div><button onclick={runClient} disabled={loading}>Run Full Client</button></div>
      <div>Piece Init:<input value={pieceInit} onchange={changePieceInit} /></div>
      <div>Board Length:<input value={boardLength} onchange={changeBoardLength} /></div>
    </div>
    {loading ? <Spinner /> :
      <div id="game">
        <Game />
      </div>}
  </div>;

app(_state, _actions, _view, document.body)