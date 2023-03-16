import Workflow from './components/Workflow';
import NavBar from './components/NavBar';
import ActionsContainer from './components/ActionsContainer';
import Results from './components/Results';

function App() {
  return (
    <div>
      <NavBar />
      <div className="flex gap-9 mt-20">
        <Workflow />
        <ActionsContainer />
      </div>
      <div className="mt-20">
        <Results />
      </div>
    </div>
  );
}

export default App;
