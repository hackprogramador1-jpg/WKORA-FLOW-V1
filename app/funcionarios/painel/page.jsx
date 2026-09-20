"use client";

import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../../../lib/firebase";

const MENU = [
  {
    id: "inicio",
    nome: "Visão geral",
    icone: "🏠",
    cargos: [
      "CEO",
      "Diretor",
      "Atendimento",
      "Suporte",
      "DESENVOLVEDOR",
      "Financeiro",
    ],
  },
  {
    id: "atendimento",
    nome: "Atendimento",
    icone: "📥",
    cargos: [
      "CEO",
      "Diretor",
      "Atendimento",
      "Suporte",
    ],
  },
  {
    id: "solicitacoes",
    nome: "Solicitações",
    icone: "📋",
    cargos: [
      "CEO",
      "Diretor",
      "Atendimento",
    ],
  },
  {
    id: "clientes",
    nome: "Clientes",
    icone: "👥",
    cargos: [
      "CEO",
      "Diretor",
      "Atendimento",
      "Suporte",
    ],
  },
  {
    id: "conversas",
    nome: "Conversas",
    icone: "💬",
    cargos: [
      "CEO",
      "Diretor",
      "Atendimento",
      "Suporte",
    ],
  },
  {
    id: "projetos",
    nome: "Projetos",
    icone: "📊",
    cargos: [
      "CEO",
      "Diretor",
      "DESENVOLVEDOR",
      "Atendimento",
    ],
  },
  {
    id: "financeiro",
    nome: "Financeiro",
    icone: "💰",
    cargos: [
      "CEO",
      "Diretor",
      "Financeiro",
    ],
  },
  {
    id: "funcionarios",
    nome: "Funcionários",
    icone: "👨‍💼",
    cargos: [
      "CEO",
      "Diretor",
    ],
  },
  {
    id: "configuracoes",
    nome: "Configurações",
    icone: "⚙️",
    cargos: [
      "CEO",
      "Diretor",
    ],
  },
];

