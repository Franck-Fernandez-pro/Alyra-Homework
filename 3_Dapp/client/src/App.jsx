import { EthProvider } from "./contexts/EthContext";
import Workflow from "./components/Workflow";
import NavBar from "./components/NavBar";

function App() {
  return (
    <EthProvider>
      <div>
        {/* <button className="btn btn-primary">Toto</button> */}
        <NavBar />
        <Workflow />
      </div>
    </EthProvider>
  );
}

export default App;
