
const m = require('./Mancala')
const co = m.calculateOdds
const rf = m.runFull
const d = rf(2, 2)
console.log(co(d))
