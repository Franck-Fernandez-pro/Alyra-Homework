import { EthProvider } from "./contexts/EthContext";

function App() {
  return (
    <EthProvider>
      <div>
        <button className="btn btn-primary">Toto</button>
      </div>
    </EthProvider>
  );
}

export default App;
