"use client";

import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { auth, db } from "../../../../lib/firebase";

export default function AtendimentoPage() {
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [erro, setErro] = useState("");

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

          const funcionarioRef = doc(
            db,
            "funcionarios",
            usuarioAtual.uid
          );

          const funcionarioSnapshot =
            await getDoc(funcionarioRef);

          if (!funcionarioSnapshot.exists()) {
            throw new Error(
              "Cadastro do funcionário não encontrado."
            );
          }

          const funcionario =
            funcionarioSnapshot.data();

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

          setUsuario({
            ...funcionario,
            uid: usuarioAtual.uid,
          });

          const solicitacoesRef =
            collection(db, "solicitacoes");

          const snapshot =
            await getDocs(solicitacoesRef);

          const lista =
            snapshot.docs.map((documento) => ({
              id: documento.id,
              ...documento.data(),
            }));

          lista.sort((a, b) => {
            const aData =
              a.createdAt?.toDate?.()?.getTime?.() || 0;

            const bData =
              b.createdAt?.toDate?.()?.getTime?.() || 0;

            return bData - aData;
          });

          setSolicitacoes(lista);
          setCarregando(false);
        } catch (error) {
          console.error(
            "ERRO AO CARREGAR ATENDIMENTO:",
            error
          );

          setErro(
            error?.message ||
              "Não foi possível carregar as solicitações."
          );

          setCarregando(false);
        }
      }
    );

    return () => cancelar();
  }, []);

  function formatarData(valor) {
    if (!valor) {
      return "Data não disponível";
    }

    try {
      const data =
        typeof valor.toDate === "function"
          ? valor.toDate()
          : new Date(valor);

      return data.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return "Data não disponível";
    }
  }

  function nomeServico(item) {
    return (
      item.service?.name ||
      item.service?.type ||
      "Serviço não informado"
    );
  }

  function status(item) {
    switch (item.status) {
      case "nova":
        return "Nova";

      case "analise":
        return "Em análise";

      case "proposta":
        return "Proposta";

      case "aprovada":
        return "Aprovada";

      case "projeto":
        return "Projeto";

      case "entregue":
        return "Entregue";

      case "suporte":
        return "Suporte";

      case "finalizada":
        return "Finalizada";

      default:
        return "Nova";
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
            className="create-account-button"
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Tentar novamente
          </button>

          <button
            className="back-button"
            type="button"
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

  const novas = solicitacoes.filter(
    (item) => item.status === "nova"
  ).length;

  const analise = solicitacoes.filter(
    (item) => item.status === "analise"
  ).length;

  const propostas = solicitacoes.filter(
    (item) => item.status === "proposta"
  ).length;

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
            className="menu-item"
            type="button"
            onClick={() => {
              window.location.href =
                "/funcionarios/painel";
            }}
          >
            <span>🏠</span>
            Visão geral
          </button>

          <button
            className="menu-item ativo"
            type="button"
          >
            <span>📥</span>
            Atendimento
          </button>

        </nav>

        <button
          className="dashboard-logout"
          type="button"
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
                Todas as solicitações enviadas
                pelos clientes aparecem nesta central.
              </p>
            </div>

            <div className="welcome-icon">
              📥
            </div>

          </section>

          <section className="dashboard-stats">

            <div className="stat-card">
              <span>📥</span>
              <small>Total</small>
              <strong>
                {solicitacoes.length}
              </strong>
            </div>

            <div className="stat-card">
              <span>🆕</span>
              <small>Novas</small>
              <strong>
                {novas}
              </strong>
            </div>

            <div className="stat-card">
              <span>🔎</span>
              <small>Em análise</small>
              <strong>
                {analise}
              </strong>
            </div>

            <div className="stat-card">
              <span>📄</span>
              <small>Propostas</small>
              <strong>
                {propostas}
              </strong>
            </div>

          </section>

          <section className="dashboard-section">

            <div className="section-title">
              <div>
                <span>
                  CAIXA DE ENTRADA
                </span>

                <h2>
                  Solicitações
                </h2>
              </div>

              <button
                className="header-link"
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Atualizar
              </button>
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
                  Não há solicitações disponíveis
                  para atendimento.
                </p>

              </div>

            ) : (

              <div className="solicitacoes-lista">

                {solicitacoes.map(
                  (item) => (

                    <article
                      className="solicitacao-card"
                      key={item.id}
                    >

                      <div className="solicitacao-topo">

                        <div>

                          <span className="solicitacao-id">
                            ID: {item.id}
                          </span>

                          <h3>
                            {item.customer?.name ||
                              "Cliente"}
                          </h3>

                        </div>

                        <span className="status-badge">
                          {status(item)}
                        </span>

                      </div>

                      <div className="solicitacao-info">

                        <div>
                          <small>
                            Serviço
                          </small>

                          <strong>
                            {nomeServico(item)}
                          </strong>
                        </div>

                        <div>
                          <small>
                            Empresa
                          </small>

                          <strong>
                            {item.customer?.company ||
                              "Não informada"}
                          </strong>
                        </div>

                        <div>
                          <small>
                            Contato
                          </small>

                          <strong>
                            {item.customer?.contact ||
                              "Não informado"}
                          </strong>
                        </div>

                        <div>
                          <small>
                            Recebida em
                          </small>

                          <strong>
                            {formatarData(
                              item.createdAt
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
