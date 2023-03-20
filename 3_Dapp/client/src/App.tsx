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
        <div className="flex gap-16 mx-44">
          <ActionsContainer />
          <Workflow />
        </div>
      </main>
      <footer className="footer footer-center bg-base-300 text-base-content p-4">
        <UtilsInterface />
      </footer>
    </>
  );
}

export default App;
