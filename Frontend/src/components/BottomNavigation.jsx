import React from 'react';
import { Home, Heart, Settings, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Home', path: '/', icon: Home, key: 'home' },
  { label: 'Saved', path: '/saved', icon: Heart, key: 'saved' },
  { label: 'Add', path: '/add', icon: Plus, key: 'add' },
  { label: 'Settings', path: '/settings', icon: Settings, key: 'settings' },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const found = tabs.find(tab => tab.path === location.pathname);
    return found ? found.key : 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-10">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => navigate(tab.path)}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === tab.key ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <tab.icon size={24} />
          <span className="text-xs mt-1">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;