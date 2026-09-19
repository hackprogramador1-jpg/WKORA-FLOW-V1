"use client";

export default function Header() {
  return (
    <header className="header">
      <div className="header-title">
        <h1>WKORA FLOW</h1>
        <p>Central comercial da sua empresa</p>
      </div>

      <div className="header-actions">
        <button
          className="notification"
          aria-label="Notificações"
          onClick={() => alert("Você não possui novas notificações.")}
        >
          ♢
        </button>

        <div className="profile">
          <div className="profile-avatar">E</div>

          <div className="profile-info">
            <strong>Empresa</strong>
            <small>Administrador</small>
          </div>
        </div>
      </div>
    </header>
  );
}
