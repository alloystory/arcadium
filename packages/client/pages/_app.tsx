import 'bootstrap/dist/css/bootstrap.css'
import type { AppProps } from 'next/app'
import { defaultChains, Provider as WagmiProvider, useAccount } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import Image from 'next/image'

function AppWrapper(props: AppProps) {
  // Set up connectors
  const connectors = () => {
    return [new InjectedConnector({ chains: defaultChains })]
  }

  return (
    <WagmiProvider {...{ autoConnect: true, connectors }}>
      <App {...props} />
    </WagmiProvider>
  )
}

function App({ Component, pageProps }: AppProps) {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Arcadium
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/games"
                >
                  Games
                </a>
              </li>
              <li className="nav-item">
                {accountData && (
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
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default AppWrapper
