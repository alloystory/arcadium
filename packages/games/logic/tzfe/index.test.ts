import TZFEBoard, { Board } from './index'
import { expect } from 'chai'
import _ from 'lodash'

describe('TZFEBoard', () => {
  it('should be a 4x4 matrix', () => {
    const board = TZFEBoard.init().get()
    expect(board).to.have.lengthOf(4)

    const rowLengths = board.map((row) => row.length)
    const rowsAreAllLengthFour = rowLengths.every((length) => length == 4)
    expect(rowsAreAllLengthFour).to.be.true
  })

  it('should have 2 non empty cells on initialization', () => {
    const board = TZFEBoard.init()
    const numNonEmptyCells = _.sum(
      board.get().map((row) => row.filter((cell) => cell > 0).length)
    )
    expect(numNonEmptyCells).to.equal(2)
  })
})
