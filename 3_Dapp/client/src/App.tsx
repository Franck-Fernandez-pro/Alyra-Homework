import Workflow from './components/Workflow';
import NavBar from './components/NavBar';
import ActionsContainer from './components/ActionsContainer';
import Results from './components/Results';
import UtilsInterface from './components/UtilsInterface';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <ToastContainer
        position="bottom-center"
        hideProgressBar
      />
      <NavBar />
      <div className="flex gap-9 mt-20">
        <Workflow />
        <ActionsContainer />
      </div>
      <div className="mt-20">
        <UtilsInterface />
      </div>
      <div className="mt-20">
        <Results />
      </div>
    </div>
  );
}

export default App;
