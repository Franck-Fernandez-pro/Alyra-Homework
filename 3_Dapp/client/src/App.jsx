import { EthProvider } from "./contexts/EthContext";
import Workflow from "./components/Workflow";

function App() {
  return (
    <EthProvider>
      <div>
        <button className="btn btn-primary">Toto</button>
        <Workflow />
      </div>
    </EthProvider>
  );
}

export default App;
