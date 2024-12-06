import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './App.css'
import InstaFeed from './pages/InstaFeed'
import HashtagFeed from './pages/HashtagFeed';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LocationAccess from './pages/LocationAccess';
import { ChakraProvider } from '@chakra-ui/react';
function App() {


  return (
    <Router>
    <div className="App" style={{fontFamily: "Poppins,sans-serif!important"}}>
      <Navbar/>
      <Routes>
        <Route path="/" element={
          <div>
            <Home />
            <LocationAccess/>
          </div>
        } />
        <Route path="/posts" element={<InstaFeed />} />
        <Route path="/hashtags" element={<HashtagFeed />} />
      </Routes>
    </div>
  </Router>
  )
}

export default App
