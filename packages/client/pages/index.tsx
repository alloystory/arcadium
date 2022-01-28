import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useAccount, useConnect } from 'wagmi'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  return (
    <>
      <Head>
        <title>Arcadium</title>
      </Head>

      <h1>Welcome to Arcadium</h1>
      {!accountData ? (
        connectData.connectors.map((connector) => (
          <button
            key={connector.id}
            className="btn btn-primary"
            disabled={!connector.ready}
            onClick={() => connect(connector)}
          >
            Connect via {connector.name}
            {!connector.ready && ' (unsupported)'}
          </button>
        ))
      ) : (
        <div>You are connected</div>
      )}
      {connectError && (
        <div>{connectError?.message ?? 'Failed to connect'}</div>
      )}
    </>
  )
}

export default Home
