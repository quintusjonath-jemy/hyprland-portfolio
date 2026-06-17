import React, { useState } from 'react';
import { FileCode, Folder, FolderOpen, ChevronDown, ChevronRight, FileJson, FileType } from 'lucide-react';

const mockFiles = {
  'profile.json': {
    name: 'profile.json',
    icon: <FileJson size={16} className="text-yellow" style={{ color: 'var(--yellow)' }} />,
    type: 'json',
    content: `{
  "name": "Jonath",
  "title": "Front-End Developer & UI Architect",
  "specialization": "Dynamic Web Experiences & Linux Ricing",
  "philosophy": "Interfaces should not just function, they should flow.",
  "stack": {
    "frontend": ["React", "TypeScript", "Vite", "Framer Motion"],
    "styling": ["CSS Grid/Variables", "TailwindCSS", "Glassmorphism"],
    "systems": ["Arch Linux", "Wayland/Hyprland", "Bash/Zsh", "Docker"]
  },
  "passions": [
    "Customizing window managers (rices)",
    "Neovim config optimization",
    "High-refresh rate animations",
    "Open-source software contributing"
  ]
}`
  },
  'hyprland.conf': {
    name: 'hyprland.conf',
    icon: <FileType size={16} className="text-mauve" style={{ color: 'var(--mauve)' }} />,
    type: 'conf',
    content: `# Hyprland Window Manager Config
# Path: ~/.config/hypr/hyprland.conf

# Monitors
monitor = , preferred, auto, 1

# Input Settings
input {
    kb_layout = us
    follow_mouse = 1
    sensitivity = -0.5
    touchpad {
        natural_scroll = true
        tap-to-click = true
    }
}

# General Layout
general {
    gaps_in = 8
    gaps_out = 12
    border_size = 2
    col.active_border = rgba(cba6f7ee) rgba(89b4faee) 45deg
    col.inactive_border = rgba(313244aa)
    layout = dwindle
}

# Animations (Physic-based curves)
animations {
    enabled = true
    bezier = myBezier, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 7, myBezier
    animation = workspaces, 1, 6, default, slide
    animation = fade, 1, 7, default
}

# Custom Keybinds
bind = SUPER, RETURN, exec, kitty
bind = SUPER, Q, killactive,
bind = SUPER, V, togglefloating,
bind = SUPER, D, exec, wofi --show drun
`
  },
  'waybar.css': {
    name: 'waybar.css',
    icon: <FileCode size={16} className="text-blue" style={{ color: 'var(--blue)' }} />,
    type: 'css',
    content: `/* Waybar Glassmorphic Config Styles */
/* Path: ~/.config/waybar/style.css */

#waybar {
    background-color: rgba(30, 30, 46, 0.75);
    border-bottom: 2px solid rgba(203, 166, 247, 0.5);
    color: #cdd6f4;
    font-family: "JetBrains Mono", sans-serif;
    font-size: 13px;
    transition: all 0.3s;
}

#workspaces button {
    padding: 0 10px;
    color: #bac2de;
    background: transparent;
    border-radius: 4px;
    margin: 3px 2px;
}

#workspaces button.active {
    color: #11111b;
    background-color: #cba6f7;
    box-shadow: 0 0 10px rgba(203, 166, 247, 0.4);
}

#clock, #battery, #cpu, #memory, #tray {
    padding: 0 12px;
    margin: 4px 6px;
    background: rgba(17, 17, 27, 0.5);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}
`
  }
};

