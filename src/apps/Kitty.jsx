import React, { useState, useEffect, useRef } from 'react';

const ARCH_ASCII = `
      /\\
     /  \\
    /\\   \\
   /  __  \\
  /  (  )  \\
 /  _    _  \\
/_ /      \\ _\\
`;

const Kitty = ({ openApp, closeApp, addNotification }) => {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to Kitty Terminal!' },
    { type: 'output', text: 'Type "help" to see available commands, or "neofetch" for system statistics.' }
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newHistory = [...history, { type: 'input', text: cmdStr }];

    switch (command) {
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      
      case 'help':
        newHistory.push({
          type: 'output',
          text: `Available commands:
  neofetch          - Display system information
  about             - Learn about who I am
  skills            - Display technical expertise
  projects          - List my latest projects
  contact           - Display contact info
  hyprctl           - Hyprland controller tool (e.g. "hyprctl dispatch exec <app>")
  clear             - Clear the terminal screen`
        });
        break;

      case 'neofetch':
        newHistory.push({
          type: 'neofetch',
          text: ''
        });
        break;

      case 'about':
        newHistory.push({
          type: 'output',
          text: `Hey, I'm Jonath! I'm a Front-End / Full-Stack Developer specializing in React, Wayland ecosystems, and designing highly optimized, eye-candy web interfaces. I love building sleek designs, tinkering with Arch Linux configurations, and engineering smooth desktop experiences.`
        });
        break;

      case 'skills':
        newHistory.push({
          type: 'output',
          text: `TECHNICAL EXPERTISE:
  ====================
  Languages:     JavaScript (ES6+), TypeScript, C++, Python, HTML5/CSS3
  Frameworks:    React.js, Next.js, Vue.js, Node.js, Express
  Styling:       Vanilla CSS (variables/grid), TailwindCSS, SCSS
  Tools/OS:      Arch Linux, Git, Docker, Neovim, Wayland/Hyprland, Webpack/Vite`
        });
        break;

      case 'projects':
        newHistory.push({
          type: 'output',
          text: `PROJECTS ARCHIVE:
  =================
  1. [CommitCraft]        - CLI helper for convention-driven git commit logs
     - Tech: Go, Git API
  2. [Face_detector]      - Real-time computer vision face tracking engine
     - Tech: Python, OpenCV, ML
  3. [logshield]          - Secure, lightweight syslog log monitoring scanner
     - Tech: Rust, Systems Security
  4. [hyprland-portfolio] - Web-based Wayland window manager simulation (Active)
     - Tech: React.js, Custom CSS Transitions`
        });
        break;

      case 'contact':
        newHistory.push({
          type: 'output',
          text: `CONTACT INFORMATION:
  ====================
  Email:    jonath@example.com
  GitHub:   github.com/jonath-dev
  LinkedIn: linkedin.com/in/jonath-dev
  Tip:      You can also use the SwayNC (Notification Drawer) on the top-right to send a direct message!`
        });
        break;

      case 'hyprctl':
        if (args.length === 0) {
          newHistory.push({
            type: 'output',
            text: `hyprctl - Hyprland Control Tool
Usage:
  hyprctl clients                  - List active windows
  hyprctl dispatch exec <app>      - Launch an application (firefox, neovim, kitty)`
          });
        } else if (args[0] === 'clients') {
          newHistory.push({
            type: 'output',
            text: `Window ID: 1 | Title: kitty (Terminal) | Workspace: 1 | Floating: false
Window ID: 2 | Title: firefox (Web Browser) | Workspace: 2 | Floating: false
Window ID: 3 | Title: neovim (Code Editor) | Workspace: 3 | Floating: false`
          });
        } else if (args[0] === 'dispatch' && args[1] === 'exec') {
          const appName = args[2]?.toLowerCase();
          if (appName === 'firefox' || appName === 'neovim' || appName === 'kitty') {
            openApp(appName);
            addNotification('Hyprland compositor', `Executing dispatch command: launch ${appName}`, 'system');
            newHistory.push({
              type: 'output',
              text: `hyprctl: dispatching execution call for ${appName}... Done.`
            });
          } else {
            newHistory.push({
              type: 'output',
              text: `hyprctl error: Unknown application "${args[2] || ''}". Supported: firefox, neovim, kitty`
            });
          }
        } else {
          newHistory.push({
            type: 'output',
            text: `hyprctl error: Unknown arguments: ${args.join(' ')}`
          });
        }
        break;

      default:
        newHistory.push({
          type: 'output',
          text: `kitty: command not found: ${command}. Type "help" for a list of available commands.`
        });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <div 
      className="kitty-terminal" 
      onClick={focusInput}
      style={{
        padding: '16px',
        color: 'var(--text)',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        lineHeight: '1.5',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#11111b',
        overflowY: 'auto'
      }}
    >
      <div style={{ flex: 1 }}>
        {history.map((item, index) => {
          if (item.type === 'input') {
            return (
              <div key={index} style={{ marginBottom: '4px' }}>
                <span style={{ color: 'var(--green)' }}>jonath@arch-hypr</span>
                <span style={{ color: 'var(--mauve)', margin: '0 8px' }}>~</span>
                <span>{item.text}</span>
              </div>
            );
          } else if (item.type === 'neofetch') {
            return (
              <div key={index} style={{ display: 'flex', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <pre style={{ color: 'var(--blue)', fontSize: '12px', fontWeight: 'bold', margin: 0 }}>
                  {ARCH_ASCII}
                </pre>
                <div>
                  <div style={{ color: 'var(--mauve)', fontWeight: 'bold', borderBottom: '1px solid var(--surface1)', paddingBottom: '2px', marginBottom: '6px' }}>
                    jonath@arch-hyprland
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px' }}>
                    <span style={{ color: 'var(--blue)' }}>OS:</span><span>Arch Linux x86_64</span>
                    <span style={{ color: 'var(--blue)' }}>Host:</span><span>Web Portfolio Simulator</span>
                    <span style={{ color: 'var(--blue)' }}>Kernel:</span><span>6.9.3-arch1-1-hypr</span>
                    <span style={{ color: 'var(--blue)' }}>Uptime:</span><span>Just booted</span>
                    <span style={{ color: 'var(--blue)' }}>Shell:</span><span>zsh 5.9</span>
                    <span style={{ color: 'var(--blue)' }}>WM:</span><span>Hyprland (Wayland)</span>
                    <span style={{ color: 'var(--blue)' }}>Theme:</span><span>Catppuccin Mocha</span>
                    <span style={{ color: 'var(--blue)' }}>Icons:</span><span>Papirus-Dark</span>
                    <span style={{ color: 'var(--blue)' }}>CPU:</span><span>Virtual Web Engine (8 cores)</span>
                    <span style={{ color: 'var(--blue)' }}>Memory:</span><span>1024 MB / 16384 MB (6%)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                    {['#11111b', '#f38ba8', '#a6e3a1', '#f9e2af', '#89b4fa', '#cba6f7', '#94e2d5', '#cdd6f4'].map((color, idx) => (
                      <div key={idx} style={{ width: '16px', height: '14px', backgroundColor: color, border: '1px solid rgba(255,255,255,0.05)' }} />
                    ))}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <pre key={index} style={{ whiteSpace: 'pre-wrap', marginBottom: '8px', color: 'var(--subtext1)', fontFamily: 'var(--font-mono)' }}>
                {item.text}
              </pre>
            );
          }
        })}
        <div ref={terminalEndRef} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', borderTop: '1px solid var(--surface0)', paddingTop: '12px' }}>
        <span style={{ color: 'var(--green)' }}>jonath@arch-hypr</span>
        <span style={{ color: 'var(--mauve)', margin: '0 8px' }}>~</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px'
          }}
          autoFocus
        />
      </div>
    </div>
  );
};

export default Kitty;
