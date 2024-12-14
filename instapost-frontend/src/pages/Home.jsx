import React, { useState, useEffect } from 'react';
import bg2 from '../assets/adventure-2.jpg';
import './Home2.css';
import axios from 'axios';
import TripPlanner from './tripplanner/TripPlanner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Itinerary from './formatItinerary/formatItinerary';
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
//   const formatItinerary = (text) => {
//     // Replace Day headings with larger text
//     const html = text
//         .replace(/### Day (\d+): (.+)/g, '<h1 style="font-size: 1.8em; margin-top: 20px;">Day $1: $2</h1>') // Larger Day headings
//         .replace(/#### Morning:/g, '<p><strong>Morning:</strong></p>') // Bold Morning
//         .replace(/#### Afternoon:/g, '<p><strong>Afternoon:</strong></p>') // Bold Afternoon
//         .replace(/#### Evening:/g, '<p><strong>Evening:</strong></p>') // Bold Evening
//         .replace(/- (.+?) \[(.+?)\]\((.+?)\)/g, '<li>$1: <a href="$3" target="_blank" style="color: blue; text-decoration: underline;">$2</a></li>') // Parse list with links
//         .replace(/- (.+)/g, '<li>$1</li>'); // Parse bullet points

//     // Wrap list items into <ul> tags and clean up structure
//     return html.replace(/(<p><strong>.*?<\/strong><\/p>)/g, '</ul>$1<ul>').replace(/<\/ul>(?!<p>)/g, '</ul>');
// };




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
      setIsPopupVisible(true);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      setPopupContent('### Day 1: Arrival in Goa #### Morning: - Check into your accommodation - Relax on Baga Beach - [Baga Beach Activities](https://www.advenzone.com/location/26/activity-details/25/baga-beach/butterfly-swimmers) #### Afternoon: - Lunch at a beachside shack - Explore the local markets at Anjuna - Try out some water sports at Baga Beach - [Lake Boating at Baga Beach](https://www.advenzone.com/location/26/activity-details/35/baga-beach/lake-boating) - [Bungee 100m at Baga Beach](https://www.advenzone.com/location/26/activity-details/108/baga-beach/bungee-100m) #### Evening: - Enjoy a sunset cruise on the Arabian Sea - Dinner at a seafood restaurant - Experience camping on Baga Beach - [Goa Camping at Baga Beach](https://www.advenzone.com/location/26/activity-details/118/baga-beach/goa-camping) ### Day 2: Adventure in Goa #### Morning: - Breakfast at a local cafe - Paragliding adventure in the skies of Goa - [Paragliding at Goa](https://www.advenzone.com/location/42/activity-details/110/goa/paragliding) #### Afternoon: - Lunch at a beachside restaurant - Jet ski or banana boat ride at Calangute Beach #### Evening: - Visit local temples or churches - Dinner at a beachfront restaurant ### Day 3: Nature and Culture Exploration #### Morning: - Breakfast at a beach shack - Visit the Dudhsagar Waterfalls - Trekking at Dudhsagar - [Trekking Madurai at Madurai](https://www.advenzone.com/location/36/activity-details/172/madurai/trekking-madurai) #### Afternoon: - Lunch at a local eatery - Explore the wildlife at Bondla Wildlife Sanctuary #### Evening: - Relax at Miramar Beach - Dinner at a beachside restaurant ### Day 4: Thrill Seekers Paradise #### Morning: - Breakfast at a local cafe - Enjoy water sports at Colva Beach #### Afternoon: - Lunch at a beach shack - Bike rental for exploring the scenic routes #### Evening: - Dinner at');
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

  // const downloadPDF = () => {
  //   const element = document.getElementById('popup-output');
  //   if (!element) {
  //     console.error('Element with id "popup-output" not found');
  //     return;
  //   }
  
  //   html2canvas(element, { 
  //     scale: 2,  // Increase scale for better quality
  //     useCORS: true,  // Help with cross-origin images
  //     logging: true   // Enable logging for debugging
  //   }).then((canvas) => {
  //     try {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF('p', 'mm', 'a4');
  //       const imgWidth = pdf.internal.pageSize.getWidth() - 20;
  //       const pageHeight = pdf.internal.pageSize.getHeight();
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
  //       pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
  //       pdf.save('itinerary.pdf');
  //     } catch (error) {
  //       console.error('Error creating PDF:', error);
  //     }
  //   }).catch((error) => {
  //     console.error('Error with html2canvas:', error);
  //   });
  // };
  // const downloadPDF = () => {
  //   const pdf = new jsPDF();
    
  //   // Title
  //   pdf.setFontSize(16);
  //   pdf.setFont('helvetica', 'bold');
  //   pdf.text('Travel Itinerary', 105, 10, { align: 'center' });
    
  //   // Body text
  //   pdf.setFontSize(12);
  //   pdf.setFont('helvetica', 'normal');
    
  //   // Split text and add with more specific positioning
  //   const splitText = pdf.splitTextToSize(popupContent, 180);
  //   pdf.text(splitText, 15, 20);
    
  //   pdf.save('itinerary.pdf');
  // };
  const downloadPDF = () => {
    const pdf = new jsPDF();
    
    // Helper function to log parsing steps
    const logParse = (message) => {
      console.log(`PDF Parse: ${message}`);
    };
  
    const parseItinerary = (text) => {
      logParse('Starting itinerary parsing');
      
      // Reset PDF
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(18);
      pdf.text('Travel Itinerary', 105, 15, { align: 'center' });
  
      // Reset font for body
      pdf.setFontSize(12);
      
      let yPosition = 30;
      
      // Detailed logging of input text
      logParse(`Input text length: ${text.length}`);
      logParse(`Input text: ${text}`);
  
      // More robust splitting and parsing
      const processText = (content) => {
        // Split by markdown headers
        const sections = content.split(/(?=###\s*Day)/);
        
        logParse(`Number of sections found: ${sections.length}`);
  
        sections.forEach((section, index) => {
          // Skip empty sections
          if (!section.trim()) return;
  
          logParse(`Processing section ${index + 1}`);
  
          // Extract day and title
          const dayMatch = section.match(/###\s*Day\s*(\d+):\s*(.+)/);
          if (dayMatch) {
            pdf.setFontSize(14);
            pdf.setTextColor(0, 100, 0);
            pdf.text(`Day ${dayMatch[1]}: ${dayMatch[2]}`, 15, yPosition);
            yPosition += 10;
          }
  
          // Process subsections (Morning, Afternoon, Evening)
          const subsections = section.split(/####\s*/);
          
          subsections.slice(1).forEach(subsection => {
            // Extract subsection title
            const [titleMatch, ...activities] = subsection.split('\n');
            
            if (titleMatch) {
              pdf.setFontSize(12);
              pdf.setTextColor(70, 130, 180);
              pdf.text(titleMatch.trim(), 15, yPosition);
              yPosition += 8;
            }
  
            // Process activities
            pdf.setTextColor(0, 0, 0);
            activities.forEach(activity => {
              // Trim and skip empty lines
              activity = activity.trim();
              if (!activity.startsWith('-')) return;
  
              // Remove the dash and trim
              activity = activity.replace(/^-\s*/, '');
  
              // Check for links
              const linkMatch = activity.match(/(.+?)\[(.+?)\]\((.+?)\)/);
              
              if (linkMatch) {
                const [, mainText, linkText, linkUrl] = linkMatch;
                pdf.text(`• ${mainText.trim()}`, 20, yPosition);
                pdf.setTextColor(0, 0, 255);
                pdf.textWithLink(linkText, 20 + pdf.getTextWidth(`• ${mainText.trim()} `), yPosition, { url: linkUrl });
                pdf.setTextColor(0, 0, 0);
              } else {
                pdf.text(`• ${activity}`, 20, yPosition);
              }
              
              yPosition += 7;
            });
  
            yPosition += 5;
          });
  
          // Add page break if not the last section
          if (index < sections.length - 1) {
            pdf.addPage();
            yPosition = 30;
          }
        });
      };
  
      // Catch any parsing errors
      try {
        processText(text);
      } catch (error) {
        console.error('Parsing error:', error);
        pdf.text('Error parsing itinerary', 15, yPosition);
      }
    };
  
    // Generate PDF
    try {
      parseItinerary(popupContent);
      pdf.save('Advenzone_Itinerary.pdf');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please check console for details.');
    }
  };
  
  // const downloadPDF = () => {
  //   const pdf = new jsPDF();
    
  //   // PDF page setup
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const pageHeight = pdf.internal.pageSize.getHeight();
  //   const marginLeft = 15;
  //   const marginRight = 15;
  //   const maxWidth = pageWidth - marginLeft - marginRight;
  
  //   const parseItinerary = (text) => {
  //     // Reset PDF
  //     pdf.setFont('helvetica', 'normal');
  //     pdf.setFontSize(18);
  //     pdf.text('Travel Itinerary', pageWidth / 2, 15, { align: 'center' });
  
  //     // Reset font for body
  //     pdf.setFontSize(12);
      
  //     let yPosition = 30;
      
  //     // More robust text wrapping function
  //     const wrapText = (text, maxWidth) => {
  //       return pdf.splitTextToSize(text, maxWidth);
  //     };
  
  //     // Debugging: log full text
  //     console.log('Full PDF Content:', text);
  
  //     // Process entire text with more flexible parsing
  //     const processFullText = () => {
  //       // Wrap the entire text
  //       const wrappedFullText = wrapText(text, maxWidth);
        
  //       // Add entire text with proper wrapping
  //       wrappedFullText.forEach((line, index) => {
  //         // Adjust positioning to prevent overflow
  //         if (yPosition > pageHeight - 20) {
  //           pdf.addPage();
  //           yPosition = 30;
  //         }
          
  //         pdf.text(line, marginLeft, yPosition);
  //         yPosition += 7;
  //       });
  //     };
  
  //     // Fallback method to ensure all content is captured
  //     try {
  //       processFullText();
  //     } catch (error) {
  //       console.error('Text processing error:', error);
  //       pdf.text('Error processing full text', marginLeft, yPosition);
  //     }
  //   };
  
  //   // Generate PDF
  //   try {
  //     parseItinerary(popupContent);
  //     pdf.save('Advenzone_Itinerary.pdf');
  //   } catch (error) {
  //     console.error('PDF Generation Error:', error);
  //     alert('Failed to generate PDF. Please check console for details.');
  //   }
  // };


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
             <Itinerary rawData={popupContent} />
            </div>
            <button className="download-pdf" onClick={downloadPDF}>
              Download as PDF
            </button>
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
