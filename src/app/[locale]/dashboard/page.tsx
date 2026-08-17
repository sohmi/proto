'use client';

import { useTranslations } from 'next-intl';
import { useAppStore } from '../../../../store/appStore';
import { useEffect, useState } from 'react';
import Card from '../../../../components/Card';
import { Bot, FileText, AlertTriangle, Search, Bell } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabase/client';

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const user = useAppStore(state => state.user);
  const cachedNotices = useAppStore(state => state.cachedNotices);
  const setCachedNotices = useAppStore(state => state.setCachedNotices);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';
  
  const [notices, setNotices] = useState(cachedNotices);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }

    const fetchNotices = async () => {
      try {
        if (!navigator.onLine) {
          setIsOffline(true);
          return;
        }
        setIsOffline(false);
        // Mock fetch for MVP if Supabase is not connected
        // const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false }).limit(5);
        const mockData = [
          { id: 1, title: locale === 'hi' ? 'ग्राम सभा बैठक' : 'Gram Sabha Meeting', content: locale === 'hi' ? 'कल सुबह 10 बजे पंचायत भवन में।' : 'Tomorrow at 10 AM at Panchayat Bhavan.', created_at: new Date().toISOString() }
        ];
        setNotices(mockData);
        setCachedNotices(mockData);
      } catch (err) {
        console.error("Failed to fetch notices", err);
      }
    };

    fetchNotices();
  }, [user, locale, router, setCachedNotices]);

  if (!user) return null;

  const services = [
    { title: t('assistantTitle'), desc: t('assistantDesc'), icon: <Bot size={32} color="var(--color-primary)" />, href: `/${locale}/assistant` },
    { title: t('requestsTitle'), desc: t('requestsDesc'), icon: <FileText size={32} color="var(--color-success)" />, href: `/${locale}/requests` },
    { title: t('grievancesTitle'), desc: t('grievancesDesc'), icon: <AlertTriangle size={32} color="var(--color-warning)" />, href: `/${locale}/grievances` },
    { title: t('schemesTitle'), desc: t('schemesDesc'), icon: <Search size={32} color="var(--color-accent)" />, href: `/${locale}/schemes` },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
        {t('greeting', { name: user.full_name || user.phone })}
      </h2>

      {isOffline && (
        <div style={{ backgroundColor: 'var(--color-warning)', color: 'white', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-md)' }}>
          {t('offlineNotice', { time: 'recently' })}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        {services.map(s => (
          <Card 
            key={s.title} 
            onClick={() => router.push(s.href)}
            className="service-card"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--spacing-sm)' }}>
              {s.icon}
              <h4 style={{ margin: 0 }}>{s.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>{s.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--spacing-md)' }}>
          <Bell size={20} /> {t('noticesTitle')}
        </h3>
        {notices.map((n: any) => (
          <Card key={n.id}>
            <h4 style={{ margin: '0 0 var(--spacing-xs) 0' }}>{n.title}</h4>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{n.content}</p>
            <small style={{ color: '#94a3b8', display: 'block', marginTop: 'var(--spacing-xs)' }}>
              {new Date(n.created_at).toLocaleDateString()}
            </small>
          </Card>
        ))}
        {notices.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No notices found.</p>}
      </div>

      <style jsx global>{`
        .service-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .service-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
