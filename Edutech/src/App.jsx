import { Route, Routes } from "react-router-dom";
import React from "react"
import Home from "./Pages/Home"
import Navbaar from "./Components/Navbaar";
import Footer from "./Components/Footer";
function App() {
  return (

    <div>
      <Navbaar/>
      <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<h1>About </h1>} />
        <Route path="/contact" element={<h1>Contact</h1>} />

      </Routes>
      <Footer/>
    </div>

  )
}

export default App;