const Neovim = () => {
  const [activeFile, setActiveFile] = useState('profile.json');
  const [explorerOpen, setExplorerOpen] = useState(true);

  // Helper function to color code blocks based on file type
  const renderCode = (content, type) => {
    const lines = content.split('\n');
    return (
      <div style={{ padding: '0 8px 16px 8px', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.6' }}>
        {lines.map((line, index) => {
          // Syntax highlight rule logic (very basic but provides coloring)
          let coloredLine = <span>{line}</span>;
          
          if (type === 'json') {
            // Highlight keys and strings
            if (line.includes('"')) {
              const parts = line.split(/(".*?")/);
              coloredLine = (
                <span>
                  {parts.map((part, pIdx) => {
                    if (part.startsWith('"') && part.endsWith('"')) {
                      // If it's a key (followed by colon) or value
                      const isKey = line.indexOf(part) < line.indexOf(':');
                      return (
                        <span key={pIdx} style={{ color: isKey ? 'var(--lavender)' : 'var(--green)' }}>
                          {part}
                        </span>
                      );
                    }
                    if (part === ':') return <span key={pIdx} style={{ color: 'var(--mauve)' }}>:</span>;
                    return <span key={pIdx}>{part}</span>;
                  })}
                </span>
              );
            }
          } else if (type === 'conf') {
            if (line.trim().startsWith('#')) {
              coloredLine = <span style={{ color: 'var(--overlay0)', fontStyle: 'italic' }}>{line}</span>;
            } else if (line.includes('=')) {
              const [key, ...rest] = line.split('=');
              const value = rest.join('=');
              coloredLine = (
                <span>
                  <span style={{ color: 'var(--blue)' }}>{key}</span>
                  <span style={{ color: 'var(--mauve)' }}>=</span>
                  <span style={{ color: 'var(--peach)' }}>{value}</span>
                </span>
              );
            }
          } else if (type === 'css') {
            if (line.trim().startsWith('/*')) {
              coloredLine = <span style={{ color: 'var(--overlay0)', fontStyle: 'italic' }}>{line}</span>;
            } else if (line.includes(':') && !line.startsWith('/*')) {
              const [prop, val] = line.split(':');
              coloredLine = (
                <span>
                  <span style={{ color: 'var(--teal)' }}>{prop}</span>
                  <span style={{ color: 'var(--mauve)' }}>:</span>
                  <span style={{ color: 'var(--pink)' }}>{val}</span>
                </span>
              );
            } else if (line.includes('{') || line.includes('}')) {
              coloredLine = <span style={{ color: 'var(--yellow)' }}>{line}</span>;
            }
          }

          return (
            <div key={index} style={{ display: 'flex' }}>
              <span style={{
                width: '32px',
                textAlign: 'right',
                paddingRight: '12px',
                color: 'var(--surface2)',
                userSelect: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px'
              }}>
                {index + 1}
              </span>
              <pre style={{ margin: 0, overflowX: 'auto', flex: 1, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
                {coloredLine}
              </pre>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      backgroundColor: 'var(--base)',
      color: 'var(--text)',
      fontFamily: 'var(--font-mono)'
    }}>
      {/* File Tree Sidebar (NvimTree) */}
      {explorerOpen && (
        <div style={{
          width: '200px',
          borderRight: '1px solid var(--crust)',
          backgroundColor: 'var(--mantle)',
          fontSize: '12px',
          padding: '12px 6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            textTransform: 'uppercase',
            color: 'var(--overlay0)',
            fontWeight: 'bold',
            paddingLeft: '6px',
            fontSize: '10px',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Neo-Tree</span>
            <span style={{ color: 'var(--mauve)', fontSize: '9px' }}>[N]</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px', color: 'var(--lavender)' }}>
              <FolderOpen size={14} />
              <span style={{ fontWeight: '500' }}>config/</span>
            </div>

            <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {Object.keys(mockFiles).map((filename) => {
                const isSelected = activeFile === filename;
                return (
                  <div
                    key={filename}
                    onClick={() => setActiveFile(filename)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--surface0)' : 'transparent',
                      color: isSelected ? 'var(--text)' : 'var(--subtext0)'
                    }}
                  >
                    {mockFiles[filename].icon}
                    <span>{filename}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--base)',
        overflow: 'hidden'
      }}>
        {/* Editor Buffer Line (Tab Bar) */}
        <div style={{
          height: '32px',
          backgroundColor: 'var(--mantle)',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--crust)',
          paddingLeft: '4px'
        }}>
          {/* File explorer toggle */}
          <div 
            onClick={() => setExplorerOpen(!explorerOpen)}
            style={{
              padding: '0 10px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: explorerOpen ? 'var(--mauve)' : 'var(--overlay0)',
              borderRight: '1px solid var(--crust)',
              fontSize: '11px'
            }}
          >
            NvimTree
          </div>

          {Object.keys(mockFiles).map((filename) => {
            const isSelected = activeFile === filename;
            return (
              <div
                key={filename}
                onClick={() => setActiveFile(filename)}
                style={{
                  padding: '0 12px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  backgroundColor: isSelected ? 'var(--base)' : 'transparent',
                  borderRight: '1px solid var(--crust)',
                  color: isSelected ? 'var(--text)' : 'var(--overlay0)',
                  borderTop: isSelected ? '2px solid var(--mauve)' : 'none'
                }}
              >
                {mockFiles[filename].icon}
                <span>{filename}</span>
              </div>
            );
          })}
        </div>

        {/* Code Editor Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 0'
        }}>
          {renderCode(mockFiles[activeFile].content, mockFiles[activeFile].type)}
        </div>

        {/* Neovim Status Line (Lualine style) */}
        <div style={{
          height: '22px',
          backgroundColor: 'var(--crust)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          padding: '0 8px',
          borderTop: '1px solid var(--crust)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              backgroundColor: 'var(--mauve)',
              color: 'var(--crust)',
              padding: '0 8px',
              fontWeight: 'bold',
              borderRadius: '2px'
            }}>
              NORMAL
            </span>
            <span style={{ color: 'var(--teal)' }}>
               main
            </span>
            <span style={{ color: 'var(--overlay0)' }}>|</span>
            <span style={{ color: 'var(--subtext1)' }}>
              {activeFile}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--yellow)' }}>utf-8</span>
            <span style={{ color: 'var(--overlay0)' }}>|</span>
            <span style={{ color: 'var(--lavender)' }}>
              {mockFiles[activeFile].type.toUpperCase()}
            </span>
            <span style={{
              backgroundColor: 'var(--surface0)',
              color: 'var(--text)',
              padding: '0 8px',
              fontFamily: 'var(--font-mono)'
            }}>
              100%  1/32
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Neovim;
