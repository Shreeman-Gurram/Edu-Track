import { useState, useRef, useEffect } from 'react';
import './AIChatModal.css';

function AIChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      isStructured: false,
      text: "Hello! I'm your adaptive AI tutor. Ask me any question for a clean explanation. (Add 'flowchart' if you want a vertical diagram!)" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  // Helper function to safely split diagram text into clean steps
  const parseDiagramSteps = (diagramText) => {
    if (!diagramText || diagramText === 'N/A') return [];
    
    const textStr = typeof diagramText === 'string' 
      ? diagramText 
      : Array.isArray(diagramText) 
        ? diagramText.join(' -> ') 
        : JSON.stringify(diagramText);

    return textStr
      .split(/-->|->|\||\n|⬇/g)
      .map(s => s.trim())
      .filter(s => s.length > 0 && s !== 'v' && s !== '⬇');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', isStructured: false, text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: userMessage, 
          grade: "10" 
        }),
      });
      
      const resData = await response.json();
      const rawData = resData.data || resData.reply || resData;

      if (typeof rawData === 'object' && rawData !== null && !Array.isArray(rawData)) {
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          isStructured: true, 
          data: rawData,
          userQuery: userMessage.toLowerCase() 
        }]);
      } else {
        const textReply = typeof rawData === 'string' ? rawData : (rawData.answer || JSON.stringify(rawData));
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          isStructured: false, 
          text: textReply 
        }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        isStructured: false, 
        text: "Network connection error. Please make sure your backend server is running." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chatbot-fullscreen">
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <span className="ai-status-dot"></span>
          <h2>Adaptive AI Tutor</h2>
        </div>
        <button className="ai-close-btn" onClick={onClose}>&times; Close</button>
      </div>

      <div className="ai-chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`ai-chat-message ${msg.sender}`}>
            {msg.sender === 'ai' && msg.isStructured ? (
              <div className="ai-bubble structured-bubble">
                {msg.data.question && <div className="ai-section"><strong>Q:</strong> {msg.data.question}</div>}
                {msg.data.answer && <div className="ai-section"><strong>Explanation:</strong> {msg.data.answer}</div>}
                
                {/* Show Perfectly Aligned Vertical Flowchart only if valid steps exist */}
                {msg.data.visualDiagram && 
                 msg.data.visualDiagram !== 'N/A' && 
                 !String(msg.data.visualDiagram).includes('temporary network issue') &&
                 (msg.userQuery?.includes('flowchart') || msg.userQuery?.includes('diagram') || msg.userQuery?.includes('chart') || msg.userQuery?.includes('visual')) && 
                 parseDiagramSteps(msg.data.visualDiagram).length > 0 && (
                  <div className="ai-section ai-diagram">
                    <strong>📊 Vertical Flowchart:</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', gap: '6px' }}>
                      {parseDiagramSteps(msg.data.visualDiagram).map((step, sIdx, arr) => (
                        <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                          <div style={{ 
                            background: '#ffffff', 
                            border: '1px solid #cbd5e1', 
                            padding: '10px 16px', 
                            borderRadius: '8px', 
                            width: '85%', 
                            textAlign: 'center', 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1e293b'
                          }}>
                            {step}
                          </div>
                          {sIdx < arr.length - 1 && (
                            <div style={{ fontSize: '18px', color: '#3b82f6', margin: '4px 0', fontWeight: 'bold' }}>
                              ↓
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Show Example ONLY if requested */}
                {msg.data.example && 
                 msg.data.example !== 'N/A' && 
                 msg.userQuery?.includes('example') && (
                  <div className="ai-section ai-example">
                    <strong>💡 Example:</strong> {msg.data.example}
                  </div>
                )}
                
                {/* Show Pro Tip ONLY if requested */}
                {msg.data.tip && 
                 msg.data.tip !== 'N/A' && 
                 (msg.userQuery?.includes('tip') || msg.userQuery?.includes('hint')) && (
                  <div className="ai-section ai-tip">
                    <strong>📌 Pro Tip:</strong> {msg.data.tip}
                  </div>
                )}
              </div>
            ) : (
              <div className="ai-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="ai-chat-message ai">
            <div className="ai-bubble typing">AI Tutor is thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chat-footer" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Ask a question (add 'flowchart' for a vertical diagram)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}

export default AIChatModal;