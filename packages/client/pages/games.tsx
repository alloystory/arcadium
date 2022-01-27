import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

type Game = {
  name: string
  link: string
  image: string
}

const Games: NextPage = () => {
  const games: Game[] = [
    {
      name: '2048',
      link: '/two-zero-four-eight',
      image: 'https://picsum.photos/600',
    },
  ]

  return (
    <>
      <Head>
        <title>Arcadium Games</title>
      </Head>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4">
        {games.map((game, i) => (
          <div key={i} className="col">
            <div className="card">
              <img src={game.image} className="card-img-top" />
              <div className="card-body text-center">
                <h5 className="card-title">{game.name}</h5>
                <a
                  href={game.link}
                  className="stretched-link card-title text-decoration-none text-center"
                >
                  Play now!
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Games
