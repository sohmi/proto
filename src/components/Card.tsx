import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, title, className = '', onClick }: CardProps) {
  const baseClass = `card ${onClick ? 'clickable-card' : ''} ${className}`.trim();
  
  return (
    <div 
      className={baseClass} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {title && <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{title}</h3>}
      {children}
    </div>
  );
}
