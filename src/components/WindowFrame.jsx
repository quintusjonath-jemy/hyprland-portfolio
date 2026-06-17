import React, { useRef } from 'react';
import { Minus, Square, X } from 'lucide-react';

const WindowFrame = ({
  id,
  title,
  isActive,
  isFloating,
  x,
  y,
  w,
  h,
  onFocus,
  onClose,
  onToggleFloat,
  onMaximize,
  updateWindowPosition,
  children
}) => {
  const windowRef = useRef(null);

  const handlePointerDown = (e) => {
    // Focus window first
    onFocus();

    if (!isFloating) return;

    // Only drag from header
    if (!e.target.closest('.window-header') || e.target.closest('.window-action-btn')) {
      return;
    }

    e.preventDefault();
    const rect = windowRef.current.getBoundingClientRect();
    const offsetLeft = e.clientX - rect.left;
    const offsetTop = e.clientY - rect.top;

    const handlePointerMove = (moveEvent) => {
      // Calculate new percentage positions relative to screen width/height
      const newX = moveEvent.clientX - offsetLeft;
      const newY = moveEvent.clientY - offsetTop;
      updateWindowPosition(id, newX, newY);
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const windowStyles = isFloating
    ? {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${h}px`,
      }
    : {
        flex: 1,
        height: '100%',
      };

  return (
    <div
      ref={windowRef}
      className={`hypr-window glass ${isActive ? 'active' : ''} ${isFloating ? 'floating-window' : ''}`}
      style={windowStyles}
      onClick={onFocus}
      onPointerDown={handlePointerDown}
    >
      {/* Window Header / Title Bar */}
      <div className="window-header">
        <div className="window-header-left">
          <span className="window-header-title">{title}</span>
        </div>

        <div className="window-header-actions">
          {/* Toggle Floating button */}
          <button
            className="window-action-btn window-action-float"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFloat(id);
            }}
            title={isFloating ? "Tile window" : "Float window (Super+V)"}
          />
          {/* Maximize Toggle button */}
          <button
            className="window-action-btn window-action-maximize"
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(id);
            }}
            title="Maximize window"
          />
          {/* Close button */}
          <button
            className="window-action-btn window-action-close"
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            title="Close window (Super+Q)"
          />
        </div>
      </div>

      {/* Window Content */}
      <div className="window-body">
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;
