import React, { useEffect, useState, useRef } from "react";
import "./DonationCauseAssistant.css";
import { askGemini } from "../../../functions/ai";
import APIURL from "../../../functions/baseurl";
// Utility: Format currency
function formatCurrency(amount, currency = "USD") {
  return (
    currency +
    " " +
    Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Utility: Days left until end_date
function daysLeft(endDate) {
  if (!endDate) return null;
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff < 0 ? 0 : diff;
}

// Compose a context string for Gemini (all causes)
function causesToContext(causes) {
  if (!causes.length) return "No causes currently available.";
  return (
    "Here is all the current donation causes, in JSON array format:\n" +
    JSON.stringify(
      causes.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        short_description: c.short_description,
        image_url: c.image_url,
        goal_amount: c.goal_amount,
        raised_amount: c.raised_amount,
        currency: c.currency,
        category: c.category,
        start_date: c.start_date,
        end_date: c.end_date,
        is_featured: c.is_featured,
        is_active: c.is_active,
        status: c.status,
        created_by: c.created_by,
        created_at: c.created_at,
        updated_at: c.updated_at,
      })),
      null,
      2
    ) +
    "\n\n"
  );
}

// Main ChatBot
export default function DonationCauseChatBot() {
  const [open, setOpen] = useState(false);
  const [causes, setCauses] = useState([]);
  const [loadingCauses, setLoadingCauses] = useState(true);
  const apiUrl = APIURL + "/user/causes.php"; // Adjust to your API endpoint

  const [chat, setChat] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm your donation assistant. Ask me about any donation cause, or type 'urgent' to know which cause needs help most right now.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  // Fetch causes from backend
  async function fetchCauses() {
    setLoadingCauses(true);
    try {
      const res = await fetch(apiUrl, { credentials: "include" });
      let data = await res.json();
      if (typeof data === "string")
        data = JSON.parse(data.replace(/^\uFEFF/, ""));
      setCauses(Array.isArray(data.data) ? data.data : []);
    } catch {
      setCauses([]);
    }
    setLoadingCauses(false);
  }

  useEffect(() => {
    fetchCauses();
    const interval = setInterval(fetchCauses, 30_000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chat, open]);

  // Typing effect for assistant messages
  function typeMessage(text, cb) {
    setTyping(true);
    let i = 0;
    setError("");
    function typeNext() {
      setChat((prev) => {
        const last = { ...prev[prev.length - 1] };
        last.text = (last.text || "") + text[i];
        return [...prev.slice(0, -1), last];
      });
      i++;
      if (i < text.length) {
        setTimeout(typeNext, 17 + Math.random() * 30);
      } else {
        setTyping(false);
        if (cb) cb();
      }
    }
    // Start message blank, then type
    setChat((prev) => [...prev, { role: "assistant", text: "" }]);
    setTimeout(typeNext, 400);
  }

  // When user submits a question
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || typing || loadingCauses) return;
    setChat((prev) => [...prev, { role: "user", text: input.trim() }]);
    setInput("");
    // Compose context for Gemini
    const context =
      causesToContext(causes) +
      "User question: " +
      input.trim() +
      "\n\nRespond conversationally. If user asks about urgent cause, pick the most urgent cause using these rules: only is_active causes with status 'open', then featured ones first, then soonest end_date, then lowest percent raised. Otherwise answer normally, giving numbers and details as you can.";
    try {
      const aiResp = await askGemini(context);
      typeMessage(aiResp);
    } catch (err) {
      setError("Sorry, there was a problem contacting the AI.");
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I had trouble contacting the AI. Please try again.",
        },
      ]);
      setTyping(false);
    }
  };

  // Handle pressing Enter in input
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) handleSend(e);
  }

  // On open: for real-time, refresh causes
  useEffect(() => {
    if (open) fetchCauses();
  }, [open]);

  return (
    <>
      <button
        className="dccb-fixed-btn"
        aria-label="Open Donation Chatbot"
        onClick={() => setOpen(true)}
      >
        <span role="img" aria-label="AI Assistant">
          🤖
        </span>
        <span className="dccb-btn-text">Ask AI</span>
      </button>
      {open && (
        <div className="dccb-popup-overlay">
          <div className="dccb-popup">
            <div className="dccb-header">
              <span className="dccb-avatar" role="img" aria-label="AI">
                🤖
              </span>
              <span style={{ flex: 1 }}>Donation Assistant</span>
              <button
                className="dccb-popup-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="dccb-body">
              <div className="dccb-chat">
                {chat.map((msg, i) => (
                  <div key={i} className={`dccb-msg dccb-msg-${msg.role}`}>
                    <div className="dccb-msg-inner">
                      {msg.role === "assistant" && (
                        <span className="dccb-msg-avatar">🤖</span>
                      )}
                      <span className="dccb-msg-text">{msg.text}</span>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="dccb-msg dccb-msg-assistant">
                    <div className="dccb-msg-inner">
                      <span className="dccb-msg-avatar">🤖</span>
                      <span className="dccb-msg-text dccb-typing">
                        <span className="dccb-dot"></span>
                        <span className="dccb-dot"></span>
                        <span className="dccb-dot"></span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef}></div>
              </div>
              {error && <div className="dccb-error">{error}</div>}
            </div>
            <form className="dccb-form" onSubmit={handleSend}>
              <input
                className="dccb-input"
                type="text"
                placeholder={
                  loadingCauses
                    ? "Loading causes..."
                    : "Ask about a cause or type 'urgent'..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={typing || loadingCauses}
                autoFocus
              />
              <button
                className="dccb-send"
                type="submit"
                disabled={typing || !input.trim() || loadingCauses}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
