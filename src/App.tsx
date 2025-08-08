import { useState, useEffect } from 'react';
import MapComponent from './components/Map';
import Dashboard from './components/Dashboard';
import Prompt from './components/Prompt';
import './App.css';

function App(): React.ReactElement {
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const [isPromptVisible, setIsPromptVisible] = useState(true); // Show by default

  const toggleDashboard = () => {
    setIsDashboardVisible(!isDashboardVisible);
  };

  const closePrompt = () => {
    setIsPromptVisible(false);
  };

  // Listen for dashboard toggle events from map
  useEffect(() => {
    const handleDashboardToggle = () => {
      toggleDashboard();
    };

    window.addEventListener('dashboardToggle', handleDashboardToggle);
    
    return () => {
      window.removeEventListener('dashboardToggle', handleDashboardToggle);
    };
  }, [isDashboardVisible]);

  // Notify map of dashboard state changes
  useEffect(() => {
    const event = new CustomEvent('dashboardStateChange', { 
      detail: { isVisible: isDashboardVisible } 
    });
    window.dispatchEvent(event);
  }, [isDashboardVisible]);

  return (
    <div className="app">
      {/* Desktop Layout: Side-by-side divs */}
      <div className="hidden min-[640px]:flex w-full h-full">
        {/* Dashboard Section */}
        <div className={`transition-all duration-300 ${isDashboardVisible ? 'w-80' : 'w-0'} overflow-hidden`}>
          <Dashboard 
            isVisible={isDashboardVisible} 
            onToggle={toggleDashboard}
            isMobile={false}
          />
        </div>
        
        {/* Map Section */}
        <div className="flex-1 relative">
          <MapComponent />
        </div>
      </div>

      {/* Mobile Layout: Overlay */}
      <div className="block min-[640px]:hidden w-full h-full relative">
        <MapComponent />
        <Dashboard 
          isVisible={isDashboardVisible} 
          onToggle={toggleDashboard}
          isMobile={true}
        />
      </div>

      {/* Prompt Popup */}
      <Prompt 
        isVisible={isPromptVisible}
        onClose={closePrompt}
      />
    </div>
  );
}

export default App;
