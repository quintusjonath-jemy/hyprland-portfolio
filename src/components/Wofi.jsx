import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, Globe, Code } from 'lucide-react';

const appItems = [
  {
    id: 'kitty',
    name: 'Kitty Terminal',
    desc: 'Simulate system console shell',
    icon: <Terminal size={18} style={{ color: 'var(--green)' }} />
  },
  {
    id: 'firefox',
    name: 'Firefox Browser',
    desc: 'Browse projects & websites',
    icon: <Globe size={18} style={{ color: 'var(--blue)' }} />
  },
  {
    id: 'neovim',
    name: 'Neovim Editor',
    desc: 'Explore development files',
    icon: <Code size={18} style={{ color: 'var(--mauve)' }} />
  }
];

const Wofi = ({ isOpen, onClose, onLaunch }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = appItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    // Keep selected index within bounds when filter changes
    if (selectedIndex >= filtered.length) {
      setSelectedIndex(Math.max(0, filtered.length - 1));
    }
  }, [query, filtered.length, selectedIndex]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      if (filtered[selectedIndex]) {
        onLaunch(filtered[selectedIndex].id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="wofi-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={containerRef}
        className="wofi-container glass"
        onKeyDown={handleKeyDown}
      >
        <div className="wofi-input-wrapper">
          <Search size={16} style={{ color: 'var(--mauve)' }} />
          <input
            ref={inputRef}
            type="text"
            className="wofi-input"
            placeholder="Search apps..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="wofi-list">
          {filtered.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: 'var(--overlay0)', fontSize: '12px' }}>
              No applications found
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = selectedIndex === index;
              return (
                <div
                  key={item.id}
                  className={`wofi-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onLaunch(item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {item.icon}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="wofi-item-name">{item.name}</span>
                  </div>
                  <span className="wofi-item-desc">{item.desc}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Wofi;
