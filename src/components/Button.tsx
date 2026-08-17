import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline';
  href?: string;
  icon?: React.ReactNode;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  href, 
  icon,
  ...props 
}: ButtonProps) {
  const baseClass = `btn btn-${variant} ${className}`.trim();
  
  const content = (
    <>
      {icon && <span style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {content}
      </Link>
    );
  }

  return (
    <button className={baseClass} {...props}>
      {content}
    </button>
  );
}
