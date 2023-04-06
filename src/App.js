import React from 'react';
import { Route, Routes, useLocation} from "react-router-dom"
import MainPage from './components/MainPage/MainPage.jsx';
import Home from "./components/Home/Home.jsx"
import DogDetail from "./components/DogDetail/DogDetail.jsx";
import CreateDog from "./components/CreateDog/CreateDog";
import Nav from './components/Nav/Nav.jsx'
import './App.css';

function App() {
  const location = useLocation()
  return (
    <div className="App">
      {location.pathname !== "/"? <Nav></Nav>: null}
      <Routes>
        <Route path='/' element={<MainPage/>}></Route>
        <Route path="/home" element={<Home></Home>}></Route>
        <Route path="/dog/:raza_perro" element={<DogDetail></DogDetail>}></Route>
        <Route path="/dog/create" element={<CreateDog></CreateDog>}></Route>
      </Routes>
    </div>
  );
}

export default App;
