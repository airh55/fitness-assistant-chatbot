import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content:
        'You are a helpful assistant for a fitness studio. ' +
        'Opening hours: Mon–Fri 6am–10pm, Sat–Sun 8am–8pm. ' +
        'Membership: $50/month or $500/year. ' +
        'Classes: Yoga at 8am, HIIT at 6pm, Pilates at 7pm daily.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: 'user', content: input }]);
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessages((msgs) => [...msgs, { role: 'assistant', content: data.text }]);
      setInput('');
    } else {
      alert(data.error || 'Error getting response');
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>💪 Fitness Assistant Chatbot</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: 10,
          height: 300,
          overflowY: 'auto',
          marginBottom: 10,
          borderRadius: 6,
          background: '#f9f9f9',
        }}
      >
        {messages
          .filter((m) => m.role !== 'system')
          .map((msg, i) => (
            <p
              key={i}
              style={{
                backgroundColor: msg.role === 'user' ? '#0084ff' : '#e5e5ea',
                color: msg.role === 'user' ? 'white' : 'black',
                textAlign: msg.role === 'user' ? 'right' : 'left',
                padding: '8px 12px',
                borderRadius: 20,
                maxWidth: '75%',
                marginLeft: msg.role === 'user' ? 'auto' : undefined,
                marginBottom: 6,
                whiteSpace: 'pre-wrap',
              }}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
            </p>
          ))}
      </div>

      <input
        type="text"
        placeholder="Ask about the fitness studio..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ padding: 10, width: '80%', marginRight: 8, borderRadius: 6, border: '1px solid #ccc' }}
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading} style={{ padding: '10px 20px', borderRadius: 6 }}>
        {loading ? 'Loading...' : 'Send'}
      </button>
    </main>
  );
}
