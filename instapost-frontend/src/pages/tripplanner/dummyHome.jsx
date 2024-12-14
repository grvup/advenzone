import React, { useState, useEffect } from 'react';
import bg2 from '../assets/adventure-2.jpg';
import './Home2.css';
import axios from 'axios';
import TripPlanner from './tripplanner/TripPlanner';
const Home = () => {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [queryPanelVisible, setQueryPanelVisible] = useState(false); // Query panel visibility
  const [query, setQuery] = useState('');
  const [outputMessages, setOutputMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const fullMessage = 'Welcome to Advenzone';
  const formatItinerary = (text) => {
    // Replace Day headings with larger text
    const html = text
        .replace(/### Day (\d+): (.+)/g, '<h1 style="font-size: 1.8em; margin-top: 20px;">Day $1: $2</h1>') // Larger Day headings
        .replace(/#### Morning:/g, '<p><strong>Morning:</strong></p>') // Bold Morning
        .replace(/#### Afternoon:/g, '<p><strong>Afternoon:</strong></p>') // Bold Afternoon
        .replace(/#### Evening:/g, '<p><strong>Evening:</strong></p>') // Bold Evening
        .replace(/- (.+?) \[(.+?)\]\((.+?)\)/g, '<li>$1: <a href="$3" target="_blank" style="color: blue; text-decoration: underline;">$2</a></li>') // Parse list with links
        .replace(/- (.+)/g, '<li>$1</li>'); // Parse bullet points

    // Wrap list items into <ul> tags and clean up structure
    return html.replace(/(<p><strong>.*?<\/strong><\/p>)/g, '</ul>$1<ul>').replace(/<\/ul>(?!<p>)/g, '</ul>');
};




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
    
    // Validate query
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    // Add user query to output messages
    setOutputMessages((prev) => [...prev, { 
      text: query, 
      type: 'user' 
    }]);

    setIsLoading(true);

    try {
      // Make API call to backend
      const response = await axios.post('http://localhost:5000/api/gptquery', {
        question: query
      });
      console.log(response)
      // Add AI response to output messages
      setOutputMessages((prev) => [...prev, { 
        text: response.data.result, 
        type: 'ai' 
      }]);
    } catch (error) {
      // Handle error
      console.error('Error fetching itinerary:', error);
      setOutputMessages((prev) => [...prev, { 
        text: 'Sorry, something went wrong. Please try again.', 
        type: 'error' 
      }]);
    } finally {
      // Reset loading state
      setIsLoading(false);
      // Clear input
      setQuery('');
    }
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
      <div style={{position:"absolute"}}>
      <TripPlanner/>

      </div>
      {/* Floating Button
      <button className="floating-button" onClick={toggleQueryPanel}>
        {queryPanelVisible ? 'Close' : 'Plan Your Trip'}
      </button>

      <div className={`query-panel ${queryPanelVisible ? 'show' : 'hide'}`}>
        <button className="close-button" onClick={toggleQueryPanel}>
          ×
        </button>
        <div className="output-area">
            {outputMessages.length === 0 ? (
                <p>No queries yet. Start by asking something!</p>
            ) : (
                outputMessages.map((msg, index) => (
                <div 
                    key={index} 
                    className={`message ${msg.type}`}
                    style={{
                    backgroundColor: 
                        msg.type === 'user' ? '#e6f2ff' : 
                        msg.type === 'ai' ? '#f0f0f0' : 
                        '#ffecb3',
                    padding: '10px',
                    margin: '5px 0',
                    borderRadius: '5px',
                    color:'black'
                    }}
                >
                   {msg.type === 'ai' ? (
                    // Check if message is from AI and attempt to parse the itinerary
                    <div dangerouslySetInnerHTML={{ __html: formatItinerary(msg.text) }} />
                ) : (
                    msg.text
                )}
                </div>
                ))
            )}
          {isLoading && <p>Loading...</p>}
        </div>
        <form onSubmit={handleQuerySubmit} className="query-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your trip..."
            className="query-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="query-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div> */}
    </div>
  );
};

export default Home;
