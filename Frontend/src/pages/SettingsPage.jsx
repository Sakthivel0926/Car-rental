import React, { useState, useEffect } from 'react';
import { LogOut, User, Mail, Phone, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = ({ onLogout }) => {

  
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [rawData, setRawData] = useState(null); // For debugging
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/user/me', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    if (onLogout) onLogout();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/me', {
          credentials: 'include',
        });
        if (!res.ok) {
          setFetchError('Not logged in or unable to fetch user.');
          setUser(null);
          setRawData(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        console.log(data);
        setRawData(data); // Save raw response for debugging
        const userData = data.user ? data.user : data;
        if (userData && userData.name && userData.email) {
          setUser(userData);
          setFetchError('');
        } else {
          setFetchError('User data incomplete or not found.');
          setUser(userData);
        }
      } catch (err) {
        setFetchError('Error fetching user data.');
        setUser(null);
        setRawData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <span className="text-red-500 mb-4">{fetchError || "User not found or not logged in."}</span>
        {/* Raw API response is hidden unless DEBUG is true */}
        {false && rawData && (
          <div className="bg-gray-100 text-xs text-gray-700 p-2 rounded max-w-xl overflow-x-auto">
            <b>Raw API response:</b>
            <pre>{JSON.stringify(rawData, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800">Profile</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <input
                  type="text"
                  value={user.name || ''}
                  onChange={e => setUser({ ...user, name: e.target.value })}
                  className="font-medium border border-gray-200 rounded px-2 py-1 w-48"
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <input
                  type="email"
                  value={user.email || ''}
                  className="font-medium border border-gray-200 rounded px-2 py-1 w-48 bg-gray-100"
                  disabled
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Phone size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <input
                  type="text"
                  value={user.phone || ''}
                  onChange={e => setUser({ ...user, phone: e.target.value })}
                  className="font-medium border border-gray-200 rounded px-2 py-1 w-48"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800">Preferences</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Globe size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Language</p>
                <select
                  value={user.language || language}
                  onChange={e => setUser({ ...user, language: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="tamil">Tamil</option>
                  <option value="telugu">Telugu</option>
                  <option value="kannada">Kannada</option>
                  <option value="malayalam">Malayalam</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={async () => {
            setLoading(true);
            setFetchError("");
            try {
              const res = await fetch('http://localhost:5000/api/user/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  name: user.name,
                  phone: user.phone,
                  language: user.language || language
                })
              });
              if (!res.ok) {
                const data = await res.json();
                setFetchError(data.error || 'Failed to update profile');
              } else {
                setFetchError('Profile updated!');
              }
            } catch (err) {
              setFetchError('Network error.');
            } finally {
              setLoading(false);
            }
          }}
          className="flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-3"
        >
          Save Changes
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;