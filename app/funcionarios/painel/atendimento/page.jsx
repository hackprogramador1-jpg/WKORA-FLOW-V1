"use client";

import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { auth, db } from "../../../../lib/firebase";

export default function AtendimentoPage() {
  const [carregando, setCarregando] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [erro, setErro] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const cancelar = onAuthStateChanged(
      auth,
      async (usuarioAtual) => {
        if (!usuarioAtual) {
          window.location.href =
            "/funcionarios/login";
          return;
        }

        try {
          if (!usuarioAtual.emailVerified) {
            await signOut(auth);

            window.location.href =
              "/funcionarios/login";

            return;
          }

          const funcionarioRef = await getDocs(
            query(
              collection(db, "funcionarios")
            )
          );

          const funcionarioEncontrado =
            funcionarioRef.docs.find(
              (item) =>
                item.id === usuarioAtual.uid
            );

          if (!funcionarioEncontrado) {
            await signOut(auth);

            window.location.href =
              "/funcionarios/login";

            return;
          }

          const funcionario =
            funcionarioEncontrado.data();

          if (
            funcionario.status !== "aprovado"
          ) {
            await signOut(auth);

            window.location.href =
              "/funcionarios/login";

            return;
          }

          const cargosPermitidos = [
            "CEO",
            "Diretor",
            "Atendimento",
            "Suporte",
          ];

          if (
            !cargosPermitidos.includes(
              funcionario.cargo
            )
          ) {
            setErro(
              "Seu cargo não possui acesso ao Atendimento."
            );

            setCarregando(false);
            return;
          }

          setUsuario(funcionario);

          await carregarSolicitacoes();

        } catch (error) {
          console.error(error);

          setErro(
            "Não foi possível carregar o Atendimento."
          );

          setCarregando(false);
        }
      }
    );

    return () => cancelar();
  }, []);

  async function carregarSolicitacoes() {
    try {
      const referencia = collection(
        db,
        "solicitacoes"
      );

      const consulta = query(
        referencia,
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(
        consulta
      );

      const dados = snapshot.docs.map(
        (documento) => ({
          id: documento.id,
          ...documento.data(),
        })
      );

      setSolicitacoes(dados);
      setCarregando(false);

    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível carregar as solicitações."
      );

      setCarregando(false);
    }
  }

  function formatarData(valor) {
    if (!valor) {
      return "Data não disponível";
    }

    try {
      const data =
        typeof valor.toDate === "function"
          ? valor.toDate()
          : new Date(valor);

      return data.toLocaleString(
        "pt-BR",
        {
          dateStyle: "short",
          timeStyle: "short",
        }
      );
    } catch {
      return "Data não disponível";
    }
  }

  if (carregando) {
    return (
      <main className="painel-loading">
        <div className="painel-loading-card">

          <div className="funcionarios-brand">
            <strong>WKORA</strong>
            <span> FLOW</span>
          </div>

          <div className="loading-spinner"></div>

          <h2>
            Carregando Atendimento
          </h2>

          <p>
            Buscando solicitações...
          </p>

        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="painel-loading">
        <div className="funcionarios-card">

          <div className="funcionarios-brand">
            <strong>WKORA</strong>
            <span> FLOW</span>
          </div>

          <div className="error-message">
            {erro}
          </div>

          <button
            type="button"
            className="create-account-button"
            onClick={() => {
              window.location.href =
                "/funcionarios/painel";
            }}
          >
            Voltar ao painel
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          <strong>WKORA</strong>
          <span> FLOW</span>
        </div>

        <div className="dashboard-area">
          ÁREA INTERNA
        </div>

        <div className="dashboard-profile">

          <div className="profile-avatar">
            {(usuario?.nome || "F")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {usuario?.nome}
            </strong>

            <span>
              {usuario?.cargo}
            </span>
          </div>

        </div>

        <nav className="dashboard-menu">

          <button
            type="button"
            className="menu-item"
            onClick={() => {
              window.location.href =
                "/funcionarios/painel";
            }}
          >
            <span>🏠</span>
            Visão geral
          </button>

          <button
            type="button"
            className="menu-item ativo"
          >
            <span>📥</span>
            Atendimento
          </button>

        </nav>

        <button
          type="button"
          className="dashboard-logout"
          onClick={async () => {
            await signOut(auth);

            window.location.href =
              "/funcionarios/login";
          }}
        >
          🚪 Sair
        </button>

      </aside>

      <section className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <span className="dashboard-header-label">
              WKORA FLOW
            </span>

            <h1>
              Atendimento
            </h1>
          </div>

          <div className="header-user">

            <span>
              {usuario?.nome}
            </span>

            <strong>
              {usuario?.cargo}
            </strong>

          </div>

        </header>

        <div className="dashboard-content">

          <section className="welcome-card">

            <div>

              <span>
                CENTRAL DE ATENDIMENTO
              </span>

              <h2>
                Solicitações recebidas
              </h2>

              <p>
                Aqui serão exibidas as solicitações
                enviadas pelos clientes.
              </p>

            </div>

            <div className="welcome-icon">
              📥
            </div>

          </section>

          <section className="dashboard-stats">

            <div className="stat-card">

              <span>📥</span>

              <small>
                Total
              </small>

              <strong>
                {solicitacoes.length}
              </strong>

            </div>

            <div className="stat-card">

              <span>🆕</span>

              <small>
                Novas
              </small>

              <strong>
                {
                  solicitacoes.filter(
                    (item) =>
                      item.status === "nova"
                  ).length
                }
              </strong>

            </div>

            <div className="stat-card">

              <span>🔎</span>

              <small>
                Em análise
              </small>

              <strong>
                {
                  solicitacoes.filter(
                    (item) =>
                      item.status ===
                      "analise"
                  ).length
                }
              </strong>

            </div>

            <div className="stat-card">

              <span>📄</span>

              <small>
                Propostas
              </small>

              <strong>
                {
                  solicitacoes.filter(
                    (item) =>
                      item.status ===
                      "proposta"
                  ).length
                }
              </strong>

            </div>

          </section>

          <section className="dashboard-section">

            <div className="section-title">

              <div>
                <span>
                  SOLICITAÇÕES
                </span>

                <h2>
                  Caixa de entrada
                </h2>
              </div>

            </div>

            {solicitacoes.length === 0 ? (

              <div className="empty-dashboard">

                <div className="empty-icon">
                  📭
                </div>

                <h3>
                  Nenhuma solicitação
                </h3>

                <p>
                  Ainda não existem solicitações
                  registradas no Firestore.
                </p>

              </div>

            ) : (

              <div className="solicitacoes-lista">

                {solicitacoes.map(
                  (solicitacao) => (

                    <article
                      key={solicitacao.id}
                      className="solicitacao-card"
                    >

                      <div className="solicitacao-topo">

                        <div>

                          <span className="solicitacao-id">
                            {solicitacao.id}
                          </span>

                          <h3>
                            {solicitacao.customer?.name ||
                              "Cliente"}
                          </h3>

                        </div>

                        <span className="status-badge">
                          {solicitacao.status ||
                            "nova"}
                        </span>

                      </div>

                      <div className="solicitacao-info">

                        <div>
                          <small>
                            Serviço
                          </small>

                          <strong>
                            {solicitacao.service?.name ||
                              solicitacao.service?.type ||
                              "Não informado"}
                          </strong>
                        </div>

                        <div>
                          <small>
                            Empresa
                          </small>

                          <strong>
                            {solicitacao.customer?.company ||
                              "Não informada"}
                          </strong>
                        </div>

                        <div>
                          <small>
                            Contato
                          </small>

                          <strong>
                            {solicitacao.customer?.contact ||
                              "Não informado"}
                          </strong>
                        </div>

                        <div>
                          <small>
                            Recebida em
                          </small>

                          <strong>
                            {formatarData(
                              solicitacao.createdAt
                            )}
                          </strong>
                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </section>

    </main>
  );
        }
