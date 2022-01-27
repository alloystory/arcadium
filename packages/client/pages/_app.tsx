import 'bootstrap/dist/css/bootstrap.css'
import type { AppProps } from 'next/app'
import { defaultChains, Provider as WagmiProvider } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function MyApp({ Component, pageProps }: AppProps) {
  // Set up connectors
  const connectors = () => {
    return [new InjectedConnector({ chains: defaultChains })]
  }

  return (
    <WagmiProvider {...{ autoConnect: true, connectors }}>
      <Component {...pageProps} />
    </WagmiProvider>
  )
}

export default MyApp
