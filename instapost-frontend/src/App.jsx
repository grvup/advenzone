import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './App.css'
import InstaFeed from './pages/InstaFeed'
import HashtagFeed from './pages/HashtagFeed';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LocationAccess from './pages/location/LocationAccess';
import HashtagFeedLocation from './pages/locationbased/HashtagFeedLocation';
import HashtagFeedLocationActivity from './pages/locationactivitybased/HashtagFeedLocationActivity';
import HistoryItinerary from './pages/historyitinerary/historyItinerary';
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
        <Route path='/historyitinerary' element = {<HistoryItinerary/>}/>
        <Route path={`/location/:locationid/:locationname`} element={<HashtagFeedLocation />} />
        <Route path={`/location/:locationid/activity-details/:activityid/:locationname/:activityname`} element={<HashtagFeedLocationActivity />} />
        {/* https://www.advenzone.com/location/15/activity-details/70/bir-billing/hike---fly---paragliding */}
        
      </Routes>
    </div>
  </Router>
  )
}

export default App
