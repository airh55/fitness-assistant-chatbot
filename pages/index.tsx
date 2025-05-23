import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatLog([...chatLog, `You: ${prompt}`, `Assistant: ${data.text}`]);
        setPrompt('');
      } else {
        setError(data.error || 'Error from API');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>Fitness Assistant Chatbot</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: 12,
          height: 300,
          overflowY: 'auto',
          marginBottom: 12,
          backgroundColor: '#f9f9f9',
          borderRadius: 8,
        }}
      >
        {chatLog.map((line, idx) => (
          <p key={idx} style={{ margin: '8px 0' }}>
            {line}
          </p>
        ))}
        {loading && <p>Assistant is typing...</p>}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          placeholder="Ask about the fitness studio..."
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          style={{ width: '80%', padding: '8px', fontSize: 16, borderRadius: 4 }}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          style={{ padding: '8px 16px', marginLeft: 8, fontSize: 16 }}
        >
          Send
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}
