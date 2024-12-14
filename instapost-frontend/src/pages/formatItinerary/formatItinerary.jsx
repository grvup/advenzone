import React from 'react';

const formatItinerary = (rawData) => {
  // Parse links in text
  const parseLink = (text) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
    const match = text.match(linkRegex);
    return match 
      ? { 
          text: text.replace(linkRegex, '').trim(), 
          linkText: match[1], 
          linkUrl: match[2] 
        } 
      : { 
          text: text.trim(), 
          linkText: null, 
          linkUrl: null 
        };
  };

  // Split into days and process each day
  const days = rawData.split('Day')
    .filter(day => day.trim())
    .map(day => {
      // Split day content into title and sections
      const dayContent = day.split(/Morning:|Afternoon:|Evening:/).filter(item => item.trim());
      const dayTitle = dayContent[0].replace(':', '').trim();
      
      // Define time periods to look for
      const timePeriods = ['Morning', 'Afternoon', 'Evening'];
      
      // Process sections for each time period
      const sections = timePeriods.map(period => {
        const sectionRegex = new RegExp(`${period}:([\\s\\S]*?)(?=(Morning:|Afternoon:|Evening:|$))`);
        const sectionMatch = day.match(sectionRegex);
        
        if (sectionMatch) {
          const activities = sectionMatch[1]
            .split('-')
            .filter(item => item.trim())
            .map(activity => parseLink(activity));

          return {
            timePeriod: period,
            activities
          };
        }
        return null;
      }).filter(section => section !== null);

      return {
        dayTitle: `Day ${dayTitle}`,
        sections
      };
    });

  return days;
};

const Itinerary = ({ rawData }) => {
  const structuredData = formatItinerary(rawData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {structuredData.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">{day.dayTitle}</h2>
          {day.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">{section.timePeriod}</h3>
              <ul className="space-y-2">
                {section.activities.map((activity, activityIndex) => (
                  <li key={activityIndex} className="flex items-start">
                    <span className="text-gray-600">•</span>
                    <span className="ml-2">
                      {activity.linkText ? (
                        <>
                          {activity.text}{' '}
                          <a 
                            href={activity.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 underline"
                          >
                            {activity.linkText}
                          </a>
                        </>
                      ) : (
                        activity.text
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Itinerary;