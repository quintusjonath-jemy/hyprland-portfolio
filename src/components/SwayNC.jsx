import React, { useState } from 'react';
import { Volume2, VolumeX, Zap, ShieldAlert, BellOff, X, Sun, Moon } from 'lucide-react';

const SwayNC = ({ 
  isOpen, 
  onClose, 
  notifications, 
  clearNotifications, 
  removeNotification, 
  addNotification,
  audioMuted,
  toggleAudio,
  animationsSpeed,
  changeAnimationsSpeed,
  neonMode,
  toggleNeonMode,
  darkTheme,
  toggleTheme,
  wallpaper,
  changeWallpaper
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addNotification('Contact Form', 'Please fill in all fields before sending.', 'error');
      return;
    }

    // Add success notification
    addNotification(
      'System Mailer',
      `Message from ${formData.name} sent successfully! I'll get back to you at ${formData.email}.`,
      'success'
    );
    
    // Clear form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className={`swaync-drawer glass ${isOpen ? 'open' : ''}`}>
      <div className="swaync-header">
        <span className="swaync-title">Control Center</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {notifications.length > 0 && (
            <button className="swaync-clear-btn" onClick={clearNotifications}>
              Clear All
            </button>
          )}
          <button 
            style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Quick Settings Toggles */}
      <div className="swaync-quicksettings">
        {/* Audio Toggle */}
        <button 
          className={`qs-btn ${!audioMuted ? 'active' : ''}`}
          onClick={toggleAudio}
        >
          {audioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{audioMuted ? 'Muted' : 'Audio On'}</span>
        </button>

        {/* Animations Toggle */}
        <button 
          className={`qs-btn ${animationsSpeed === 'fast' ? 'active' : ''}`}
          onClick={changeAnimationsSpeed}
        >
          <Zap size={16} />
          <span>{animationsSpeed === 'fast' ? 'Fast Physics' : 'Normal'}</span>
        </button>

        {/* Neon Glow Toggle */}
        <button 
          className={`qs-btn ${neonMode ? 'active' : ''}`}
          onClick={toggleNeonMode}
        >
          <ShieldAlert size={16} />
          <span>{neonMode ? 'Neon Mode' : 'Clean'}</span>
        </button>

        {/* Theme Toggle */}
        <button 
          className={`qs-btn ${!darkTheme ? 'active' : ''}`}
          onClick={toggleTheme}
          title={darkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkTheme ? <Moon size={16} /> : <Sun size={16} />}
          <span>{darkTheme ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="swaync-list">
        {notifications.length === 0 ? (
          <div className="swaync-empty">
            <BellOff size={32} />
            <span style={{ fontSize: '13px' }}>No notifications</span>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="notification-card">
              <button 
                className="notification-close"
                onClick={() => removeNotification(notif.id)}
              >
                <X size={10} />
              </button>
              <div className="notification-header">
                <span className="notification-app">{notif.app}</span>
                <span className="notification-time">{notif.time}</span>
              </div>
              <div className="notification-title">{notif.title}</div>
              <div className="notification-body">{notif.body}</div>
            </div>
          ))
        )}
      </div>

      {/* Wallpaper Selector */}
      <div style={{ padding: '12px 16px', background: 'var(--mantle)', borderTop: '1px solid var(--surface0)', borderBottom: '1px solid var(--surface0)' }}>
        <h4 style={{ fontSize: '12px', marginBottom: '8px', color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🖼️ Wallpaper: <span style={{ color: 'var(--text)', textTransform: 'none', fontWeight: 'normal' }}>{
            {
              aurora: 'Aurora Blobs',
              bg1: 'Tokyo Neon',
              bg2: 'Cyberpunk Alley',
              bg3: 'Sunset Grid',
              bg4: 'Synth Horizon',
              bg5: 'Midnight Rain',
              bg6: 'Sakura Dream',
              bg7: 'Retro Wave',
              bg8: 'Neon Shards',
              bg9: 'Pastel Fog',
              bg10: 'Cyber Grid',
              bg11: 'City Skyline',
              bg12: 'Digital Sunset',
              bg13: 'Cosmic Dust',
              bg14: 'Matrix Rain',
              bg15: 'Light Sakura',
              bg16: 'Deep Space'
            }[wallpaper] || wallpaper
          }</span>
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', 
          gap: '6px', 
          maxHeight: '130px', 
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          {[
            { id: 'aurora', label: 'Aurora' },
            { id: 'bg1', label: 'Neon' },
            { id: 'bg2', label: 'Alley' },
            { id: 'bg3', label: 'Sunset' },
            { id: 'bg4', label: 'Horizon' },
            { id: 'bg5', label: 'Rain' },
            { id: 'bg6', label: 'Sakura' },
            { id: 'bg7', label: 'Retro' },
            { id: 'bg8', label: 'Shards' },
            { id: 'bg9', label: 'Pastel' },
            { id: 'bg10', label: 'Cyber' },
            { id: 'bg11', label: 'Skyline' },
            { id: 'bg12', label: 'Digi-Sun' },
            { id: 'bg13', label: 'Cosmic' },
            { id: 'bg14', label: 'Matrix' },
            { id: 'bg15', label: 'Light' },
            { id: 'bg16', label: 'Space' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => changeWallpaper(item.id)}
              className={`qs-btn ${wallpaper === item.id ? 'active' : ''}`}
              style={{ padding: '6px 0', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* SwayNC Mail Form */}
      <div className="swaync-contact">
        <h4>📧 Quick Message Dispatcher</h4>
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            className="contact-input"
            placeholder="Name / Alias"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            className="contact-input"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <textarea
            className="contact-input contact-textarea"
            placeholder="Your message content..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <button type="submit" className="contact-submit">
            Send Message (dispatch)
          </button>
        </form>
      </div>
    </div>
  );
};

export default SwayNC;
