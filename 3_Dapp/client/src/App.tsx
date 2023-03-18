import Workflow from "./components/Workflow";
import NavBar from "./components/NavBar";
import ActionsContainer from "./components/ActionsContainer";
import Results from "./components/Results";
import OwnerInterface from "./components/OwnerInterface";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
      <ToastContainer position="bottom-center" hideProgressBar />
      <NavBar />
      <div className="mt-20 flex gap-9">
        <Workflow />
        <ActionsContainer />
      </div>
      <div className="mt-20">
        <OwnerInterface />
      </div>
      <div className="mt-20">
        <Results />
      </div>
    </div>
  );
}

export default App;
