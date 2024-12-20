import React, { useState, useEffect } from 'react';
import bg2 from '../assets/adventure-2.jpg';
import './Home2.css';
import axios from 'axios';
import TripPlanner from './tripplanner/TripPlanner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Itinerary from './formatItinerary/formatItinerary';
import MainPage from './formatItinerary/formatItinerary3';
const Home = () => {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [queryPanelVisible, setQueryPanelVisible] = useState(false); // Query panel visibility
  const [query, setQuery] = useState('');
  const [outputMessages, setOutputMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isPopupVisible, setIsPopupVisible] = useState(false); // Popup visibility
  const [popupContent, setPopupContent] = useState(''); // Popup content
  const [formattedContent, setFormattedContent] = useState("");



  const fullMessage = 'Welcome to Advenzone';


  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullMessage.length) {
        setWelcomeMessage(fullMessage.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
        setTimeout(() => {
          setShowFinalMessage(true);
        }, 250);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const toggleQueryPanel = () => {
    setQueryPanelVisible((prev) => !prev);
  };
  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/gptquery', {
        question: query,
      });

      // Show popup with backend response
      setPopupContent(response.data.result);
      console.log(response.data.result_new)
      setIsPopupVisible(true);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      setPopupContent(' ');
      setIsPopupVisible(true);
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupContent('');
  };


  return (
    <div className="w-full flex justify-center items-center mt-2 relative">
      <div className="relative w-[85vw] h-[80vh] flex justify-center items-center">
        <img
          src={bg2}
          alt="Adventure"
          className="w-full h-full object-cover rounded-[10px]"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center">
          {(!isTypingComplete || !showFinalMessage) && (
            <h1 className="text-4xl font-bold mb-4 text-black text-center font-['Arial'] [text-shadow:0_0_7px_#fff,0_0_10px_#fff,0_0_21px_#fff,0_0_42px_#37BEC2,0_0_82px_#37BEC2,0_0_92px_#37BEC2,0_0_102px_#37BEC2,0_0_151px_#37BEC2] animate-pulse">
              {welcomeMessage}
            </h1>
          )}

          {showFinalMessage && (
            <div className="mt-5 text-center w-full px-4">
              <p className="text-2xl mb-5 text-black [text-shadow:0_0_7px_#fff,0_0_10px_#fff,0_0_21px_#fff,0_0_42px_#37BEC2,0_0_82px_#37BEC2,0_0_92px_#37BEC2]">
                Advenzone - Your Gateway to Unstoppable Adventure
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="/posts"
                  className="px-5 py-2.5 bg-[#37BEC2] text-[white] no-underline text-base font-bold rounded-[5px] transition-all duration-300 hover:bg-[#377ac2] hover:shadow-[0_0_7px_#fff,0_0_10px_#fff,0_0_21px_#fff,0_0_42px_#37BEC2]"
                >
                  User's Post
                </a>
                <a
                  href="/hashtags"
                  className="px-5 py-2.5 bg-[#37BEC2] text-white no-underline text-base font-bold rounded-[5px] transition-all duration-300 hover:bg-[#377ac2] hover:shadow-[0_0_7px_#fff,0_0_10px_#fff,0_0_21px_#fff,0_0_42px_#37BEC2]"
                >
                  HashTags Post
                </a>
              </div>
              <form onSubmit={handleQuerySubmit} className="query-form-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Plan your trip with our new trip planner..."
                  className="query-input-1"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="query-submit-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      {isPopupVisible && (
        <div className="popup-container">
          <div className="popup-content">
            <button className="popup-close" onClick={closePopup}>
              Close
            </button>
            <div
              id="popup-output"  // Add this id here
              className="popup-output"
              // dangerouslySetInnerHTML={{__html: formattedContent }}
            >
             {/* <Itinerary rawData={popupContent} /> */}
             <MainPage rawData={popupContent} />
            </div>
         
          </div>
        </div>
      )}
      {/* <div style={{position:"absolute"}}>
      <TripPlanner/>

      </div> */}
    </div>
  );
};

export default Home;
