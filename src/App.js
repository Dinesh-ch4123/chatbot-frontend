import React, { useState, useEffect } from 'react';
import ChatBot from 'react-simple-chatbot';

function App() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = parseEndpointFromURL();
    fetchSteps(endpoint);
  }, []);

  const parseEndpointFromURL = () => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const endpoint = parts[parts.length - 1];
    return endpoint || 'Home';
  };

  const fetchSteps = async (endpoint) => { 
    try {
      const response = await fetch(`http://localhost:3000/web/${endpoint}`);
      if (!response.ok) {
        throw new Error('Failed to fetch steps');
      }
      const data = await response.json();
      setSteps(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching steps:', error);
      setLoading(false);
    }
  };

  const renderComponent = (html) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const parsedSteps = steps.map(step => {
    if (step.component) {
      step.component = renderComponent(step.component);
    }
    return step;
  });

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ChatBot steps={parsedSteps} />
      )}
    </div>
  );
}

export default App;
