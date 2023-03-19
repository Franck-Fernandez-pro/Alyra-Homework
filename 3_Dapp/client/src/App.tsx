import Workflow from './components/Workflow';
import NavBar from './components/NavBar';
import ActionsContainer from './components/ActionsContainer';
import Results from './components/Results';
import UtilsInterface from './components/UtilsInterface';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <NavBar />
      <main>
        <ToastContainer position="bottom-center" hideProgressBar />
        <div className="mt-20 flex gap-9">
          <Workflow />
          <ActionsContainer />
        </div>
        {/* <div className="mt-20">
          <Results />
        </div> */}
      </main>
      <footer className="footer footer-center bg-base-300 text-base-content p-4">
        <UtilsInterface />
      </footer>
    </>
  );
}

export default App;
