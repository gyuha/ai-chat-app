import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="app-shell">
      <section className="auth-shell">
        <div className="auth-card">
          <p className="eyebrow">OpenRouter Free Chat</p>
          <h1>로그인이 필요합니다</h1>
          <p className="auth-copy">
            이메일과 비밀번호로 로그인하면 채팅을 시작할 수 있습니다.
          </p>
          <div className="auth-actions">
            <button type="button" className="primary-action">
              로그인하기
            </button>
            <button type="button" className="secondary-action">
              회원가입
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
