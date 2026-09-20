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
              "Funcionário não encontrado no Firestore."
            );
          }

          const funcionario =
            funcionarioSnapshot.data();

          if (
            funcionario.status !== "aprovado"
          ) {
            throw new Error(
              "Este funcionário ainda não está aprovado."
            );
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
            throw new Error(
              "Seu cargo não possui acesso ao Atendimento."
            );
          }

          setUsuario({
            ...funcionario,
            uid: usuarioAtual.uid,
          });

          /*
           * BUSCA TODAS AS SOLICITAÇÕES
           */
          const referencia =
            collection(db, "solicitacoes");

          const resultado =
            await getDocs(referencia);

          const lista =
            resultado.docs.map((item) => ({
              id: item.id,
              ...item.data(),
            }));

          lista.sort((a, b) => {
            const dataA =
              a.createdAt?.toDate?.()?.getTime?.() ||
              0;

            const dataB =
              b.createdAt?.toDate?.()?.getTime?.() ||
              0;

            return dataB - dataA;
          });

          setSolicitacoes(lista);
        } catch (error) {
          console.error(
            "ERRO ATENDIMENTO:",
            error
          );

          setErro(
            error?.message ||
              "Erro desconhecido ao carregar solicitações."
          );
        } finally {
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

      return data.toLocaleString("pt-BR");
    } catch {
      return "Data inválida";
    }
  }

  function nomeServico(item) {
    return (
      item.service?.name ||
      item.service?.type ||
      "Serviço não informado"
    );
  }

  function nomeStatus(valor) {
    switch (valor) {
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
        return valor || "Sem status";
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

          <div className="loading-spinner" />

          <h2>
            Carregando Atendimento
          </h2>

          <p>
            Consultando solicitações no Firebase...
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

          <h2>
            Erro ao carregar Atendimento
          </h2>

          <div className="error-message">
            {erro}
          </div>

          <p>
            Essa mensagem é o erro retornado pelo
            Firebase.
          </p>

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
                Solicitações enviadas pelos
                clientes aparecem aqui.
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
                      item.status === "analise"
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
                      item.status === "proposta"
                  ).length
                }
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
                  Nenhuma solicitação encontrada
                </h3>

                <p>
                  O Firebase respondeu, mas a
                  coleção solicitacoes retornou
                  0 documentos.
                </p>

                <p>
                  Verifique se a solicitação está
                  realmente dentro de:
                </p>

                <strong>
                  Firestore Database → solicitacoes
                </strong>
              </div>
            ) : (
              <div className="solicitacoes-lista">
                {solicitacoes.map((item) => (
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
                        {nomeStatus(
                          item.status
                        )}
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
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
                }
