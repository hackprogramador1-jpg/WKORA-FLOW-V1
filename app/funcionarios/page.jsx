"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../../lib/firebase";

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
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(e) {
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

    try {
      setCarregando(true);

      const credencial =
        await createUserWithEmailAndPassword(
          auth,
          email,
          senha
        );

      const usuario = credencial.user;

      await sendEmailVerification(usuario);

      await setDoc(
        doc(db, "funcionarios", usuario.uid),
        {
          uid: usuario.uid,

          nome: nome.trim(),

          email: email.trim().toLowerCase(),

          telefone: telefone.trim(),

          cargoSolicitado: cargo,

          cargo: "pendente",

          status: "pendente",

          emailVerificado: false,

          criadoEm: serverTimestamp(),

          atualizadoEm: serverTimestamp(),
        }
      );

      setMensagem(
        "Conta criada com sucesso. Verifique seu e-mail. Seu acesso aos setores internos ficará pendente de aprovação."
      );

      setNome("");
      setEmail("");
      setTelefone("");
      setSenha("");
      setConfirmarSenha("");
      setCargo("");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setMensagem("Este e-mail já possui uma conta.");
      } else if (error.code === "auth/invalid-email") {
        setMensagem("O e-mail informado é inválido.");
      } else if (error.code === "auth/weak-password") {
        setMensagem("A senha é muito fraca.");
      } else {
        setMensagem(
          "Não foi possível criar a conta. Tente novamente."
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  async function entrar(e) {
    e.preventDefault();

    setMensagem("");

    if (!email || !senha) {
      setMensagem("Informe seu e-mail e sua senha.");
      return;
    }

    try {
      setCarregando(true);

      const credencial =
        await signInWithEmailAndPassword(
          auth,
          email,
          senha
        );

      const usuario = credencial.user;

      const perfilRef = doc(
        db,
        "funcionarios",
        usuario.uid
      );

      const perfilSnap = await getDoc(perfilRef);

      if (!perfilSnap.exists()) {
        setMensagem(
          "Sua conta existe, mas o perfil interno ainda não foi criado."
        );
        return;
      }

      const perfil = perfilSnap.data();

      if (perfil.status !== "ativo") {
        setMensagem(
          `Sua conta está com status: ${perfil.status}. Aguarde a aprovação de um responsável.`
        );
        return;
      }

      setMensagem(
        `Login realizado. Cargo: ${perfil.cargo}`
      );
    } catch (error) {
      console.error(error);

      if (error.code === "auth/invalid-credential") {
        setMensagem(
          "E-mail ou senha incorretos."
        );
      } else if (error.code === "auth/user-not-found") {
        setMensagem(
          "Conta não encontrada."
        );
      } else {
        setMensagem(
          "Não foi possível realizar o login."
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="employee-page">
      <div className="employee-card">

        <div className="employee-brand">
          <div className="employee-logo">
            W
          </div>

          <div>
            <strong>WKORA FLOW</strong>
            <span>Painel interno</span>
          </div>
        </div>

        <div className="employee-heading">

          <span className="employee-badge">
            ÁREA INTERNA
          </span>

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

          <form
            onSubmit={entrar}
            className="employee-form"
          >

            <label>
              E-mail profissional

              <input
                type="email"
                placeholder="seuemail@empresa.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </label>

            <label>
              Senha

              <input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
              />
            </label>

            <button
              className="employee-submit"
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? "Entrando..."
                : "Entrar no painel"}
            </button>

          </form>

        ) : (

          <form
            onSubmit={cadastrar}
            className="employee-form"
          >

            <label>
              Nome completo

              <input
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
              />
            </label>

            <label>
              E-mail profissional

              <input
                type="email"
                placeholder="seuemail@empresa.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </label>

            <label>
              Telefone

              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) =>
                  setTelefone(e.target.value)
                }
              />
            </label>

            <label>
              Cargo solicitado

              <select
                value={cargo}
                onChange={(e) =>
                  setCargo(e.target.value)
                }
              >

                <option value="">
                  Selecione seu cargo
                </option>

                {cargos.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
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
                onChange={(e) =>
                  setSenha(e.target.value)
                }
              />
            </label>

            <label>
              Confirmar senha

              <input
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) =>
                  setConfirmarSenha(e.target.value)
                }
              />
            </label>

            <div className="employee-security">

              <strong>
                🔐 Conta protegida
              </strong>

              <p>
                O cargo escolhido será registrado como
                solicitação. O acesso oficial será liberado
                somente após autorização interna.
              </p>

            </div>

            <button
              className="employee-submit"
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? "Criando conta..."
                : "Criar conta"}
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
