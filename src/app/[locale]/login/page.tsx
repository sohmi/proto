'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase/client';
import { useAppStore } from '../../../../store/appStore';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import { Phone, KeyRound, Loader2 } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app with Supabase Auth configured:
      // const { error } = await supabase.auth.signInWithOtp({ phone });
      
      // Mocking for MVP if Supabase is not fully configured
      await new Promise(r => setTimeout(r, 1000));
      
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app:
      /*
      const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
      if (error) throw error;
      
      // Fetch profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user?.id).single();
      */

      // Mock login success
      await new Promise(r => setTimeout(r, 1000));
      const mockUser = {
        id: 'mock-123',
        phone,
        role: 'citizen' as const,
        full_name: 'Village User'
      };
      
      setUser(mockUser);
      router.push('/en/dashboard'); // default to english for mock routing, next-intl will handle prefix
      
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <Card title="Login / लॉग इन">
        {error && (
          <div style={{ color: 'var(--color-danger)', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp}>
            <label>Mobile Number / मोबाइल नंबर</label>
            <div style={{ position: 'relative' }}>
              <Phone size={20} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-muted)' }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10 digit number"
                className="input-field"
                style={{ paddingLeft: '40px' }}
                required
                pattern="[0-9]{10}"
              />
            </div>
            <Button type="submit" style={{ width: '100%' }} disabled={loading}>
              {loading ? <Loader2 className="lucide-spin" /> : 'Get OTP / ओटीपी प्राप्त करें'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <label>Enter OTP / ओटीपी दर्ज करें</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={20} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6 digit OTP"
                className="input-field"
                style={{ paddingLeft: '40px', letterSpacing: '4px', fontSize: '1.2rem' }}
                required
                maxLength={6}
              />
            </div>
            <Button type="submit" style={{ width: '100%' }} disabled={loading}>
              {loading ? <Loader2 className="lucide-spin" /> : 'Verify & Login / सत्यापित करें'}
            </Button>
            <button 
              type="button" 
              onClick={() => setStep('phone')}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', marginTop: '1rem', width: '100%', cursor: 'pointer' }}
            >
              Change Number / नंबर बदलें
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
