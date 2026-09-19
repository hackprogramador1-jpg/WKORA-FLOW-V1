"use client";

import { useState } from "react";

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
      ["details", "Conte mais sobre o projeto"]
    ]
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
      ["details", "Explique como você gostaria que o SaaS funcionasse"]
    ]
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
      ["details", "Conte mais sobre o que você precisa"]
    ]
  }
};

export default function FlowApp() {
  const [screen, setScreen] = useState("home");
  const [service, setService] = useState(null);
  const [form, setForm] = useState({});
  const [sent, setSent] = useState(false);

  function chooseService(type) {
    setService(type);
    setForm({});
    setSent(false);
    setScreen("request");
  }

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  function submitRequest(event) {
    event.preventDefault();

    const required = ["name", "contact"];

    const missing = required.some(
      (field) => !String(form[field] || "").trim()
    );

    if (missing) {
      alert("Preencha seu nome e um canal de contato.");
      return;
    }

    /*
      Nesta etapa o pedido é preparado no navegador.
      Na próxima etapa será enviado para o backend protegido
      e ficará disponível somente para o setor autorizado.
    */

    setSent(true);
  }

  if (screen === "request" && service) {
    const selected = services[service];

    return (
      <main className="flow-page">
        <header className="flow-header">
          <button
            className="back-button"
            onClick={() => setScreen("home")}
          >
            ← Voltar
          </button>

          <div className="brand">
            <strong>WKORA</strong>
            <span>FLOW</span>
          </div>
        </header>

        <section className="request-container">
          {!sent ? (
            <>
              <div className="request-heading">
                <span className="eyebrow">SOLICITAÇÃO DE PROJETO</span>
                <h1>{selected.title}</h1>
                <p>{selected.description}</p>
              </div>

              <form onSubmit={submitRequest} className="request-form">
                {selected.fields.map(([key, label]) => (
                  <label key={key}>
                    <span>{label}</span>

                    {key === "details" ||
                    key === "features" ||
                    key === "pages" ||
                    key === "problem" ||
                    key === "integrations" ? (
                      <textarea
                        value={form[key] || ""}
                        onChange={(event) =>
                          updateField(key, event.target.value)
                        }
                        placeholder="Escreva aqui..."
                        rows={5}
                      />
                    ) : (
                      <input
                        value={form[key] || ""}
                        onChange={(event) =>
                          updateField(key, event.target.value)
                        }
                        placeholder={label}
                      />
                    )}
                  </label>
                ))}

                <div className="privacy-notice">
                  🔐 <strong>Privacidade:</strong> os dados enviados nesta
                  solicitação serão utilizados para análise do projeto e
                  atendimento. Eles não serão publicados na página pública.
                </div>

                <button className="primary-button" type="submit">
                  Enviar solicitação
                </button>
              </form>
            </>
          ) : (
            <div className="success-box">
              <div className="success-icon">✓</div>

              <span className="eyebrow">SOLICITAÇÃO RECEBIDA</span>

              <h1>Recebemos sua solicitação.</h1>

              <p>
                Nossa equipe de atendimento irá analisar as informações
                enviadas e poderá entrar em contato para entender melhor o
                projeto e preparar uma proposta.
              </p>

              <div className="next-steps">
                <div>
                  <strong>01</strong>
                  <span>Análise da solicitação</span>
                </div>

                <div>
                  <strong>02</strong>
                  <span>Contato do atendimento</span>
                </div>

                <div>
                  <strong>03</strong>
                  <span>Proposta personalizada</span>
                </div>
              </div>

              <button
                className="primary-button"
                onClick={() => setScreen("home")}
              >
                Voltar para a empresa
              </button>
            </div>
          )}
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
          onClick={() => setScreen("privacy")}
        >
          Privacidade
        </button>
      </header>

      <section className="hero">
        <span className="eyebrow">WKORA DIGITAL</span>

        <h1>
          Soluções digitais para
          <br />
          empresas que querem evoluir.
        </h1>

        <p>
          Conheça a WKORA DIGITAL, nossos serviços e envie sua solicitação
          diretamente pela plataforma.
        </p>

        <button
          className="primary-button"
          onClick={() =>
            document
              .getElementById("services")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Conhecer nossos serviços
        </button>
      </section>

      <section className="company-section">
        <span className="eyebrow">SOBRE A WKORA</span>

        <h2>Quem somos</h2>

        <p>
          A WKORA DIGITAL trabalha com soluções digitais para empresas,
          incluindo desenvolvimento de sites, SaaS e marketing.
        </p>

        <p>
          O desenvolvimento de aplicativos está atualmente em
          <strong> desenvolvimento</strong> e ainda não é oferecido como
          serviço disponível.
        </p>

        <div className="support-card">
          <strong>Suporte pós-entrega</strong>
          <p>
            Projetos elegíveis contam com suporte durante 30 dias após a
            entrega, conforme as condições estabelecidas para o serviço
            contratado.
          </p>
        </div>
      </section>

      <section id="services" className="services-section">
        <span className="eyebrow">NOSSOS SERVIÇOS</span>

        <h2>Como podemos trabalhar com sua empresa?</h2>

        <div className="service-grid">
          <button onClick={() => chooseService("site")}>
            <span>🌐</span>
            <strong>Sites</strong>
            <small>Desenvolvimento de sites profissionais.</small>
            <em>Solicitar projeto →</em>
          </button>

          <button onClick={() => chooseService("saas")}>
            <span>⚙️</span>
            <strong>SaaS</strong>
            <small>Sistemas e plataformas personalizados.</small>
            <em>Solicitar projeto →</em>
          </button>

          <button onClick={() => chooseService("marketing")}>
            <span>📣</span>
            <strong>Marketing</strong>
            <small>Soluções de marketing para sua empresa.</small>
            <em>Solicitar projeto →</em>
          </button>

          <button className="disabled-service" disabled>
            <span>📱</span>
            <strong>Aplicativos</strong>
            <small>Desenvolvimento atualmente em andamento.</small>
            <em>Em desenvolvimento</em>
          </button>
        </div>
      </section>

      <section className="company-section">
        <span className="eyebrow">TRANSPARÊNCIA</span>

        <h2>O que não oferecemos atualmente</h2>

        <p>
          A WKORA DIGITAL trabalha atualmente com sites, SaaS e marketing.
          Serviços que não estejam oficialmente disponibilizados não devem
          ser considerados parte da nossa oferta.
        </p>

        <p>
          Aplicativos estão em desenvolvimento e serão disponibilizados
          somente quando essa modalidade estiver oficialmente habilitada.
        </p>
      </section>

      <footer className="flow-footer">
        <div>
          <strong>WKORA DIGITAL</strong>
          <span>Soluções digitais.</span>
        </div>

        <button onClick={() => setScreen("privacy")}>
          Política de Privacidade
        </button>
      </footer>
    </main>
  );
                }
