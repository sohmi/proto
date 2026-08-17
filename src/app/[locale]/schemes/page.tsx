'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import { Search, Loader2, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Schemes() {
  const t = useTranslations('Dashboard');
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [occupation, setOccupation] = useState('farmer');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock AI scheme matching delay
      await new Promise(r => setTimeout(r, 1500));
      
      // Mock results based on occupation
      const allSchemes = [
        { id: 1, title: 'PM Kisan Samman Nidhi', desc: '₹6000 per year for farmer families', for: 'farmer' },
        { id: 2, title: 'Kisan Credit Card', desc: 'Low interest loans for agriculture', for: 'farmer' },
        { id: 3, title: 'PM Awas Yojana', desc: 'Housing assistance for low income families', for: 'all' },
        { id: 4, title: 'Ayushman Bharat', desc: 'Health insurance cover of ₹5 lakhs', for: 'all' },
      ];

      const matched = allSchemes.filter(s => s.for === 'all' || s.for === occupation);
      setResults(matched);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>{t('schemesTitle')}</h2>
      </div>

      {!results ? (
        <Card title="Find Eligible Schemes / पात्र योजनाएं खोजें">
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div>
              <label>Age / आयु</label>
              <input type="number" className="input-field" value={age} onChange={e => setAge(e.target.value)} required />
            </div>
            
            <div>
              <label>Annual Income / वार्षिक आय (₹)</label>
              <input type="number" className="input-field" value={income} onChange={e => setIncome(e.target.value)} required />
            </div>

            <div>
              <label>Occupation / व्यवसाय</label>
              <select className="input-field" value={occupation} onChange={e => setOccupation(e.target.value)}>
                <option value="farmer">Farmer / किसान</option>
                <option value="student">Student / विद्यार्थी</option>
                <option value="laborer">Daily Wage Laborer / मजदूर</option>
                <option value="other">Other / अन्य</option>
              </select>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="lucide-spin" /> : 'Find Schemes / योजनाएं खोजें'}
            </Button>
          </form>
        </Card>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Matches Found ({results.length})</h3>
            <button onClick={() => setResults(null)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>Edit Details</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {results.map(scheme => (
              <Card key={scheme.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary)' }}>{scheme.title}</h3>
                    <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-muted)' }}>{scheme.desc}</p>
                  </div>
                  <CheckCircle2 color="var(--color-success)" />
                </div>
                <Button variant="outline" style={{ width: '100%' }}>Apply Now / अभी आवेदन करें</Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
