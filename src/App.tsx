import { useState } from 'react';
import MapComponent from './components/Map';
import Dashboard from './components/Dashboard';
import './App.css';

function App(): React.ReactElement {
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);

  const toggleDashboard = () => {
    setIsDashboardVisible(!isDashboardVisible);
  };

  return (
    <div className="app">
      <MapComponent />
      <Dashboard 
        isVisible={isDashboardVisible} 
        onToggle={toggleDashboard} 
      />
    </div>
  );
}

export default App;
