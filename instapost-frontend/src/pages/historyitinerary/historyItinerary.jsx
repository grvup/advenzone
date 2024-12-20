import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Sun, LandPlot, TreePalm, GlassWater, MountainIcon, 
  Home, SunDim, Ship, LucidePartyPopper, BikeIcon, 
  TreeDeciduous, Map 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
const ItineraryDay = ({ day, title, activities, backgroundImage, selectedActivities, onActivityChange }) => {
    const getIconForActivity = (activity) => {
      const iconMap = {
        'Beach': <TreePalm className="text-blue-500" />,
        'Water Sports': <GlassWater className="text-blue-600" />,
        'Trekking': <MountainIcon className="text-green-600" />,
        'Camping': <Home className="text-orange-500" />,
        'Sunset': <SunDim className="text-orange-600" />,
        'Cruise': <Ship className="text-blue-700" />,
        'Temple': <LucidePartyPopper className="text-amber-600" />,
        'Bike': <BikeIcon className="text-gray-600" />,
        'Nature': <TreeDeciduous className="text-green-700" />
      };
  
      for (const key in iconMap) {
        if (activity.toLowerCase().includes(key.toLowerCase())) {
          return iconMap[key];
        }
      }
      return <Map className="text-gray-500" />;
    };
  
    return (
      <div 
        className="relative bg-cover bg-center rounded-lg overflow-hidden shadow-lg mb-6 text-white"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'black'
        }}
      >
        <div className="p-6 relative z-10">
          <div className="flex items-center mb-4">
            <Sun className="mr-3 text-yellow-300" />
            <h2 className="text-2xl font-bold">Day {day}: {title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {['morning', 'afternoon', 'evening'].map((timeOfDay) => (
              <div key={timeOfDay}>
                <h3 className="font-semibold text-lg mb-2 text-gray-200 capitalize">
                  {timeOfDay}
                </h3>
                <ul className="space-y-2">
                  {activities[timeOfDay].map((activity, index) => (
                    <li key={index} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 form-checkbox text-blue-500" 
                        id={`${day}-${timeOfDay}-${index}`}
                        checked={selectedActivities[day]?.includes(activity.name) || false}
                        onChange={() => onActivityChange(day, activity.name)}
                      />
                      {getIconForActivity(activity.name)}
                      <label 
                        htmlFor={`${day}-${timeOfDay}-${index}`}
                        className="ml-2 flex-1 cursor-pointer"
                      >
                        {activity.link ? (
                          <a 
                            href={activity.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-300 hover:text-blue-200"
                          >
                            {activity.name}
                          </a>
                        ) : (
                          activity.name
                        )}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

const HistoryItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleActivityChange = (day, activityName) => {
    setSelectedActivities(prev => {
      const updated = { ...prev };
      
      if (!updated[day]) {
        updated[day] = [];
      }
      
      if (updated[day].includes(activityName)) {
        updated[day] = updated[day].filter(name => name !== activityName);
      } else {
        updated[day] = [...updated[day], activityName];
      }
      
      return updated;
    });
  };

  const downloadPDF = (itineraryData) => {
    try {
      const doc = new jsPDF();
      let yOffset = 20;
      const lineHeight = 10;
      const margin = 10;
      const textColor = '#000000';
      const linkColor = '#0000ff';

      // Title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textColor);
      doc.text('Selected Activities Itinerary', margin, yOffset);
      yOffset += lineHeight * 2;

      itineraryData.forEach((day) => {
        const daySelectedActivities = selectedActivities[day.day];
        if (!daySelectedActivities || daySelectedActivities.length === 0) return;

        // Day header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textColor);
        doc.text(`Day ${day.day}: ${day.title}`, margin, yOffset);
        yOffset += lineHeight;

        ['morning', 'afternoon', 'evening'].forEach((timeOfDay) => {
          const activities = day.activities[timeOfDay];
          if (!activities || activities.length === 0) return;

          const selectedForTime = activities.filter(activity =>
            daySelectedActivities.includes(activity.name)
          );

          if (selectedForTime.length > 0) {
            // Time of day header
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(textColor);
            doc.text(timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1), margin + 5, yOffset);
            yOffset += lineHeight;

            // Activities
            doc.setFont('helvetica', 'normal');
            selectedForTime.forEach((activity) => {
              if (yOffset > 270) {
                doc.addPage();
                yOffset = 20;
              }

              // Activity name and link
              doc.setTextColor(textColor);
              doc.text(`• ${activity.name}`, margin + 10, yOffset);
              yOffset += lineHeight;

              if (activity.link) {
                doc.setTextColor(linkColor);
                doc.textWithLink('View Details', margin + 15, yOffset, { url: activity.link });
                yOffset += lineHeight;
              }
            });

            yOffset += lineHeight / 2;
          }
        });

        yOffset += lineHeight;
      });

      doc.save('Selected_Itinerary.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/historyitinerary');
      const fetchedItineraries = response.data.itineraries;
  
      // Set the itineraries state
      setItineraries(fetchedItineraries);
      console.log(itineraries)
      // Select the first itinerary by default if available
      if (fetchedItineraries.length > 0) {
        setSelectedItinerary(fetchedItineraries[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const handleItineraryClick = (itinerary) => {
    setSelectedItinerary(itinerary);
  };

  const safeJSONParse = (str) => {
    try {
      const jsonMatch = str.match(/```json\s*([\s\S]*?)\s*```/);
      if (!jsonMatch) {
        throw new Error('No JSON code block found');
      }
      const jsonContent = jsonMatch[1].trim();
      const cleanedJson = jsonContent
        .replace(/,(\s*[}\]])/g, '$1')
        .replace(/([{,]\s*)([\w-]+)\s*:/g, '$1"$2":')
        .replace(/'([^']*?)'/g, '"$1"')
        .replace(/\s+/g, ' ')
        .replace(/:\s+/g, ':')
        .replace(/\s*([{}\[\]])\s*/g, '$1');
      return JSON.parse(cleanedJson);
    } catch (error) {
      try {
        return JSON.parse(str);
      } catch {
        console.error('Parsing error:', error.message);
        return null;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left Section: Questions */}
      <div className="w-1/3 bg-gray-50 p-4 overflow-y-auto border-r border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Previous Queries</h2>
        <div className="space-y-3">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className={`cursor-pointer p-4 rounded-lg transition-all duration-200 ${
                selectedItinerary?.id === itinerary.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-white border border-gray-100 hover:border-blue-100 hover:bg-blue-50'
              }`}
              onClick={() => handleItineraryClick(itinerary)}
            >
              <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                {itinerary.query}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(itinerary.created_at)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section: Itinerary Display */}
      <div className="w-2/3 bg-gradient-to-br from-blue-50 to-blue-100 p-4 overflow-y-auto scrollbar-hide">
        {selectedItinerary ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 flex items-center justify-center">
              <LandPlot className="mr-4 text-blue-600" />
              Travel Itinerary
            </h1>
            {(() => {
              const itineraryData = safeJSONParse(selectedItinerary.output);
              if (itineraryData && Array.isArray(itineraryData)) {
                return (
                    <>
                      {itineraryData.map((day) => (
                        <ItineraryDay
                          key={day.day}
                          day={day.day}
                          title={day.title}
                          activities={day.activities}
                          backgroundImage={day.backgroundImage}
                          selectedActivities={selectedActivities}
                          onActivityChange={handleActivityChange}
                        />
                      ))}
                      <button 
                        onClick={() => downloadPDF(itineraryData)}
                        className=" bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Download Selected Activities
                      </button>
                    </>
                  );
              } else {
                return (
                  <div className="bg-white p-4 rounded-lg shadow">
                    <pre className="whitespace-pre-wrap">{selectedItinerary.output}</pre>
                  </div>
                );
              }
            })()}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            Select a query from the left to view its details
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryItinerary;