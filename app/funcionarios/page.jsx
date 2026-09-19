"use client";

import { useState } from "react";

const cargos = [
  {
    id: "atendimento",
    nome: "Atendimento",
    descricao: "Solicitações, clientes e acompanhamento.",
  },
  {
    id: "suporte",
    nome: "Suporte",
    descricao: "Suporte aos clientes e pós-entrega.",
  },
  {
    id: "desenvolvedor",
    nome: "Desenvolvedor",
    descricao: "Projetos, sistemas e desenvolvimento.",
  },
  {
    id: "financeiro",
    nome: "Financeiro",
    descricao: "Propostas, valores e informações financeiras.",
  },
  {
    id: "diretor",
    nome: "Diretor",
    descricao: "Gestão operacional e administrativa.",
  },
  {
    id: "ceo",
    nome: "CEO",
    descricao: "Administração máxima da organização.",
  },
];

export default function FuncionariosPage() {
  const [modo, setModo] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [mensagem, setMensagem] = useState("");

  function cadastrar(e) {
    e.preventDefault();
    setMensagem("");

    if (
      !nome ||
      !email ||
      !telefone ||
      !senha ||
      !confirmarSenha ||
      !cargo
    ) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    if (senha.length < 8) {
      setMensagem("A senha deve possuir pelo menos 8 caracteres.");
      return;
    }

    setMensagem(
      "Cadastro recebido. Na próxima etapa vamos conectar este cadastro à autenticação segura."
    );
  }

  function entrar(e) {
    e.preventDefault();
    setMensagem("");

    if (!email || !senha) {
      setMensagem("Informe seu e-mail e sua senha.");
      return;
    }

    setMensagem(
      "Login preparado. Na próxima etapa vamos conectar a autenticação real."
    );
  }

  return (
    <main className="employee-page">
      <div className="employee-card">
        <div className="employee-brand">
          <div className="employee-logo">W</div>

          <div>
            <strong>WKORA FLOW</strong>
            <span>Painel interno</span>
          </div>
        </div>

        <div className="employee-heading">
          <span className="employee-badge">ÁREA INTERNA</span>

          <h1>
            {modo === "login"
              ? "Acesso dos funcionários"
              : "Criar conta de funcionário"}
          </h1>

          <p>
            Acesso controlado aos setores internos da WKORA DIGITAL.
          </p>
        </div>

        <div className="employee-switch">
          <button
            type="button"
            className={modo === "login" ? "active" : ""}
            onClick={() => {
              setModo("login");
              setMensagem("");
            }}
          >
            Entrar
          </button>

          <button
            type="button"
            className={modo === "cadastro" ? "active" : ""}
            onClick={() => {
              setModo("cadastro");
              setMensagem("");
            }}
          >
            Criar conta
          </button>
        </div>

        {modo === "login" ? (
          <form onSubmit={entrar} className="employee-form">
            <label>
              E-mail profissional
              <input
                type="email"
                placeholder="seuemail@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </label>

            <button className="employee-submit" type="submit">
              Entrar no painel
            </button>
          </form>
        ) : (
          <form onSubmit={cadastrar} className="employee-form">
            <label>
              Nome completo
              <input
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </label>

            <label>
              E-mail profissional
              <input
                type="email"
                placeholder="seuemail@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Telefone
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </label>

            <label>
              Cargo
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              >
                <option value="">Selecione seu cargo</option>

                {cargos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Senha
              <input
                type="password"
                placeholder="Mínimo de 8 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </label>

            <label>
              Confirmar senha
              <input
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </label>

            <div className="employee-security">
              <strong>🔐 Segurança</strong>
              <p>
                As contas internas deverão passar por autenticação e
                autorização antes de receber acesso aos setores da empresa.
              </p>
            </div>

            <button className="employee-submit" type="submit">
              Criar conta
            </button>
          </form>
        )}

        {mensagem && (
          <div className="employee-message">
            {mensagem}
          </div>
        )}

        <footer className="employee-footer">
          WKORA DIGITAL • Sistema interno
        </footer>
      </div>
    </main>
  );
            }
