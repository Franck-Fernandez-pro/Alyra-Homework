import Workflow from './components/Workflow';
import NavBar from './components/NavBar';
import ActionsContainer from './components/ActionsContainer';
import UtilsInterface from './components/UtilsInterface';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <NavBar />
      <main>
        <ToastContainer position="bottom-right" hideProgressBar />
        <div className="mt-20 flex gap-9">
          <Workflow />
          <ActionsContainer />
        </div>
      </main>
      <footer className="footer footer-center bg-base-300 text-base-content p-4">
        <UtilsInterface />
      </footer>
    </>
  );
}

export default App;
