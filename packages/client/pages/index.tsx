import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Arcadium</title>
      </Head>

      <main className="container">
        <h1>Welcome to Arcadium</h1>
        <button className="btn btn-primary">Connect</button>
      </main>
    </div>
  )
}

export default Home
