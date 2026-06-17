import React, { useState } from 'react';
import { Volume2, VolumeX, Zap, ShieldAlert, BellOff, X } from 'lucide-react';

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
  toggleNeonMode
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
