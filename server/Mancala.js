
class Mancala {
  constructor(bl, pi) {
    this.length = parseInt(bl) || 2;
    const initPieceCount = parseInt(pi) || 1;

    this.board = [
      [...Array(this.length).fill(initPieceCount || 0), 0],
      [...Array(this.length).fill(initPieceCount || 0), 0],
    ];

    this.current = 0;

    this.winner = false;
  }

  doTurn(playerNum, spot) {
    if (this.winner !== false) {
      return;
    }

    if (this.current !== playerNum) {
      return;
    }
    // pn is the side I'm on
    // s is the spot I'm on RIGHT NOW
    // return: whether or not to switch the player
    const doMove = (piecesLeft, pn, s) => {
      if (piecesLeft <= 0) {
        if (playerNum !== pn && s === 0) {
          return false;
        }
        return true;
      }
      this.board[pn][s]++;
      piecesLeft--;
      if (s === this.length) {
        if (pn !== playerNum) {
          this.board[pn][s]--;
        }
        return doMove(piecesLeft, 1 - pn, 0);
      } else {
        return doMove(piecesLeft, pn, s + 1);
      }
    }

    const piecesInit = this.board[playerNum][spot];
    this.board[playerNum][spot] = 0;
    const switchPlayer = doMove(piecesInit, playerNum, spot + 1);
    this.winner = this.winTest();
    if (this.winner === false && switchPlayer) {
      this.current = 1 - this.current;
    }
  }

  winTest() {
    if (this.board.map(side => side.slice(0, this.length).every(spot => spot === 0)).some(test => test)) {
      const [fp, sp] = this.points();
      if (fp > sp) {
        return 0;
      } else {
        return 1;
      }
    } else {
      return false;
    }
  }

  points({ fp, sp } = {}) {
    fp && (this.board[0][this.length] = fp);
    sp && (this.board[1][this.length] = sp);
    return [
      this.board[0][this.length],
      this.board[1][this.length]
    ];
  }

  static copy(m) {
    const _m = new Mancala(m.length);
    _m.board = [[...m.board[0]], [...m.board[1]]];
    _m.current = m.current;
    return _m;
  }

  toString() {
    return `${this.board[1].map((_, i, list) => list[list.length - 1 - i]).join(' ')}
    ${this.board[0].join(' ')}`;
  }

  toJSON() {
    const { winner, board, current, length } = this;
    return { winner, board, current, length }
  }
}

const runFull = (boardLength, piecesInit) => {
  const mancala = new Mancala(boardLength, piecesInit);
  return runFullOnBoard(mancala);
};

const runFullOnBoard = (mancala) => {
  const runLayer = (m) => {
    return m.board.map((playerSide, playerNum) => playerSide.slice(0, m.length).map((numPieces, spot) => {
      const _m = Mancala.copy(m);
      if (_m.current !== playerNum || numPieces === 0) {
        return false;
      }
      _m.doTurn(playerNum, spot);
      if (_m.winner === false) {
        return runLayer(_m);
      }
      return _m.winner;
    }));
  };

  return runLayer(mancala);
}

function firstWinInc(ac) {
  return [ ac[0] + 1, ac[1], ac[2] + 1 ]
}

function secondWinInc(ac) {
  return [ ac[0], ac[1] + 1, ac[2] + 1 ]
}

const calculateOdds = (choiceTree) => {
  const co = (ct, stats = [0, 0, 0]) => {
    return ct.reduce((ac, side) => {
      return side.reduce((_ac, spot) => {
        // return [ firstWins, secondWins, totalWins ]
        if(spot === false) {
          return _ac
        } else if(spot === 0) {
          return firstWinInc(_ac)
        } else if(spot === 1) {
          return secondWinInc(_ac)
        } else {
          // spot is an Array
          return co(spot, _ac)
        }
      }, ac)
    }, stats)
  }

  return co(choiceTree)
}

module.exports = {
  runFull,
  runFullOnBoard,
  calculateOdds,
  Mancala
};