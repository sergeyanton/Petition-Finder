import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import allPetitions from "./components/allPetitions.tsx";
import {Route, Router, Routes} from "react-router-dom";

function App() {

  return (
      <div className="App">
          <Router>
              <div>
                  <Routes>
                      See https://v5.reactrouter.com/web/guides/quick-start
                      SENG365 - Structuring Client-side Applications in React 3 / 10
                      <Route path="/pettions" element={<allPetitions/>}/>
                  </Routes>
              </div>
          </Router>
      </div>
  );
}

export default App
