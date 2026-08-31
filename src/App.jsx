import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "./components/Button";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { CBTSidebar } from "./pages/SideBar/CBTSidebar"
import { Home } from "./Home.jsx";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cbtsidebar" element={<CBTSidebar />} />
        </Routes>
      </BrowserRouter>
      {/* <Login /> */}
      {/* <Home /> */}
      {/* <CBTSidebar /> */}
      {/* <Register /> */}
      {/* <h1 className="font-bold text-2xl">Hello Victor Dike 👋</h1> */}
      {/* <Button name="MyBtn"/> */}
    </>
  );
}

export default App;
