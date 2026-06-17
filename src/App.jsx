import React, { useState, useEffect } from 'react';
import Waybar from './components/Waybar';
import Wofi from './components/Wofi';
import SwayNC from './components/SwayNC';
import WindowFrame from './components/WindowFrame';
import BackgroundCanvas from './components/BackgroundCanvas';

// Apps
import Kitty from './apps/Kitty';
import Neovim from './apps/Neovim';
import Firefox from './apps/Firefox';

const App = () => {
  // Desktop state
  const [currentWorkspace, setCurrentWorkspace] = useState(1);
  const [activeWindowId, setActiveWindowId] = useState('kitty');
  const [wofiOpen, setWofiOpen] = useState(false);
  const [swayncOpen, setSwayncOpen] = useState(false);
  
  // Audio & Accessibility State
  const [audioMuted, setAudioMuted] = useState(false);
  const [animationsSpeed, setAnimationsSpeed] = useState('normal'); // 'normal' | 'fast'
  const [neonMode, setNeonMode] = useState(true);

  // Desktop Notifications list
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      app: 'hyprland',
      title: 'Compositor Started',
      body: 'Hyprland v0.40.0 successfully loaded. Tap Super (Alt/Cmd) + D to open launcher.',
      time: 'Just now',
      type: 'system'
    },
    {
      id: 2,
      app: 'systemd',
      title: 'Welcome to Jonath\'s OS',
      body: 'Explore terminal configs, code folders, and projects inside Wayland.',
      time: 'Just now',
      type: 'info'
    }
  ]);

  // Window instances state
  const [windows, setWindows] = useState([
    {
      id: 'kitty',
      title: 'kitty (Terminal)',
      workspace: 1,
      isFloating: false,
      isOpen: true,
      x: 60,
      y: 60,
      w: 800,
      h: 500
    },
    {
      id: 'firefox',
      title: 'firefox (Projects)',
      workspace: 2,
      isFloating: false,
      isOpen: true,
      x: 100,
      y: 80,
      w: 900,
      h: 600
    },
    {
      id: 'neovim',
      title: 'neovim (Code)',
      workspace: 3,
      isFloating: false,
      isOpen: true,
      x: 140,
      y: 100,
      w: 850,
      h: 550
    }
  ]);

  // Play mechanical key click using Web Audio API
  const playClickSound = (isInputKey = false) => {
    if (audioMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Synthesize mechanical keyboard switch sound
      if (isInputKey) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140 + Math.random() * 40, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else {
        // Compositor action sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (err) {
      console.warn('Audio Context failed to initialize: ', err);
    }
  };

  // Dispatch Notification
  const addNotification = (app, title, type = 'info') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotif = {
      id: Date.now(),
      app,
      title: type.toUpperCase(),
      body: title,
      time: timeStr,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
    playClickSound(false);
  };

  // Workspace Actions
  const changeWorkspace = (num) => {
    setCurrentWorkspace(num);
    playClickSound(false);
  };

  // Window Compositions
  const openApp = (appId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === appId
          ? { ...w, isOpen: true, workspace: currentWorkspace }
          : w
      )
    );
    setActiveWindowId(appId);
    addNotification('compositor', `Launched ${appId} on workspace ${currentWorkspace}`);
  };

  const closeApp = (appId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === appId ? { ...w, isOpen: false } : w
      )
    );
    // Focus next open window in same workspace
    const remaining = windows.filter(w => w.id !== appId && w.isOpen && w.workspace === currentWorkspace);
    if (remaining.length > 0) {
      setActiveWindowId(remaining[0].id);
    } else {
      setActiveWindowId(null);
    }
    addNotification('compositor', `Closed ${appId}`);
  };

  const toggleFloat = (appId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === appId ? { ...w, isFloating: !w.isFloating } : w
      )
    );
    addNotification('compositor', `Toggled floating mode for ${appId}`);
  };

  const maximizeWindow = (appId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === appId
          ? { 
              ...w, 
              isFloating: true, 
              x: 40, 
              y: 40, 
              w: window.innerWidth - 80, 
              h: window.innerHeight - 150 
            }
          : w
      )
    );
    addNotification('compositor', `Maximized window ${appId}`);
  };

  const updateWindowPosition = (appId, newX, newY) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === appId ? { ...w, x: newX, y: newY } : w
      )
    );
  };

  // Handle global shortcuts (Super modifier simulated with Alt or Cmd/Meta)
  useEffect(() => {
    const handleGlobalShortcuts = (e) => {
      const isSuper = e.altKey || e.metaKey;

      // Type sound for general input keys when terminal or launcher is active
      if (!isSuper && e.key.length === 1) {
        playClickSound(true);
      }

      if (!isSuper) return;

      switch (e.key.toLowerCase()) {
        case 'enter':
          e.preventDefault();
          openApp('kitty');
          break;
        case 'q':
          e.preventDefault();
          if (activeWindowId) closeApp(activeWindowId);
          break;
        case 'v':
          e.preventDefault();
          if (activeWindowId) toggleFloat(activeWindowId);
          break;
        case 'd':
          e.preventDefault();
          setWofiOpen(prev => !prev);
          playClickSound(false);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          e.preventDefault();
          changeWorkspace(parseInt(e.key));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [activeWindowId, currentWorkspace, windows]);

  // Renderer helper for applications
  const renderAppContent = (appId) => {
    switch (appId) {
      case 'kitty':
        return <Kitty openApp={openApp} closeApp={closeApp} addNotification={addNotification} />;
      case 'neovim':
        return <Neovim />;
      case 'firefox':
        return <Firefox />;
      default:
        return null;
    }
  };

  // Filter windows active in workspace
  const getWorkspaceWindows = (wsNum) => {
    return windows.filter(w => w.isOpen && w.workspace === wsNum);
  };

  // Render Layouts for a Workspace
  const renderWorkspaceLayout = (wsNum) => {
    const wsWindows = getWorkspaceWindows(wsNum);
    const tiling = wsWindows.filter(w => !w.isFloating);
    const floating = wsWindows.filter(w => w.isFloating);

    return (
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          gap: 'var(--hypr-gaps-in)' 
        }}
      >
        {/* Render Tiling Layer */}
        {tiling.length > 0 && (
          <div 
            style={{ 
              display: 'flex', 
              flex: 1, 
              gap: 'var(--hypr-gaps-in)', 
              height: '100%', 
              width: '100%',
              transition: animationsSpeed === 'fast' ? 'all 0.15s ease' : 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {tiling.length === 1 && (
              <WindowFrame
                key={tiling[0].id}
                {...tiling[0]}
                isActive={activeWindowId === tiling[0].id}
                onFocus={() => setActiveWindowId(tiling[0].id)}
                onClose={closeApp}
                onToggleFloat={toggleFloat}
                onMaximize={maximizeWindow}
                updateWindowPosition={updateWindowPosition}
              >
                {renderAppContent(tiling[0].id)}
              </WindowFrame>
            )}

            {tiling.length === 2 && (
              <>
                <WindowFrame
                  key={tiling[0].id}
                  {...tiling[0]}
                  isActive={activeWindowId === tiling[0].id}
                  onFocus={() => setActiveWindowId(tiling[0].id)}
                  onClose={closeApp}
                  onToggleFloat={toggleFloat}
                  onMaximize={maximizeWindow}
                  updateWindowPosition={updateWindowPosition}
                >
                  {renderAppContent(tiling[0].id)}
                </WindowFrame>
                <WindowFrame
                  key={tiling[1].id}
                  {...tiling[1]}
                  isActive={activeWindowId === tiling[1].id}
                  onFocus={() => setActiveWindowId(tiling[1].id)}
                  onClose={closeApp}
                  onToggleFloat={toggleFloat}
                  onMaximize={maximizeWindow}
                  updateWindowPosition={updateWindowPosition}
                >
                  {renderAppContent(tiling[1].id)}
                </WindowFrame>
              </>
            )}

            {tiling.length >= 3 && (
              <>
                <div style={{ flex: 1, height: '100%' }}>
                  <WindowFrame
                    key={tiling[0].id}
                    {...tiling[0]}
                    isActive={activeWindowId === tiling[0].id}
                    onFocus={() => setActiveWindowId(tiling[0].id)}
                    onClose={closeApp}
                    onToggleFloat={toggleFloat}
                    onMaximize={maximizeWindow}
                    updateWindowPosition={updateWindowPosition}
                  >
                    {renderAppContent(tiling[0].id)}
                  </WindowFrame>
                </div>
                <div 
                  style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 'var(--hypr-gaps-in)', 
                    height: '100%' 
                  }}
                >
                  <WindowFrame
                    key={tiling[1].id}
                    {...tiling[1]}
                    isActive={activeWindowId === tiling[1].id}
                    onFocus={() => setActiveWindowId(tiling[1].id)}
                    onClose={closeApp}
                    onToggleFloat={toggleFloat}
                    onMaximize={maximizeWindow}
                    updateWindowPosition={updateWindowPosition}
                  >
                    {renderAppContent(tiling[1].id)}
                  </WindowFrame>
                  <WindowFrame
                    key={tiling[2].id}
                    {...tiling[2]}
                    isActive={activeWindowId === tiling[2].id}
                    onFocus={() => setActiveWindowId(tiling[2].id)}
                    onClose={closeApp}
                    onToggleFloat={toggleFloat}
                    onMaximize={maximizeWindow}
                    updateWindowPosition={updateWindowPosition}
                  >
                    {renderAppContent(tiling[2].id)}
                  </WindowFrame>
                </div>
              </>
            )}
          </div>
        )}

        {/* Render Floating Layer */}
        {floating.map((w) => (
          <WindowFrame
            key={w.id}
            {...w}
            isActive={activeWindowId === w.id}
            onFocus={() => setActiveWindowId(w.id)}
            onClose={closeApp}
            onToggleFloat={toggleFloat}
            onMaximize={maximizeWindow}
            updateWindowPosition={updateWindowPosition}
          >
            {renderAppContent(w.id)}
          </WindowFrame>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`compositor-root ${neonMode ? 'neon-enabled' : ''}`}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Desktop Wallpaper */}
      <div className="desktop-wallpaper" />

      {/* Shifting Aurora Blobs */}
      <div className="aurora-container">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
      </div>

      {/* Interactive Background Particles */}
      <BackgroundCanvas />

      {/* Top Status Bar (Waybar) */}
      <Waybar
        currentWorkspace={currentWorkspace}
        setWorkspace={changeWorkspace}
        windows={windows.filter(w => w.isOpen)}
        activeWindowId={activeWindowId}
        toggleSwayNC={() => {
          setSwayncOpen(!swayncOpen);
          playClickSound(false);
        }}
        toggleWofi={() => {
          setWofiOpen(!wofiOpen);
          playClickSound(false);
        }}
      />

      {/* Slide-out workspaces viewport wrapper */}
      <div 
        className="desktop-viewport"
        style={{
          transform: `translateX(-${(currentWorkspace - 1) * 100}vw)`,
          transition: animationsSpeed === 'fast' 
            ? 'transform 0.25s ease-in-out' 
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Workspaces 1 to 4 */}
        {[1, 2, 3, 4].map(num => (
          <div key={num} className="workspace-slide">
            {renderWorkspaceLayout(num)}
          </div>
        ))}
      </div>

      {/* Wofi App Launcher Modal */}
      <Wofi
        isOpen={wofiOpen}
        onClose={() => setWofiOpen(false)}
        onLaunch={openApp}
      />

      {/* SwayNC Notifications center */}
      <SwayNC
        isOpen={swayncOpen}
        onClose={() => setSwayncOpen(false)}
        notifications={notifications}
        clearNotifications={() => setNotifications([])}
        removeNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        addNotification={addNotification}
        audioMuted={audioMuted}
        toggleAudio={() => {
          setAudioMuted(!audioMuted);
          playClickSound(false);
        }}
        animationsSpeed={animationsSpeed}
        changeAnimationsSpeed={() => {
          setAnimationsSpeed(prev => prev === 'normal' ? 'fast' : 'normal');
          playClickSound(false);
        }}
        neonMode={neonMode}
        toggleNeonMode={() => {
          setNeonMode(!neonMode);
          playClickSound(false);
        }}
      />
    </div>
  );
};

export default App;
