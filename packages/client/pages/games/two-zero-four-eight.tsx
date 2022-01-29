import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { TZFEBoard, Board } from '@arcadium/games'
import { useCallback, useEffect, useRef, useState } from 'react'
import useKeyPress from '../../hooks/useKeyPress'

const TZFE: NextPage = () => {
  const { board, gameEnded } = useTZFEBoard()
  useEffect(() => {
    if (gameEnded) {
      console.log('game ended')
    }
  }, [gameEnded])

  useEffect(() => {
    console.log('board', board)
  }, [board])

  return (
    <>
      <Head>
        <title>Arcadium Games</title>
      </Head>

      {board.map((row, i) => (
        <div className="row text-center" key={i}>
          {row.map((cell, j) => (
            <div className="col-1" key={j}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

function useTZFEBoard() {
  const boardState = useRef<TZFEBoard>(TZFEBoard.init())
  const [board, setBoard] = useState<Board>(boardState.current.get())
  const [gameEnded, setGameEnded] = useState<boolean>(false)

  const updateBoardState = useCallback(() => {
    setBoard(boardState.current.get())
    setGameEnded(boardState.current.hasEnded())
  }, [])

  useKeyPress('ArrowUp', () => {
    boardState.current = boardState.current.shiftUp()
    updateBoardState()
  })

  useKeyPress('ArrowDown', () => {
    boardState.current = boardState.current.shiftDown()
    updateBoardState()
  })

  useKeyPress('ArrowLeft', () => {
    boardState.current = boardState.current.shiftLeft()
    updateBoardState()
  })

  useKeyPress('ArrowRight', () => {
    boardState.current = boardState.current.shiftRight()
    updateBoardState()
  })

  return { board, gameEnded }
}

export default TZFE
