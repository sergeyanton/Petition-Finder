import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PetitionsList from "./components/PetitionsList.tsx";
import Petition from "./components/Petition.tsx";
import Register from "./components/Register.tsx";
import LogIn from "./components/LogIn.tsx";
import CreatePetition from "./components/CreatePetition.tsx";
import Profile from "./components/Profile.tsx";

function App() {
    return (
      <div className="App">
          <Router>
              <div>
                  <Routes>
                    <Route path="/home" element={<PetitionsList/>}/>
                      <Route path="*" element={<PetitionsList/>}/>
                    <Route path="/petition/:id" element={<Petition />} />
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<LogIn/>}/>
                    <Route path="/createPetition" element={<CreatePetition/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                  </Routes>
              </div>
          </Router>
      </div>
  );
}

export default App
