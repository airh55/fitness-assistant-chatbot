import { useState, useRef, useEffect } from "react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fefefe",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <img
          src="/assistant.png"
          alt="Fitness Assistant"
          style={{ width: 80, height: 80, borderRadius: "50%", marginRight: 20 }}
        />
        <h1 style={{ margin: 0, fontWeight: "bold", color: "#0070f3" }}>
          Fitness Assistant Chatbot
        </h1>
      </div>

      <div
        style={{
          height: 350,
          overflowY: "auto",
          padding: "10px 15px",
          border: "1px solid #ccc",
          borderRadius: 10,
          backgroundColor: "#fafafa",
          marginBottom: 15,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              margin: "10px 0",
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px 15px",
                borderRadius: 20,
                backgroundColor: m.role === "user" ? "#0070f3" : "#e2e8f0",
                color: m.role === "user" ? "white" : "#333",
                maxWidth: "75%",
                wordWrap: "break-word",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
          placeholder="Ask about the fitness studio..."
          style={{
            flexGrow: 1,
            padding: "12px 15px",
            fontSize: 16,
            borderRadius: 20,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "12px 20px",
            backgroundColor: "#0070f3",
            border: "none",
            borderRadius: 20,
            color: "white",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
