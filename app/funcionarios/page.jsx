"use client";

import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../../lib/firebase";

const CARGOS = [
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
    id: "CEO",
    nome: "CEO",
    descricao: "Administração máxima da organização.",
  },
];

export default function FuncionariosPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargoSolicitado, setCargoSolicitado] = useState("atendimento");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function criarConta(event) {
    event.preventDefault();

    setMensagem("");
    setErro("");

    if (!nome.trim()) {
      setErro("Informe seu nome completo.");
      return;
    }

    if (!email.trim()) {
      setErro("Informe seu e-mail profissional.");
      return;
    }

    if (!telefone.trim()) {
      setErro("Informe seu telefone.");
      return;
    }

    if (!senha || senha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não são iguais.");
      return;
    }

    setCarregando(true);

    try {
      const credencial =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );

      const usuario = credencial.user;

      await setDoc(
        doc(db, "funcionarios", usuario.uid),
        {
          uid: usuario.uid,

          nome: nome.trim(),

          email: email.trim().toLowerCase(),

          telefone: telefone.trim(),

          cargoSolicitado,

          // O cargo oficial NÃO é concedido automaticamente.
          // Um responsável deverá aprovar a conta.
          cargo: "pendente",

          status: "pendente",

          emailVerificado: false,

          criadoEm: serverTimestamp(),

          atualizadoEm: serverTimestamp(),
        }
      );

      await sendEmailVerification(usuario);

      await signOut(auth);

      setMensagem(
        "Conta criada com sucesso. Enviamos um e-mail de verificação. Após a verificação, sua conta ficará aguardando aprovação de um responsável da WKORA DIGITAL."
      );

      setNome("");
      setEmail("");
      setTelefone("");
      setCargoSolicitado("atendimento");
      setSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setErro("Este e-mail já possui uma conta.");
      } else if (error.code === "auth/invalid-email") {
        setErro("O e-mail informado não é válido.");
      } else if (error.code === "auth/weak-password") {
        setErro("A senha é muito fraca.");
      } else if (error.code === "permission-denied") {
        setErro(
          "O Firebase bloqueou o cadastro no Firestore. Precisamos configurar as regras de segurança."
        );
      } else {
        setErro(
          "Não foi possível criar a conta. Verifique a configuração do Firebase."
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="funcionarios-page">
      <section className="funcionarios-card">

        <div className="funcionarios-brand">
          <strong>WKORA</strong>
          <span> FLOW</span>
        </div>

        <div className="funcionarios-badge">
          ÁREA INTERNA
        </div>

        <h1>Criar conta de funcionário</h1>

        <p className="funcionarios-description">
          Acesso controlado aos setores internos da WKORA DIGITAL.
        </p>

        <div className="funcionarios-tabs">
          <button type="button">
            Entrar
          </button>

          <button
            type="button"
            className="active"
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={criarConta}>

          <label>
            Nome completo
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome completo"
            autoComplete="name"
          />

          <label>
            E-mail profissional
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@empresa.com"
            autoComplete="email"
          />

          <label>
            Telefone
          </label>

          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
            autoComplete="tel"
          />

          <label>
            Cargo solicitado
          </label>

          <select
            value={cargoSolicitado}
            onChange={(e) =>
              setCargoSolicitado(e.target.value)
            }
          >
            {CARGOS.map((cargo) => (
              <option
                key={cargo.id}
                value={cargo.id}
              >
                {cargo.nome}
              </option>
            ))}
          </select>

          <p className="cargo-description">
            {
              CARGOS.find(
                (cargo) =>
                  cargo.id === cargoSolicitado
              )?.descricao
            }
          </p>

          <label>
            Senha
          </label>

          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo de 8 caracteres"
            autoComplete="new-password"
          />

          <label>
            Confirmar senha
          </label>

          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) =>
              setConfirmarSenha(e.target.value)
            }
            placeholder="Digite a senha novamente"
            autoComplete="new-password"
          />

          <div className="security-box">
            <strong>🔐 Segurança</strong>

            <p>
              A conta será criada como pendente.
              O cargo solicitado será analisado e
              aprovado por um responsável autorizado.
            </p>
          </div>

          {erro && (
            <div className="error-message">
              {erro}
            </div>
          )}

          {mensagem && (
            <div className="success-message">
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="create-account-button"
          >
            {carregando
              ? "Criando conta..."
              : "Criar conta"}
          </button>

        </form>

        <footer>
          WKORA DIGITAL • Sistema interno
        </footer>

      </section>
    </main>
  );
      }
