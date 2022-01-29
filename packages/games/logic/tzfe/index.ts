import _, { first } from 'lodash'
import assert from '@arcadium/utils/typescript/assert'

export type Row = [number, number, number, number]
export type Board = [Row, Row, Row, Row]
const DIMENSIONS = 4

class TZFEBoard {
  private _board: Board | undefined

  private constructor(board: Board) {
    this._board = _.cloneDeep(board)
  }

  static init() {
    const board = _.range(0, DIMENSIONS).map<Row>((_) => [0, 0, 0, 0]) as Board
    TZFEBoard._createNewCell(board)
    TZFEBoard._createNewCell(board)
    return new TZFEBoard(board)
  }

  get() {
    assert(this._board, 'Board does not exist')
    return this._board
  }

  shiftLeft() {
    assert(this._board, 'Board does not exist')
    if (!this._canShiftLeft()) return this

    const board = _.cloneDeep(this._board)
    for (let i = 0; i < DIMENSIONS; i++) {
      for (let j = 0; j < DIMENSIONS - 1; j++) {
        if (board[i][j] == 0) continue

        for (let k = j + 1; k < DIMENSIONS; k++) {
          if (board[i][k] != 0) {
            if (board[i][j] == board[i][k]) {
              board[i][j] += board[i][k]
              board[i][k] = 0
            }
            break
          }
        }
      }
    }

    for (let i = 0; i < DIMENSIONS; i++) {
      for (let j = 0; j < DIMENSIONS - 1; j++) {
        if (board[i][j] != 0) continue

        for (let k = j + 1; k < DIMENSIONS; k++) {
          if (board[i][k] != 0) {
            board[i][j] = board[i][k]
            board[i][k] = 0
            break
          }
        }
      }
    }

    TZFEBoard._createNewCell(board)
    return new TZFEBoard(board)
  }

  shiftRight() {
    assert(this._board, 'Board does not exist')
    if (!this._canShiftRight()) return this

    const board = _.cloneDeep(this._board)
    for (let i = 0; i < DIMENSIONS; i++) {
      for (let j = DIMENSIONS - 1; j > 0; j--) {
        if (board[i][j] == 0) continue

        for (let k = j - 1; k >= 0; k--) {
          if (board[i][k] != 0) {
            if (board[i][j] == board[i][k]) {
              board[i][j] += board[i][k]
              board[i][k] = 0
            }
            break
          }
        }
      }
    }

    for (let i = 0; i < DIMENSIONS; i++) {
      for (let j = DIMENSIONS - 1; j > 0; j--) {
        if (board[i][j] != 0) continue

        for (let k = j - 1; k >= 0; k--) {
          if (board[i][k] != 0) {
            board[i][j] = board[i][k]
            board[i][k] = 0
            break
          }
        }
      }
    }

    TZFEBoard._createNewCell(board)
    return new TZFEBoard(board)
  }

  shiftUp() {
    assert(this._board, 'Board does not exist')
    if (!this._canShiftUp()) return this

    const board: Board = _.cloneDeep(this._board)
    for (let i = 0; i < DIMENSIONS; i++) {
      for (let j = 0; j < DIMENSIONS - 1; j++) {
        if (board[j][i] == 0) continue

        for (let k = j + 1; k < DIMENSIONS; k++) {
          if (board[k][i] != 0) {
            if (board[j][i] == board[k][i]) {
              board[j][i] += board[k][i]
              board[k][i] = 0
            }
            break
          }
        }
      }
    }

    for (let i = 0; i < DIMENSIONS; i++) {
      for (let j = 0; j < DIMENSIONS - 1; j++) {
        if (board[j][i] != 0) continue

        for (let k = j + 1; k < DIMENSIONS; k++) {
          if (board[k][i] != 0) {
            board[j][i] = board[k][i]
            board[k][i] = 0
            break
          }
        }
      }
    }

    TZFEBoard._createNewCell(board)
    return new TZFEBoard(board)
  }

