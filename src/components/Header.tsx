'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Globe, WifiOff, LogOut } from 'lucide-react';

export default function Header() {
  const t = useTranslations('Common');
  const pathname = usePathname();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    setIsOffline(!navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const switchLocale = (newLocale: string) => {
    if (!pathname) return '/';
    const parts = pathname.split('/');
    if (parts.length > 1 && (parts[1] === 'en' || parts[1] === 'hi')) {
      parts[1] = newLocale;
      return parts.join('/');
    }
    return `/${newLocale}${pathname}`;
  };

  const currentLocale = pathname?.startsWith('/hi') ? 'hi' : 'en';

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: 'var(--spacing-md) 0',
      borderBottom: '1px solid var(--color-border)',
      marginBottom: 'var(--spacing-md)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-primary)' }}>
          <Link href={`/${currentLocale}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            AI Panchayat
          </Link>
        </h2>
        {isOffline && (
          <span style={{ color: 'var(--color-warning)', display: 'flex', alignItems: 'center' }} title="Offline">
            <WifiOff size={18} />
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link 
          href={switchLocale(currentLocale === 'en' ? 'hi' : 'en')}
          className="btn btn-outline"
          style={{ padding: '0.25rem 0.5rem', minHeight: 'auto', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}
        >
          <Globe size={16} style={{ marginRight: '0.25rem' }} />
          {currentLocale === 'en' ? 'हिन्दी' : 'EN'}
        </Link>
      </div>
    </header>
  );
}
