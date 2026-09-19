"use client";

const menu = [
  { name: "Dashboard", icon: "⌂" },
  { name: "Clientes", icon: "♙" },
  { name: "Oportunidades", icon: "◆" },
  { name: "Orçamentos", icon: "▣" },
  { name: "Agenda", icon: "□" },
];

const tools = [
  { name: "Automação", icon: "↻" },
  { name: "Pós-venda", icon: "★" },
  { name: "Relatórios", icon: "▥" },
];

export default function Sidebar({ active, onChange }) {
  const renderItem = (item) => (
    <button
      key={item.name}
      className={`nav-item ${active === item.name ? "active" : ""}`}
      onClick={() => onChange(item.name)}
    >
      <span className="nav-icon">{item.icon}</span>
      <span>{item.name}</span>
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">W</div>

        <div className="logo-text">
          <strong>WKORA</strong>
          <span>FLOW</span>
        </div>
      </div>

      <div className="menu-title">PRINCIPAL</div>

      <nav className="nav">
        {menu.map(renderItem)}
      </nav>

      <div className="menu-title">FERRAMENTAS</div>

      <nav className="nav">
        {tools.map(renderItem)}
      </nav>

      <div className="menu-title">SISTEMA</div>

      <nav className="nav">
        {renderItem({
          name: "Configurações",
          icon: "⚙",
        })}
      </nav>
    </aside>
  );
}
