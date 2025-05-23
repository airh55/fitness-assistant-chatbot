import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are a helpful assistant for a fitness studio.
- Opening hours: Mon–Fri 6am–10pm, Sat–Sun 8am–8pm
- Membership: $50/month or $500/year
- Classes: Yoga at 8am, HIIT at 6pm, Pilates at 7pm daily
Answer clearly and politely.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });
    const data = await response.json();

    setMessages([...newMessages, { role: "assistant", content: data.answer }]);
    setInput("");
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Fitness Assistant Chatbot</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "8px 0" }}>
            <strong>{m.role === "user" ? "You" : "Assistant"}:</strong> {m.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        disabled={loading}
        placeholder="Ask about the fitness studio..."
        style={{ width: "100%", padding: 8, marginTop: 10 }}
      />
      <button onClick={sendMessage} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? "Loading..." : "Send"}
      </button>
    </div>
  );
}
