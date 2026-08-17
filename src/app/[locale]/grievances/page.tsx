'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import { Camera, MapPin, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../../../store/appStore';
import { supabase } from '../../../../lib/supabase/client';

export default function Grievances() {
  const t = useTranslations('Dashboard');
  const [category, setCategory] = useState('water');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const user = useAppStore(state => state.user);

  const handleCaptureLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => alert('Location access denied or failed.')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let photo_url = null;

      // Real Supabase Flow
      /*
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('grievance_photos').upload(fileName, file);
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage.from('grievance_photos').getPublicUrl(fileName);
        photo_url = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from('grievances').insert({
        user_id: user.id,
        category,
        description: desc,
        photo_url,
        location
      });

      if (error) throw error;
      */

      // Mock submit
      await new Promise(r => setTimeout(r, 1500));
      
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <CheckCircle2 size={64} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
        <h2>Submitted Successfully</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Your grievance has been filed with the Panchayat.</p>
        <Button onClick={() => router.back()}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>{t('grievancesTitle')}</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div>
            <label>Category / श्रेणी</label>
            <select 
              className="input-field" 
              value={category} 
              onChange={e => setCategory(e.target.value)}
            >
              <option value="water">Water / पानी</option>
              <option value="roads">Roads / सड़कें</option>
              <option value="electricity">Electricity / बिजली</option>
              <option value="sanitation">Sanitation / स्वच्छता</option>
              <option value="other">Other / अन्य</option>
            </select>
          </div>

          <div>
            <label>Description / विवरण</label>
            <textarea 
              className="input-field" 
              rows={4}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="What is the issue? / समस्या क्या है?"
              required
            />
          </div>

          <div>
            <label>Photo / फोटो (Optional)</label>
            <label 
              style={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                padding: 'var(--spacing-md)',
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                backgroundColor: 'var(--color-surface-hover)'
              }}
            >
              <Camera size={24} color="var(--color-primary)" />
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                {file ? file.name : 'Take Photo / फोटो लें'}
              </span>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                style={{ display: 'none' }}
                onChange={e => e.target.files && setFile(e.target.files[0])}
              />
            </label>
          </div>

          <div>
            <label>Location / स्थान (Optional)</label>
            <Button 
              type="button" 
              variant="outline" 
              icon={<MapPin size={20} />}
              onClick={handleCaptureLocation}
              style={{ width: '100%' }}
            >
              {location ? 'Location Captured ✓' : 'Tag Current Location / स्थान टैग करें'}
            </Button>
          </div>

          <Button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? <Loader2 className="lucide-spin" /> : 'Submit Grievance / जमा करें'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
