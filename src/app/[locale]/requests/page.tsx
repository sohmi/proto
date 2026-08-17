'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { FileText, Loader2, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../../store/appStore';

export default function Requests() {
  const t = useTranslations('Dashboard');
  const [docType, setDocType] = useState('income');
  const [applicantName, setApplicantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const user = useAppStore(state => state.user);

  // Mock past requests
  const pastRequests = [
    { id: 'REQ-001', type: 'Birth Certificate', status: 'Approved', date: '2023-10-01' },
    { id: 'REQ-002', type: 'Income Certificate', status: 'Pending', date: '2023-11-15' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Mock submit
      await new Promise(r => setTimeout(r, 1500));
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <CheckCircle2 size={64} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
        <h2>Request Submitted</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Your document request has been sent to the Panchayat.</p>
        <Button onClick={() => setSuccess(false)}>Apply for Another</Button>
        <div style={{ marginTop: '1rem' }}>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>{t('requestsTitle')}</h2>
      </div>

      <Card title="New Request / नया अनुरोध" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div>
            <label>Document Type / दस्तावेज़ का प्रकार</label>
            <select className="input-field" value={docType} onChange={e => setDocType(e.target.value)}>
              <option value="income">Income Certificate / आय प्रमाण पत्र</option>
              <option value="birth">Birth Certificate / जन्म प्रमाण पत्र</option>
              <option value="death">Death Certificate / मृत्यु प्रमाण पत्र</option>
              <option value="caste">Caste Certificate / जाति प्रमाण पत्र</option>
              <option value="residence">Residence Certificate / निवास प्रमाण पत्र</option>
            </select>
          </div>

          <div>
            <label>Applicant Full Name / आवेदक का पूरा नाम</label>
            <input 
              type="text" 
              className="input-field" 
              value={applicantName}
              onChange={e => setApplicantName(e.target.value)}
              required 
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="lucide-spin" /> : 'Submit Request / जमा करें'}
          </Button>
        </form>
      </Card>

      <h3>Past Requests / पिछले अनुरोध</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
        {pastRequests.map(req => (
          <Card key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-sm) var(--spacing-md)' }}>
            <div>
              <h4 style={{ margin: 0 }}>{req.type}</h4>
              <small style={{ color: 'var(--color-text-muted)' }}>{req.id} • {req.date}</small>
            </div>
            <div style={{ 
              color: req.status === 'Approved' ? 'var(--color-success)' : 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              {req.status === 'Approved' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              {req.status}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
