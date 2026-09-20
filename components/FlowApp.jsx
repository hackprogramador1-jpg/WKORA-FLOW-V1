"use client";

import { useState } from "react";
import { createRequest } from "../lib/flowStore";

const services = {
  site: {
    title: "Desenvolvimento de Site",
    description:
      "Criamos sites profissionais de acordo com os objetivos e necessidades da sua empresa.",
    fields: [
      ["company", "Nome da empresa"],
      ["name", "Seu nome"],
      ["contact", "WhatsApp ou e-mail"],
      ["type", "Que tipo de site você precisa?"],
      ["pages", "Quais páginas gostaria de ter?"],
      ["features", "Quais funcionalidades você precisa?"],
      ["deadline", "Existe algum prazo desejado?"],
      ["details", "Conte mais sobre o projeto"],
    ],
  },

  saas: {
    title: "Desenvolvimento de SaaS",
    description:
      "Criamos sistemas e plataformas digitais personalizados para empresas.",
    fields: [
      ["company", "Nome da empresa"],
      ["name", "Seu nome"],
      ["contact", "WhatsApp ou e-mail"],
      ["problem", "Qual problema o sistema deve resolver?"],
      ["users", "Quem utilizará o sistema?"],
      ["features", "Quais funcionalidades você imagina?"],
      ["integrations", "Precisa de integrações com outros serviços?"],
      ["details", "Explique como você gostaria que o SaaS funcionasse"],
    ],
  },

  marketing: {
    title: "Marketing",
    description:
      "Planejamos soluções de marketing de acordo com os objetivos da empresa.",
    fields: [
      ["company", "Nome da empresa"],
      ["name", "Seu nome"],
      ["contact", "WhatsApp ou e-mail"],
      ["objective", "Qual é o objetivo do marketing?"],
      ["audience", "Qual é o público da empresa?"],
      ["channels", "Quais canais deseja trabalhar?"],
      ["brand", "A empresa já possui identidade visual?"],
      ["details", "Conte mais sobre o que você precisa"],
    ],
  },
};

