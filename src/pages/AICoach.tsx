// src/pages/AICoach.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are FitAI Coach, an expert AI fitness and nutrition coach. You help users with:
- Personalized workout plans and exercise advice
- Nutrition guidance and meal planning
- Weight loss, muscle gain, and body recomposition
- Recovery, sleep, and lifestyle optimization
- Motivation and fitness mindset

Keep responses concise, practical, and encouraging. Use bullet points for lists. Be specific with numbers (sets, reps, calories) when relevant. Always prioritize safety — recommend consulting a doctor for medical concerns.`;

const SUGGESTIONS = [
  { emoji: '💪', text: 'Create a 4-day workout split for muscle gain' },
  { emoji: '🍽️', text: 'What should I eat post-workout?' },
  { emoji: '🔥', text: 'How do I lose belly fat effectively?' },
  { emoji: '😴', text: 'How does sleep affect muscle growth?' },
  { emoji: '📊', text: 'How many calories should I eat to lose 1kg/week?' },
  { emoji: '🧘', text: 'Best stretches for muscle recovery?' },
];

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 1024,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Request failed');
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Something went wrong. Please try again.',
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => setMessages([]);

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} style={{ margin: '8px 0 4px', fontWeight: 700, color: 'var(--accent)' }}>{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <div key={i} style={{ display: 'flex', gap: '8px', margin: '3px 0', paddingLeft: '4px' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }}>•</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <div key={i} style={{ display: 'flex', gap: '8px', margin: '3px 0', paddingLeft: '4px' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{line.split('.')[0]}.</span>
            <span>{line.split('.').slice(1).join('.').trim()}</span>
          </div>
        );
      }
      if (line.trim() === '') return <div key={i} style={{ height: '6px' }} />;
      return <p key={i} style={{ margin: '3px 0', lineHeight: 1.6 }}>{line}</p>;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '40px', letterSpacing: '0.04em', color: 'var(--text)' }}>
            AI <span style={{ color: 'var(--accent)' }}>Coach</span>
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
            Your personal Groq-powered fitness expert
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px',
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--muted)',
              fontSize: '13px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            <RotateCcw size={14} /> Clear chat
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '28px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}>
                  <Sparkles size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <h2 style={{ margin: '0 0 8px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: 'var(--text)', letterSpacing: '0.04em' }}>
                  Ask Me Anything
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                  Workouts · Nutrition · Recovery · Mindset
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', maxWidth: '580px' }}>
                {SUGGESTIONS.map(({ emoji, text }) => (
                  <button
                    key={text}
                    onClick={() => sendMessage(text)}
                    style={{
                      padding: '12px 16px', background: 'var(--surface3)',
                      border: '1px solid var(--border)', borderRadius: '12px',
                      color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'DM Sans, sans-serif',
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      transition: 'all 0.15s', lineHeight: 1.4,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,241,53,0.3)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(200,241,53,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'var(--surface3)'; }}
                  >
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{emoji}</span>
                    <span>{text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'user' ? 'var(--accent)' : 'rgba(200,241,53,0.1)',
                border: msg.role === 'assistant' ? '1px solid rgba(200,241,53,0.2)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {msg.role === 'user' ? <User size={15} style={{ color: '#111' }} /> : <Bot size={15} style={{ color: 'var(--accent)' }} />}
              </div>
              <div style={{
                maxWidth: '72%', padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface3)',
                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                color: msg.role === 'user' ? '#111' : 'var(--text)',
                fontSize: '14px', lineHeight: 1.6,
              }}>
                {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Bot size={15} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ padding: '14px 18px', background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', animation: 'bounce 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s`, opacity: 0.7 }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything..."
            disabled={loading}
            style={{
              flex: 1, padding: '12px 16px', background: 'var(--surface3)',
              border: '1px solid var(--border)', borderRadius: '12px',
              color: 'var(--text)', fontSize: '14px', outline: 'none',
              fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.6 : 1,
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(200,241,53,0.4)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: input.trim() && !loading ? 'var(--accent)' : 'var(--surface3)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s', flexShrink: 0,
            }}
          >
            <Send size={16} style={{ color: input.trim() && !loading ? '#111' : 'var(--muted)' }} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}