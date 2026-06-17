import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Shield, Globe, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'Hyprland Portfolio',
    category: 'frontend',
    description: 'A premium web-based Wayland desktop compositor simulation built with React and custom CSS variables, illustrating workspace sliding and dynamic window tiling layout algorithms.',
    tags: ['React', 'CSS Variables', 'Tiling Engine'],
    github: 'https://github.com/quintusjonath-jemy/hyprland-portfolio',
    demo: 'https://jonath.dev/hyprland'
  },
  {
    title: 'CommitCraft',
    category: 'cli',
    description: 'A smart command-line helper tool that assists developers in writing clean, structured, and conventional commit messages following industry best practices.',
    tags: ['Go', 'Git', 'CLI', 'Developer Tools'],
    github: 'https://github.com/quintusjonath-jemy/CommitCraft.git',
    demo: null
  },
  {
    title: 'Face Detector',
    category: 'linux',
    description: 'A real-time face detection and tracking application utilizing computer vision models, OpenCV, and automated python camera feeds with bounding boxes.',
    tags: ['Python', 'OpenCV', 'Computer Vision', 'ML'],
    github: 'https://github.com/quintusjonath-jemy/Face_detector.git',
    demo: null
  },
  {
    title: 'LogShield',
    category: 'cli',
    description: 'A lightweight and robust log monitoring utility designed to analyze application security breaches, scan system syslog logs, and trigger administrator alerts.',
    tags: ['Rust', 'Security', 'Log Auditing', 'Systems'],
    github: 'https://github.com/quintusjonath-jemy/logshield.git',
    demo: null
  },
  {
    title: 'Retro Terminal Portfolio',
    category: 'frontend',
    description: 'A CRT scanline retro developer portfolio simulating shell terminal commands, running boot processes, and providing multiple display theme layers.',
    tags: ['React', 'CRT Shader', 'Custom Shell'],
    github: 'https://github.com/quintusjonath-jemy/terminal-portfolio',
    demo: 'http://localhost:5173'
  }
];

const Firefox = () => {
  const [filter, setFilter] = useState('all');
  const [currentUrl, setCurrentUrl] = useState('https://jonath.dev/projects');

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#1e1e2e',
      color: 'var(--text)',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Firefox Browser Bar */}
      <div style={{
        height: '40px',
        backgroundColor: '#11111b',
        borderBottom: '1px solid var(--surface0)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: '12px'
      }}>
        {/* Nav Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--overlay0)' }}>
          <ArrowLeft size={16} style={{ cursor: 'pointer' }} />
          <ArrowRight size={16} style={{ cursor: 'pointer' }} />
          <RotateCw size={14} style={{ cursor: 'pointer' }} />
        </div>

        {/* Address Bar */}
        <div style={{
          flex: 1,
          height: '26px',
          backgroundColor: '#181825',
          borderRadius: '6px',
          border: '1px solid var(--surface0)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          gap: '8px',
          fontSize: '12px'
        }}>
          <Shield size={12} style={{ color: 'var(--green)' }} />
          <span style={{ color: 'var(--overlay0)' }}>https://</span>
          <input 
            type="text" 
            value={currentUrl.replace('https://', '')} 
            onChange={(e) => setCurrentUrl('https://' + e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              width: '100%',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--overlay0)' }}>
          <Globe size={16} />
        </div>
      </div>

      {/* Webpage Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#1e1e2e',
        padding: '24px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--surface0)', paddingBottom: '16px' }}>
            <h1 style={{ fontSize: '28px', color: 'var(--text)', fontWeight: '700', marginBottom: '8px' }}>
              Project Portfolio
            </h1>
            <p style={{ color: 'var(--subtext0)', fontSize: '14px' }}>
              A collection of open-source components, configuration scripts, and frontend applications.
            </p>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {['all', 'frontend', 'linux', 'cli'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  background: filter === cat ? 'var(--mauve)' : 'var(--surface0)',
                  color: filter === cat ? '#11111b' : 'var(--text)',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {filteredProjects.map((p, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#181825',
                  border: '1px solid var(--surface0)',
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'border-color 0.25s, transform 0.25s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--mauve)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--surface0)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--mauve)', fontWeight: '600' }}>
                    {p.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a 
                      href={p.github} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: 'var(--subtext0)', hover: { color: 'var(--text)' } }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                    {p.demo && (
                      <a 
                        href={p.demo} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: 'var(--subtext0)', hover: { color: 'var(--text)' } }}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--subtext1)', lineHeight: '1.5', flex: 1 }}>
                  {p.description}
                </p>

                {/* Tech Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {p.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      style={{
                        backgroundColor: 'var(--surface0)',
                        color: 'var(--lavender)',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Firefox;