export default function FlowApp() {
  const [screen, setScreen] = useState("home");
  const [service, setService] = useState(null);
  const [form, setForm] = useState({});
  const [sentRequest, setSentRequest] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function chooseService(type) {
    setService(type);
    setForm({});
    setSentRequest(null);
    setError("");
    setScreen("request");
  }

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submitRequest(event) {
    event.preventDefault();

    if (sending) {
      return;
    }

    setError("");

    const name = String(form.name || "").trim();
    const contact = String(form.contact || "").trim();

    if (!name || !contact) {
      setError("Preencha seu nome e um canal de contato.");
      return;
    }

    try {
      setSending(true);

      const request = await createRequest({
        service,
        customer: {
          name,
          company: String(form.company || "").trim(),
          contact,
        },
        answers: form,
      });

      setSentRequest(request);
      setScreen("success");
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);

      setError(
        "Não foi possível enviar sua solicitação agora. Verifique sua conexão e tente novamente."
      );
    } finally {
      setSending(false);
    }
  }

  if (screen === "request" && service) {
    const selected = services[service];

    return (
      <main className="flow-page">
        <header className="flow-header">
          <button
            className="back-button"
            type="button"
            onClick={() => {
              setError("");
              setScreen("home");
            }}
          >
            ← Voltar
          </button>

          <div className="brand">
            <strong>WKORA</strong>
            <span>FLOW</span>
          </div>
        </header>

        <section className="request-container">
          <div className="request-heading">
            <span className="eyebrow">
              SOLICITAÇÃO DE PROJETO
            </span>

            <h1>{selected.title}</h1>

            <p>{selected.description}</p>
          </div>

          <form
            onSubmit={submitRequest}
            className="request-form"
          >
            {selected.fields.map(([key, label]) => {
              const isTextarea =
                key === "details" ||
                key === "features" ||
                key === "pages" ||
                key === "problem" ||
                key === "integrations";

              return (
                <label key={key}>
                  <span>{label}</span>

                  {isTextarea ? (
                    <textarea
                      value={form[key] || ""}
                      onChange={(event) =>
                        updateField(
                          key,
                          event.target.value
                        )
                      }
                      placeholder="Escreva aqui..."
                      rows={5}
                    />
                  ) : (
                    <input
                      value={form[key] || ""}
                      onChange={(event) =>
                        updateField(
                          key,
                          event.target.value
                        )
                      }
                      placeholder={label}
                    />
                  )}
                </label>
              );
            })}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="privacy-notice">
              🔐 <strong>Privacidade:</strong> os dados
              enviados serão utilizados para análise do
              projeto e atendimento. Eles não serão publicados
              na página pública.
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={sending}
            >
              {sending
                ? "Enviando solicitação..."
                : "Enviar solicitação"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  if (screen === "success" && sentRequest) {
    return (
      <main className="flow-page">
        <header className="flow-header">
          <div className="brand">
            <strong>WKORA</strong>
            <span>FLOW</span>
          </div>
        </header>

        <section className="request-container">
          <div className="success-box">
            <div className="success-icon">✓</div>

            <span className="eyebrow">
              SOLICITAÇÃO RECEBIDA
            </span>

            <h1>Recebemos sua solicitação.</h1>

            <p>
              Sua solicitação foi registrada para análise
              do atendimento.
            </p>

            <div className="next-steps">
              <div>
                <strong>ID</strong>
                <span>{sentRequest.id}</span>
              </div>

              <div>
                <strong>SERVIÇO</strong>
                <span>
                  {sentRequest.service.name}
                </span>
              </div>

              <div>
                <strong>STATUS</strong>
                <span>Nova solicitação</span>
              </div>
            </div>

            <p>
              A equipe da WKORA DIGITAL irá analisar as
              informações enviadas e poderá entrar em contato
              para entender melhor o projeto e preparar uma
              proposta personalizada.
            </p>

            <button
              className="primary-button"
              type="button"
              onClick={() => {
                setService(null);
                setForm({});
                setSentRequest(null);
                setError("");
                setScreen("home");
              }}
            >
              Voltar para a empresa
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "privacy") {
    return (
      <main className="flow-page">
        <header className="flow-header">
          <button
            className="back-button"
            type="button"
            onClick={() => setScreen("home")}
          >
            ← Voltar
          </button>

          <div className="brand">
            <strong>WKORA</strong>
            <span>FLOW</span>
          </div>
        </header>

        <section className="company-section">
          <span className="eyebrow">
            PRIVACIDADE
          </span>

          <h2>Política de Privacidade</h2>

          <p>
            A WKORA DIGITAL valoriza a privacidade das
            informações fornecidas por seus clientes e
            visitantes.
          </p>

          <p>
            Os dados enviados através da plataforma WKORA
            FLOW são utilizados para atendimento, análise
            das solicitações e comunicação relacionada aos
            serviços solicitados.
          </p>

          <p>
            Informações internas, observações da equipe,
            dados de outros clientes e informações
            administrativas não devem ser disponibilizados
            publicamente.
          </p>

          <p>
            O acesso às informações deve respeitar as
            permissões correspondentes a cada usuário e
            função dentro da plataforma.
          </p>

          <p>
            A WKORA DIGITAL poderá atualizar suas políticas
            e procedimentos de privacidade conforme a
            evolução da plataforma e dos serviços.
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={() => setScreen("home")}
          >
            Voltar para a empresa
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flow-page">
      <header className="flow-header">
        <div className="brand">
          <strong>WKORA</strong>
          <span>FLOW</span>
        </div>

        <button
          className="header-link"
          type="button"
          onClick={() => setScreen("privacy")}
        >
          Privacidade
        </button>
      </header>

      <section className="hero">
        <span className="eyebrow">
          WKORA DIGITAL
        </span>

        <h1>
          Soluções digitais para
          <br />
          empresas que querem evoluir.
        </h1>

        <p>
          Conheça a WKORA DIGITAL, nossos serviços e
          envie sua solicitação diretamente pela plataforma.
        </p>

        <button
          className="primary-button"
          type="button"
          onClick={() =>
            document
              .getElementById("services")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          Conhecer nossos serviços
        </button>
      </section>

      <section className="company-section">
        <span className="eyebrow">
          SOBRE A WKORA
        </span>

        <h2>Quem somos</h2>

        <p>
          A WKORA DIGITAL trabalha com soluções digitais
          para empresas, incluindo desenvolvimento de sites,
          SaaS e marketing.
        </p>

        <p>
          O desenvolvimento de aplicativos está atualmente
          em <strong>desenvolvimento</strong> e ainda não é
          oferecido como serviço disponível.
        </p>

        <div className="support-card">
          <strong>Suporte pós-entrega</strong>

          <p>
            Projetos elegíveis contam com suporte durante
            30 dias após a entrega, conforme as condições
            estabelecidas para o serviço contratado.
          </p>
        </div>
      </section>

      <section
        id="services"
        className="services-section"
      >
        <span className="eyebrow">
          NOSSOS SERVIÇOS
        </span>

        <h2>
          Como podemos trabalhar com sua empresa?
        </h2>

        <div className="service-grid">
          <button
            type="button"
            onClick={() => chooseService("site")}
          >
            <span>🌐</span>

            <strong>Sites</strong>

            <small>
              Desenvolvimento de sites profissionais.
            </small>

            <em>
              Solicitar projeto →
            </em>
          </button>

          <button
            type="button"
            onClick={() => chooseService("saas")}
          >
            <span>⚙️</span>

            <strong>SaaS</strong>

            <small>
              Sistemas e plataformas personalizados.
            </small>

            <em>
              Solicitar projeto →
            </em>
          </button>

          <button
            type="button"
            onClick={() => chooseService("marketing")}
          >
            <span>📣</span>

            <strong>Marketing</strong>

            <small>
              Soluções de marketing para sua empresa.
            </small>

            <em>
              Solicitar projeto →
            </em>
          </button>

          <button
            className="disabled-service"
            type="button"
            disabled
          >
            <span>📱</span>

            <strong>Aplicativos</strong>

            <small>
              Desenvolvimento atualmente em andamento.
            </small>

            <em>
              Em desenvolvimento
            </em>
          </button>
        </div>
      </section>

      <section className="company-section">
        <span className="eyebrow">
          TRANSPARÊNCIA
        </span>

        <h2>
          O que não oferecemos atualmente
        </h2>

        <p>
          A WKORA DIGITAL trabalha atualmente com sites,
          SaaS e marketing. Serviços que não estejam
          oficialmente disponibilizados não devem ser
          considerados parte da nossa oferta.
        </p>

        <p>
          Aplicativos estão em desenvolvimento e serão
          disponibilizados somente quando essa modalidade
          estiver oficialmente habilitada.
        </p>
      </section>

      <footer className="flow-footer">
        <div>
          <strong>WKORA DIGITAL</strong>
          <span>
            Soluções digitais.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setScreen("privacy")}
        >
          Política de Privacidade
        </button>
      </footer>
    </main>
  );
}