  shiftDown() {
    assert(this._board, 'Board does not exist')
    if (!this._canShiftDown()) return this

    const board: Board = _.cloneDeep(this._board)
    for (let i = 0; i < DIMENSIONS; i++) {
      for (let j = DIMENSIONS - 1; j > 0; j--) {
        if (board[j][i] == 0) continue

        for (let k = j - 1; k >= 0; k--) {
          if (board[k][i] != 0) {
            if (board[j][i] == board[k][i]) {
              board[j][i] += board[k][i]
              board[k][i] = 0
            }
            break
          }
        }
      }
    }

    for (let i = 0; i < DIMENSIONS; i++) {
      for (let j = DIMENSIONS - 1; j > 0; j--) {
        if (board[j][i] != 0) continue

        for (let k = j - 1; k >= 0; k--) {
          if (board[k][i] != 0) {
            board[j][i] = board[k][i]
            board[k][i] = 0
            break
          }
        }
      }
    }

    TZFEBoard._createNewCell(board)
    return new TZFEBoard(board)
  }

  hasEnded() {
    return (
      !this._canShiftLeft() &&
      !this._canShiftRight() &&
      !this._canShiftUp() &&
      !this._canShiftDown()
    )
  }

  private _canShiftLeft() {
    assert(this._board, 'Board does not exist')
    return !this._board.every((_row) => {
      const firstZero = _.findIndex(_row, (cell) => cell == 0)
      let noAdjacentMerging = true
      for (let i = 0; i < DIMENSIONS - 1; i++) {
        noAdjacentMerging = noAdjacentMerging && _row[i] != _row[i + 1]
      }
      // Cannot shift left.
      return firstZero == -1
        ? noAdjacentMerging
        : noAdjacentMerging && _row.slice(firstZero).every((cell) => cell == 0)
    })
  }

  private _canShiftRight() {
    assert(this._board, 'Board does not exist')
    return !this._board.every((_row) => {
      const lastZero = _.findLastIndex(_row, (cell) => cell == 0)
      let noAdjacentMerging = true
      for (let i = DIMENSIONS - 1; i > 0; i--) {
        noAdjacentMerging = noAdjacentMerging && _row[i] != _row[i - 1]
      }
      return lastZero == -1
        ? noAdjacentMerging
        : noAdjacentMerging && _row.slice(lastZero).every((cell) => cell == 0)
    })
  }

  private _canShiftUp() {
    assert(this._board, 'Board does not exist')
    return !TZFEBoard._rotateLeft(this._board).every((_row) => {
      const firstZero = _.findIndex(_row, (cell) => cell == 0)
      let noAdjacentMerging = true
      for (let i = 0; i < DIMENSIONS - 1; i++) {
        noAdjacentMerging = noAdjacentMerging && _row[i] != _row[i + 1]
      }
      return firstZero == -1
        ? noAdjacentMerging
        : noAdjacentMerging && _row.slice(firstZero).every((cell) => cell == 0)
    })
  }

  private _canShiftDown() {
    assert(this._board, 'Board does not exist')
    return !TZFEBoard._rotateLeft(this._board).every((_row) => {
      const lastZero = _.findLastIndex(_row, (cell) => cell == 0)
      let noAdjacentMerging = true
      for (let i = DIMENSIONS - 1; i > 0; i--) {
        noAdjacentMerging = noAdjacentMerging && _row[i] != _row[i - 1]
      }
      return lastZero == -1
        ? noAdjacentMerging
        : noAdjacentMerging && _row.slice(lastZero).every((cell) => cell == 0)
    })
  }

  private static _createNewCell(board: Board) {
    const emptyCellIndices: [number, number][] = []
    for (let i = 0; i < DIMENSIONS; i++) {
      for (let j = 0; j < DIMENSIONS; j++) {
        if (board[i][j] == 0) {
          emptyCellIndices.push([i, j])
        }
      }
    }

    const randomCell = _.sample(emptyCellIndices)
    if (randomCell) {
      const isSpecialCell = _.random(0, 1, true) <= 0.1
      const [i, j] = randomCell
      board[i][j] = isSpecialCell ? 4 : 2
    }
  }

  private static _rotateLeft(board: Board) {
    return _.zip(...board)
  }

  toString() {
    let output = []
    for (const row of this._board ?? []) {
      output.push(`  [${row.join(',')}]`)
    }
    return `[\n${output.join(',\n')}\n]\n`
  }
}

export default TZFEBoard
