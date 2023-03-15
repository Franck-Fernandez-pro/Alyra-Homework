import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, provider } = configureChains([hardhat], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <App />
    </RainbowKitProvider>
  </WagmiConfig>
);
