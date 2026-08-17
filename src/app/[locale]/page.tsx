import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Index() {
  const t = useTranslations('Index');

  return (
    <main style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>{t('title')}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        {t('subtitle')}
      </p>

      <div className="card">
        <label>{t('selectLanguage')}</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/en/login" className="btn btn-outline" style={{ display: 'block' }}>
            {t('english')}
          </Link>
          <Link href="/hi/login" className="btn btn-outline" style={{ display: 'block' }}>
            {t('hindi')}
          </Link>
        </div>
      </div>
    </main>
  );
}
