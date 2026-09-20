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
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [erro, setErro] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    let ativo = true;

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

          /*
           * Busca somente o funcionário
           * atualmente conectado.
           */
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

          if (!ativo) return;

          setUsuario({
            ...funcionario,
            uid: usuarioAtual.uid,
          });

          /*
           * Busca as solicitações.
           *
           * Sem orderBy para evitar dependência
           * de índice do Firestore.
           */
          const referencia = collection(
            db,
            "solicitacoes"
          );

          const snapshot =
            await getDocs(referencia);

          const dados =
            snapshot.docs.map((documento) => ({
              id: documento.id,
              ...documento.data(),
            }));

          /*
           * Ordena as solicitações mais recentes
           * primeiro.
           */
          dados.sort((a, b) => {
            const dataA =
              a.createdAt?.toDate?.()?.getTime?.() ||
              0;

            const dataB =
              b.createdAt?.toDate?.()?.getTime?.() ||
              0;

            return dataB - dataA;
          });

          if (!ativo) return;

          setSolicitacoes(dados);
          setCarregando(false);
        } catch (error) {
          console.error(
            "ERRO ATENDIMENTO:",
            error
          );

          if (!ativo) return;

          setErro(
            error?.message ||
              "Não foi possível carregar as solicitações."
          );

          setCarregando(false);
        }
      }
    );

    return () => {
      ativo = false;
      cancelar();
    };
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

  function nomeServico(solicitacao) {
    return (
      solicitacao.service?.name ||
      solicitacao.service?.type ||
      "Serviço não informado"
    );
  }

  function statusFormatado(status) {
    const nomes = {
      nova: "Nova",
      analise: "Em análise",
      proposta: "Proposta",
      aprovada: "Aprovada",
      projeto: "Projeto",
      entregue: "Entregue",
      suporte: "Suporte",
      finalizada: "Finalizada",
    };

    return nomes[status] || "Nova";
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
              window.location.reload();
            }}
          >
            Tentar novamente
          </button>

          <button
            type="button"
            className="back-button"
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

  const novas =
    solicitacoes.filter(
      (item) => item.status === "nova"
    ).length;

  const emAnalise =
    solicitacoes.filter(
      (item) => item.status === "analise"
    ).length;

  const propostas =
    solicitacoes.filter(
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
              {usuario?.nome || "Funcionário"}
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
                Todas as solicitações recebidas
                pela WKORA DIGITAL aparecem aqui.
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
                {emAnalise}
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
                  SOLICITAÇÕES
                </span>

                <h2>
                  Caixa de entrada
                </h2>
              </div>

              <button
                type="button"
                className="header-link"
                onClick={() => {
                  window.location.reload();
                }}
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
                  Nenhuma solicitação encontrada
                </h3>

                <p>
                  O Firestore não retornou nenhuma
                  solicitação para este setor.
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
                            ID: {solicitacao.id}
                          </span>

                          <h3>
                            {solicitacao.customer?.name ||
                              "Cliente"}
                          </h3>

                        </div>

                        <span className="status-badge">
                          {statusFormatado(
                            solicitacao.status
                          )}
                        </span>

                      </div>

                      <div className="solicitacao-info">

                        <div>
                          <small>
                            Serviço
                          </small>

                          <strong>
                            {nomeServico(
                              solicitacao
                            )}
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

                      <div className="solicitacao-acoes">

                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => {
                            alert(
                              "A abertura detalhada será implementada na próxima etapa."
                            );
                          }}
                        >
                          Abrir solicitação
                        </button>

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
