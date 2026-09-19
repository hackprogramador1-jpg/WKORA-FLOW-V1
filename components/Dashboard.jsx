"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const opportunities = [
  {
    initials: "JS",
    name: "João Silva",
    service: "Criação de website",
    value: "R$ 900,00",
  },
  {
    initials: "MA",
    name: "Mariana Alves",
    service: "Aplicativo empresarial",
    value: "R$ 2.000,00",
  },
  {
    initials: "RC",
    name: "Rafael Costa",
    service: "Marketing digital",
    value: "R$ 650,00",
  },
  {
    initials: "LP",
    name: "Lucas Pereira",
    service: "Site profissional",
    value: "R$ 1.200,00",
  },
];

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="wkora-app">
      <Sidebar active={active} onChange={setActive} />

      <main className="main">
        <Header />

        <section className="content">
          <div className="welcome">
            <h2>Olá, seja bem-vindo 👋</h2>
            <p>
              Acompanhe seus clientes, oportunidades e vendas em um só lugar.
            </p>
          </div>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">CLIENTES</span>
                <span className="stat-icon">◉</span>
              </div>

              <div className="stat-value">127</div>

              <div className="stat-footer">
                <span className="positive">+12%</span> este mês
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">OPORTUNIDADES</span>
                <span className="stat-icon">◆</span>
              </div>

              <div className="stat-value">38</div>

              <div className="stat-footer">
                <span className="positive">+8</span> esta semana
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">VENDAS</span>
                <span className="stat-icon">◇</span>
              </div>

              <div className="stat-value">R$ 5.720</div>

              <div className="stat-footer">
                <span className="positive">+18%</span> este mês
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">AGENDAMENTOS</span>
                <span className="stat-icon">□</span>
              </div>

              <div className="stat-value">31</div>

              <div className="stat-footer">
                <span className="warning">4 hoje</span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>Oportunidades recentes</h3>
                <span>Ver todas →</span>
              </div>

              <div className="panel-body">
                {opportunities.map((item) => (
                  <div className="opportunity" key={item.name}>
                    <div className="client">
                      <div className="client-avatar">
                        {item.initials}
                      </div>

                      <div>
                        <div className="client-name">{item.name}</div>
                        <div className="client-service">
                          {item.service}
                        </div>
                      </div>
                    </div>

                    <div className="opportunity-value">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Assistente WKORA</h3>
                <span>● Online</span>
              </div>

              <div className="ai-card">
                <div className="ai-title">
                  <div className="ai-icon">✦</div>

                  <div>
                    <strong>WKORA IA</strong>
                    <small>INTELIGÊNCIA COMERCIAL</small>
                  </div>
                </div>

                <div className="ai-message">
                  Você tem <strong>2 clientes</strong> aguardando retorno.
                  Uma mensagem de acompanhamento pode ajudar a recuperar
                  essas oportunidades.
                </div>

                <button
                  className="ai-button"
                  onClick={() =>
                    alert("Em breve: recuperação automática de clientes.")
                  }
                >
                  Revisar oportunidades →
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
              }
