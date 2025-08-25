/**
 * Avatar Demo Page
 * Showcases different avatar services and styles
 */
import React, { useState } from 'react';
import { AvatarImage, SmartAvatar } from '../utils/enhancedAvatarService';
import BoringAvatar from '../utils/boringAvatarsService';
import { getAvailableStyles, getAvailablePalettes } from '../utils/boringAvatarsUtils';

const AvatarDemoPage = () => {
  const [selectedUser, setSelectedUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    id: 'user123'
  });
  
  const [selectedService, setSelectedService] = useState('boring');
  const [selectedStyle, setSelectedStyle] = useState('bauhaus');
  const [selectedPalette, setSelectedPalette] = useState('default');
  const [avatarSize, setAvatarSize] = useState(64);

  const demoUsers = [
    { name: 'Alice Johnson', email: 'alice@example.com', id: 'alice123' },
    { name: 'Bob Smith', email: 'bob@example.com', id: 'bob456' },
    { name: 'Carol Wilson', email: 'carol@example.com', id: 'carol789' },
    { name: 'David Brown', email: 'david@example.com', id: 'david012' },
    { name: 'Eva Martinez', email: 'eva@example.com', id: 'eva345' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Avatar Service Comparison
        </h1>
        
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User
              </label>
              <select
                value={selectedUser.id}
                onChange={(e) => {
                  const user = demoUsers.find(u => u.id === e.target.value) || demoUsers[0];
                  setSelectedUser(user);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {demoUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="boring">Boring Avatars (Local)</option>
                <option value="dicebear">DiceBear API</option>
                <option value="ui-avatars">UI Avatars API</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {getAvailableStyles().map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Palette
              </label>
              <select
                value={selectedPalette}
                onChange={(e) => setSelectedPalette(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {getAvailablePalettes().map(palette => (
                  <option key={palette} value={palette}>{palette}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: {avatarSize}px
              </label>
              <input
                type="range"
                min="32"
                max="128"
                value={avatarSize}
                onChange={(e) => setAvatarSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Current Configuration Demo */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
          <div className="flex items-center space-x-4">
            <AvatarImage
              user={selectedUser}
              service={selectedService}
              style={selectedStyle}
              size={avatarSize}
              palette={selectedPalette}
              className="shadow-lg"
            />
            <div>
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-gray-600">{selectedUser.email}</p>
              <p className="text-sm text-gray-500">
                Service: {selectedService} | Style: {selectedStyle} | Palette: {selectedPalette}
              </p>
            </div>
          </div>
        </div>

        {/* All Boring Avatar Styles */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Boring Avatars - All Styles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {getAvailableStyles().map(style => (
              <div key={style} className="text-center">
                <BoringAvatar
                  user={selectedUser}
                  style={style}
                  size={80}
                  palette={selectedPalette}
                  className="mx-auto mb-2 shadow-md"
                />
                <p className="text-sm font-medium capitalize">{style}</p>
              </div>
            ))}
          </div>
        </div>

        {/* All Color Palettes */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Color Palettes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {getAvailablePalettes().map(palette => (
              <div key={palette} className="text-center">
                <BoringAvatar
                  user={selectedUser}
                  style="bauhaus"
                  size={80}
                  palette={palette}
                  className="mx-auto mb-2 shadow-md"
                />
                <p className="text-sm font-medium capitalize">{palette}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Avatar Demo */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Smart Avatar (Auto-selects best service)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <SmartAvatar
                user={selectedUser}
                size={80}
                preferLocal={true}
                className="mx-auto mb-2 shadow-md"
              />
              <p className="text-sm">Prefer Local (Boring Avatars)</p>
            </div>
            <div className="text-center">
              <SmartAvatar
                user={selectedUser}
                size={80}
                preferLocal={false}
                className="mx-auto mb-2 shadow-md"
              />
              <p className="text-sm">Prefer External (DiceBear)</p>
            </div>
          </div>
        </div>

        {/* Multiple Users Demo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Multiple Users</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {demoUsers.map(user => (
              <div key={user.id} className="text-center">
                <AvatarImage
                  user={user}
                  service={selectedService}
                  style={selectedStyle}
                  size={64}
                  palette={selectedPalette}
                  className="mx-auto mb-2 shadow-md"
                />
                <p className="text-xs font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Performance Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-green-700">Boring Avatars (Recommended)</h3>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>✅ No external API calls</li>
                <li>✅ Instant loading</li>
                <li>✅ Consistent appearance</li>
                <li>✅ Customizable palettes</li>
                <li>✅ No rate limiting</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-700">DiceBear API</h3>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>⚠️ External API dependency</li>
                <li>⚠️ Network latency</li>
                <li>✅ Many style options</li>
                <li>⚠️ Rate limiting possible</li>
                <li>❌ Requires internet</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-red-700">UI Avatars</h3>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>⚠️ External API dependency</li>
                <li>⚠️ Limited customization</li>
                <li>✅ Simple to use</li>
                <li>⚠️ Basic styling</li>
                <li>❌ Requires internet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDemoPage;
