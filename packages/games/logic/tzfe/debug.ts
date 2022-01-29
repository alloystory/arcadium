import Prompt from 'prompt-sync'
import TZFEBoard from './index'

const prompt = Prompt({ sigint: true })
prompt('Press enter to play: ')

let board = TZFEBoard.init()
console.log(`Board: ${board.toString()}`)

while (true) {
  if (board.hasEnded()) {
    console.log('Game ended')
    break
  }

  const input = prompt('Enter your move: ')
  if (input == 'a') {
    board = board.shiftLeft()
  } else if (input == 'd') {
    board = board.shiftRight()
  } else if (input == 'w') {
    board = board.shiftUp()
  } else if (input == 's') {
    board = board.shiftDown()
  }
  console.log(`Board: ${board.toString()}`)
}