export default function FuncionariosPainelPage() {
  const [carregando, setCarregando] = useState(true);
  const [funcionario, setFuncionario] = useState(null);
  const [erro, setErro] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [pagina, setPagina] = useState("inicio");

  useEffect(() => {
    const cancelar = onAuthStateChanged(
      auth,
      async (usuario) => {
        if (!usuario) {
          window.location.href =
            "/funcionarios/login";
          return;
        }

        try {
          if (!usuario.emailVerified) {
            await signOut(auth);

            window.location.href =
              "/funcionarios/login";

            return;
          }

          const referencia = doc(
            db,
            "funcionarios",
            usuario.uid
          );

          const snapshot = await getDoc(
            referencia
          );

          if (!snapshot.exists()) {
            await signOut(auth);

            window.location.href =
              "/funcionarios/login";

            return;
          }

          const dados = snapshot.data();

          if (dados.status !== "aprovado") {
            await signOut(auth);

            window.location.href =
              "/funcionarios/login";

            return;
          }

          if (
            !dados.cargo ||
            dados.cargo === "pendente"
          ) {
            await signOut(auth);

            window.location.href =
              "/funcionarios/login";

            return;
          }

          setFuncionario(dados);
          setCarregando(false);

        } catch (error) {
          console.error(error);

          setErro(
            "Não foi possível carregar o painel."
          );

          setCarregando(false);
        }
      }
    );

    return () => cancelar();
  }, []);

  async function sair() {
    await signOut(auth);

    window.location.href =
      "/funcionarios/login";
  }

  function selecionarPagina(id) {
    setPagina(id);
    setMenuAberto(false);
  }

  const menusPermitidos = funcionario
    ? MENU.filter((item) =>
        item.cargos.includes(
          funcionario.cargo
        )
      )
    : [];

  if (carregando) {
    return (
      <main className="painel-loading">
        <div className="painel-loading-card">
          <div className="funcionarios-brand">
            <strong>WKORA</strong>
            <span> FLOW</span>
          </div>

          <div className="loading-spinner"></div>

          <h2>Carregando painel</h2>

          <p>
            Verificando sua autorização...
          </p>
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="painel-loading">
        <div className="funcionarios-card">
          <div className="error-message">
            {erro}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">

      <aside
        className={
          menuAberto
            ? "dashboard-sidebar aberto"
            : "dashboard-sidebar"
        }
      >

        <div className="dashboard-logo">
          <strong>WKORA</strong>
          <span> FLOW</span>
        </div>

        <div className="dashboard-area">
          ÁREA INTERNA
        </div>

        <div className="dashboard-profile">

          <div className="profile-avatar">
            {(funcionario?.nome || "F")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {funcionario?.nome}
            </strong>

            <span>
              {funcionario?.cargo}
            </span>
          </div>

        </div>

        <nav className="dashboard-menu">

          {menusPermitidos.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                pagina === item.id
                  ? "menu-item ativo"
                  : "menu-item"
              }
              onClick={() =>
                selecionarPagina(item.id)
              }
            >
              <span>{item.icone}</span>
              {item.nome}
            </button>
          ))}

        </nav>

        <button
          type="button"
          className="dashboard-logout"
          onClick={sair}
        >
          🚪 Sair
        </button>

      </aside>

      {menuAberto && (
        <div
          className="dashboard-overlay"
          onClick={() =>
            setMenuAberto(false)
          }
        />
      )}

      <section className="dashboard-main">

        <header className="dashboard-header">

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMenuAberto(true)
            }
          >
            ☰
          </button>

          <div>
            <span className="dashboard-header-label">
              WKORA FLOW
            </span>

            <h1>
              {pagina === "inicio"
                ? "Visão geral"
                : menusPermitidos.find(
                    (item) =>
                      item.id === pagina
                  )?.nome || "Painel"}
            </h1>
          </div>

          <div className="header-user">
            <span>
              {funcionario?.nome}
            </span>

            <strong>
              {funcionario?.cargo}
            </strong>
          </div>

        </header>

        <div className="dashboard-content">

          {pagina === "inicio" && (
            <>
              <section className="welcome-card">

                <div>
                  <span>
                    BEM-VINDO AO WKORA FLOW
                  </span>

                  <h2>
                    Olá, {funcionario?.nome}.
                  </h2>

                  <p>
                    Este é o centro de operações
                    internas da WKORA DIGITAL.
                  </p>
                </div>

                <div className="welcome-icon">
                  ◆
                </div>

              </section>

              <section className="dashboard-stats">

                <div className="stat-card">
                  <span>📋</span>
                  <small>Solicitações</small>
                  <strong>0</strong>
                </div>

                <div className="stat-card">
                  <span>👥</span>
                  <small>Clientes</small>
                  <strong>0</strong>
                </div>

                <div className="stat-card">
                  <span>📊</span>
                  <small>Projetos</small>
                  <strong>0</strong>
                </div>

                <div className="stat-card">
                  <span>💬</span>
                  <small>Conversas</small>
                  <strong>0</strong>
                </div>

              </section>

              <section className="dashboard-section">

                <div className="section-title">
                  <div>
                    <span>ATIVIDADE</span>
                    <h2>Central de trabalho</h2>
                  </div>
                </div>

                <div className="empty-dashboard">

                  <div className="empty-icon">
                    ◇
                  </div>

                  <h3>
                    Nenhuma atividade ainda
                  </h3>

                  <p>
                    As solicitações, clientes,
                    projetos e atividades reais
                    aparecerão aqui conforme forem
                    cadastrados no sistema.
                  </p>

                </div>

              </section>
            </>
          )}

          {pagina !== "inicio" && (
            <section className="dashboard-section">

              <div className="section-title">
                <div>
                  <span>WKORA FLOW</span>

                  <h2>
                    {menusPermitidos.find(
                      (item) =>
                        item.id === pagina
                    )?.nome}
                  </h2>
                </div>
              </div>

              <div className="empty-dashboard">

                <div className="empty-icon">
                  {menusPermitidos.find(
                    (item) =>
                      item.id === pagina
                  )?.icone}
                </div>

                <h3>
                  Área preparada
                </h3>

                <p>
                  Esta área será conectada aos
                  dados reais do WKORA FLOW nas
                  próximas etapas.
                </p>

              </div>

            </section>
          )}

        </div>

      </section>

    </main>
  );
}
