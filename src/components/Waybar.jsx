import React, { useState, useEffect } from 'react';
import { Terminal, Code, Cpu, HardDrive, Battery, Calendar, Bell, Menu } from 'lucide-react';

const Waybar = ({ 
  currentWorkspace, 
  setWorkspace, 
  windows, 
  activeWindowId, 
  toggleSwayNC, 
  toggleWofi 
}) => {
  const [timeStr, setTimeStr] = useState('');

  // Clock tick
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const isMobile = window.innerWidth <= 768;
      setTimeStr(
        d.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          ...(isMobile ? {} : { second: '2-digit' })
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine which workspaces have windows in them
  const occupiedWorkspaces = Array.from(
    new Set(windows.map(w => w.workspace))
  );

  // Find active window title
  const activeWindow = windows.find(w => w.id === activeWindowId);
  const activeTitle = activeWindow ? activeWindow.title : 'desktop';

  return (
    <div className="waybar-container glass">
      {/* Left Module: Workspaces and Wofi Trigger */}
      <div className="waybar-left">
        <div 
          onClick={toggleWofi}
          style={{
            cursor: 'pointer',
            color: 'var(--mauve)',
            display: 'flex',
            alignItems: 'center',
            paddingRight: '6px'
          }}
          title="Super+D: Open Application Launcher"
        >
          <Menu size={16} />
        </div>

        <div className="waybar-module waybar-workspaces">
          {[1, 2, 3, 4].map((num) => {
            const isActive = currentWorkspace === num;
            const isOccupied = occupiedWorkspaces.includes(num);
            return (
              <div
                key={num}
                onClick={() => setWorkspace(num)}
                className={`workspace-dot ${isActive ? 'active' : ''} ${isOccupied ? 'occupied' : ''}`}
                title={`Workspace ${num}`}
              >
                {num}
              </div>
            );
          })}
        </div>

        <div className="waybar-module waybar-title-module" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          <Terminal size={12} style={{ color: 'var(--teal)' }} />
          <span style={{ color: 'var(--subtext0)' }}>hyprland:</span>
          <span style={{ color: 'var(--lavender)' }}>{activeTitle}</span>
        </div>
      </div>

      {/* Center Module: Active App Status or Welcome */}
      <div className="waybar-center">
        <div className="waybar-module" style={{ fontWeight: '600', letterSpacing: '0.5px' }}>
          <Code size={13} style={{ color: 'var(--mauve)' }} />
          <span>Jonath's OS</span>
        </div>
      </div>

      {/* Right Module: System Modules & Info */}
      <div className="waybar-right">
        {/* CPU Module (representing frontend skill) */}
        <div className="waybar-module" title="React / Frontend Skill Level: 92%">
          <Cpu size={12} style={{ color: 'var(--blue)' }} />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>CPU: 92%</span>
        </div>

        {/* RAM Module (representing backend/linux skill) */}
        <div className="waybar-module" title="Node / Linux Skill Level: 85%">
          <HardDrive size={12} style={{ color: 'var(--green)' }} />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>RAM: 85%</span>
        </div>

        {/* Battery Module */}
        <div className="waybar-module" title="Energy & Motivation: 100%">
          <Battery size={12} style={{ color: 'var(--yellow)' }} />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>100%</span>
        </div>

        {/* Date/Time Module */}
        <div className="waybar-module">
          <Calendar size={12} style={{ color: 'var(--pink)' }} />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{timeStr}</span>
        </div>

        {/* Notification bell */}
        <div 
          className="waybar-module" 
          onClick={toggleSwayNC}
          style={{ cursor: 'pointer', padding: '3px 8px' }}
          title="Open Notification Drawer"
        >
          <Bell size={12} style={{ color: 'var(--mauve)' }} />
        </div>
      </div>
    </div>
  );
};

export default Waybar;
