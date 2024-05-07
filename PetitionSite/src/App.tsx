import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./components/Petitions.tsx";

function App() {
  return (
      <div className="App">
          <Router>
              <div>
                  <Routes>
                      See https://v5.reactrouter.com/web/guides/quick-start
                      SENG365 - Structuring Client-side Applications in React 3 / 10
                      <Route path="/pettions" element={<Petitions/>}/>
                      <Route path="*" element={<Petitions/>}/>
                  </Routes>
              </div>
          </Router>
      </div>
  );
}

export default App
