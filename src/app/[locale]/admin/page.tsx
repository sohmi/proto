'use client';

import { useState } from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { Users, FileText, AlertTriangle, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'requests' | 'grievances' | 'broadcast'>('requests');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const mockRequests = [
    { id: 'REQ-001', name: 'Ramesh Kumar', type: 'Income Certificate', status: 'Pending' },
    { id: 'REQ-002', name: 'Sita Devi', type: 'Birth Certificate', status: 'Approved' },
  ];

  const mockGrievances = [
    { id: 'GRV-101', name: 'Mohan Lal', category: 'Water', desc: 'No water supply in Ward 4 for 2 days.', status: 'Open' },
  ];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Notice broadcasted to all citizens successfully!');
    setBroadcastTitle('');
    setBroadcastMsg('');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <ShieldAlert size={28} color="var(--color-primary)" style={{ marginRight: '0.5rem' }} />
        <h2 style={{ margin: 0 }}>Panchayat Admin</h2>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <Button 
          variant={activeTab === 'requests' ? 'primary' : 'outline'} 
          onClick={() => setActiveTab('requests')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <FileText size={18} style={{ marginRight: '0.5rem' }} /> Requests
        </Button>
        <Button 
          variant={activeTab === 'grievances' ? 'primary' : 'outline'} 
          onClick={() => setActiveTab('grievances')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <AlertTriangle size={18} style={{ marginRight: '0.5rem' }} /> Grievances
        </Button>
        <Button 
          variant={activeTab === 'broadcast' ? 'primary' : 'outline'} 
          onClick={() => setActiveTab('broadcast')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Send size={18} style={{ marginRight: '0.5rem' }} /> Broadcast Notice
        </Button>
      </div>

      {activeTab === 'requests' && (
        <div>
          <h3>Pending Document Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {mockRequests.map(req => (
              <Card key={req.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{req.name}</h4>
                    <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{req.type} • {req.id}</p>
                  </div>
                  {req.status === 'Pending' ? (
                    <Button variant="accent">Approve</Button>
                  ) : (
                    <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={18} /> {req.status}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'grievances' && (
        <div>
          <h3>Citizen Grievances</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {mockGrievances.map(grv => (
              <Card key={grv.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ 
                      backgroundColor: 'var(--color-warning)', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {grv.category}
                    </span>
                    <h4 style={{ margin: '0.5rem 0 0.25rem 0' }}>{grv.name}</h4>
                    <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-muted)' }}>{grv.desc}</p>
                  </div>
                  <Button variant="outline">Resolve</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'broadcast' && (
        <Card title="Broadcast Notice to Village">
          <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div>
              <label>Notice Title</label>
              <input 
                type="text" 
                className="input-field" 
                value={broadcastTitle} 
                onChange={e => setBroadcastTitle(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label>Message Content</label>
              <textarea 
                className="input-field" 
                rows={4} 
                value={broadcastMsg} 
                onChange={e => setBroadcastMsg(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" icon={<Send size={18} />}>Send to all users</Button>
          </form>
        </Card>
      )}
    </div>
  );
}
