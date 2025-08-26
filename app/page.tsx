'use client';

import { useState } from 'react';

type Turn = { user: string; bot: string };

export default function ChatPage() {
  const [history, setHistory] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, userMessage: input }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setHistory([...history, { user: input, bot: data.botReply }]);
      setInput('');
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
    setLoading(false);
  }

  function handleReset() {
    setHistory([]);
    setInput('');
    setError('');
  }

  return (
    <main className="chat-container">
      <h1>Exaone 4.0 멀티턴 챗봇</h1>
      <div className="chat-box">
        {history.length === 0 && <div className="empty">대화를 시작해보세요.</div>}
        {history.map((turn, idx) => (
          <div key={idx} className="turn">
            <div className="user-msg"><b>나:</b> {turn.user}</div>
            <div className="bot-msg"><b>Exaone:</b> {turn.bot}</div>
          </div>
        ))}
        {loading && <div className="loading">답변 생성 중...</div>}
        {error && <div className="error">{error}</div>}
      </div>
      <form onSubmit={sendMessage} className="input-form">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          disabled={loading}
          autoFocus
        />
        <button type="submit" disabled={loading || !input.trim()}>전송</button>
        <button type="button" onClick={handleReset} disabled={loading}>초기화</button>
      </form>
      <style jsx>{`
        .chat-container { max-width: 600px; margin: 40px auto; padding: 2rem; }
        .chat-box { min-height: 300px; background: #fafafa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #eee;}
        .turn { margin-bottom: 1.2em; }
        .user-msg { color: #222; }
        .bot-msg { color: #3a5af7; }
        .loading { color: #666; }
        .empty { color: #bbb; text-align: center; margin: 2em 0; }
        .error { color: red; margin: 1em 0;}
        .input-form { display: flex; gap: 0.5em;}
        input { flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;}
        button { padding: 0.5rem 1rem; }
      `}</style>
    </main>
  );
}