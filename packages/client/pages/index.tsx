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
    <div className={styles.container}>
      <Head>
        <title>Arcadium</title>
      </Head>

      <main className="container">
        <h1>Welcome to Arcadium</h1>
        {accountData ? (
          <div>
            {accountData.ens?.avatar && (
              <Image src={accountData.ens.avatar} alt="ENS Avatar" />
            )}
            <div>
              {accountData.ens?.name
                ? `${accountData.ens.name} (${accountData.address})`
                : accountData.address}
            </div>
            <div>Connected to {accountData.connector?.name}</div>
            <button className="btn btn-primary" onClick={disconnect}>
              Disconnect
            </button>
          </div>
        ) : (
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
        )}
        {connectError && (
          <div>{connectError?.message ?? 'Failed to connect'}</div>
        )}
      </main>
    </div>
  )
}

export default Home
