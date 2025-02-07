
import { Route, Routes } from 'react-router-dom'
import './App.css'
// import Login from './component/Login'
import SignUp from './component/Signup'
import Login from './component/Login'
import Navbar from './component/Navbar'
import Dashboard from './component/Dashboard'
import Home from './component/Home'
import Cart from './component/Cart'

function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App
