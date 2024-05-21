import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PetitionsList from "./components/PetitionsList.tsx";
import Home from "./components/Home.tsx";
import Petition from "./components/Petition.tsx";

function App() {
  return (
      <div className="App">
          <Router>
              <div>
                  <Routes>

                      <Route path="/" element={<PetitionsList/>}/>
                      <Route path="/petition/:id" element={<Petition />} />
                      <Route path="*" element={<Home/>}/>
                  </Routes>
              </div>
          </Router>
      </div>
  );
}

export default App
