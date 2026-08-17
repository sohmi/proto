'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { Send, Mic, Volume2, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function Assistant() {
  const t = useTranslations('Dashboard');
  const tCommon = useTranslations('Common');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Namaste! How can I help you today? / नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Speech Recognition (Web Speech API)
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + ' ' + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        alert('Voice input not supported in your browser');
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        }),
      });

      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', content: data.text }]);
      } else {
        throw new Error('No response');
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I am having trouble connecting right now. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 'var(--spacing-sm)', color: 'var(--color-primary)' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>{t('assistantTitle')}</h2>
      </div>

      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                color: msg.role === 'user' ? 'var(--color-text-inverse)' : 'var(--color-text-main)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '85%',
                position: 'relative'
              }}
            >
              <p style={{ margin: 0 }}>{msg.content}</p>
              {msg.role === 'model' && (
                <button 
                  onClick={() => speakText(msg.content)}
                  style={{ 
                    position: 'absolute', 
                    bottom: '-25px', 
                    right: '0', 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--color-primary)', 
                    cursor: 'pointer' 
                  }}
                  title="Read Aloud"
                >
                  <Volume2 size={16} />
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--color-primary)' }}>
              <Loader2 className="lucide-spin" size={24} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              type="button"
              onClick={toggleRecording}
              style={{
                background: isRecording ? 'var(--color-danger)' : 'var(--color-surface-hover)',
                color: isRecording ? 'white' : 'var(--color-text-main)',
                border: '1px solid var(--color-border)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <Mic size={24} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0 var(--spacing-md)',
                fontSize: '1rem',
                backgroundColor: 'var(--color-background)'
              }}
            />
            <Button type="submit" disabled={!input.trim() || loading} style={{ padding: '0 var(--spacing-md)', minHeight: '48px' }}>
              <Send size={20} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
