import './AIFloatingButton.css';

function AIFloatingButton({ onClick }) {
  return (
    <button className="ai-floating-circle-btn" onClick={onClick} title="Open AI Tutor">
      🤖
    </button>
  );
}

export default AIFloatingButton;