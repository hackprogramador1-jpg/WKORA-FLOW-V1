"use client";

import { useState } from "react";

import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../../../lib/firebase";

export default function FuncionariosLoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(event) {
    event.preventDefault();

    setErro("");
    setMensagem("");

    if (!email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }

    if (!senha) {
      setErro("Informe sua senha.");
      return;
    }

    setCarregando(true);

    try {
      const credencial =
        await signInWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          senha
        );

      const usuario = credencial.user;

      if (!usuario.emailVerified) {
        await sendEmailVerification(usuario);
        await signOut(auth);

        setErro(
          "Seu e-mail ainda não foi verificado. Enviamos um novo link de verificação para seu e-mail."
        );

        return;
      }

      const referencia = doc(
        db,
        "funcionarios",
        usuario.uid
      );

      const snapshot = await getDoc(referencia);

      if (!snapshot.exists()) {
        await signOut(auth);

        setErro(
          "Sua conta de funcionário não possui um perfil cadastrado."
        );

        return;
      }

      const funcionario = snapshot.data();

      if (funcionario.status !== "aprovado") {
        await signOut(auth);

        setErro(
          "Sua conta ainda está aguardando aprovação de um responsável da WKORA DIGITAL."
        );

        return;
      }

      if (
        !funcionario.cargo ||
        funcionario.cargo === "pendente"
      ) {
        await signOut(auth);

        setErro(
          "Seu cargo ainda não foi definido por um responsável."
        );

        return;
      }

      setMensagem(
        `Login autorizado. Cargo: ${funcionario.cargo}.`
      );

      await signOut(auth);

    } catch (error) {
      console.error(error);

      if (
        error.code === "auth/invalid-credential"
      ) {
        setErro("E-mail ou senha incorretos.");
      } else if (
        error.code === "auth/user-not-found"
      ) {
        setErro(
          "Não encontramos uma conta com este e-mail."
        );
      } else if (
        error.code === "auth/wrong-password"
      ) {
        setErro("Senha incorreta.");
      } else if (
        error.code === "auth/too-many-requests"
      ) {
        setErro(
          "Muitas tentativas. Aguarde alguns minutos e tente novamente."
        );
      } else if (
        error.code === "auth/network-request-failed"
      ) {
        setErro(
          "Não foi possível conectar ao Firebase. Verifique sua internet."
        );
      } else {
        setErro(
          "Não foi possível realizar o login. Tente novamente."
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

        <h1>Entrar</h1>

        <p className="funcionarios-description">
          Acesse sua conta de funcionário da
          WKORA DIGITAL.
        </p>

        <div className="funcionarios-tabs">

          <button
            type="button"
            className="active"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/funcionarios";
            }}
          >
            Criar conta
          </button>

        </div>

        <form onSubmit={entrar}>

          <label>
            E-mail profissional
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="seuemail@empresa.com"
            autoComplete="email"
          />

          <label>
            Senha
          </label>

          <input
            type="password"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            placeholder="Digite sua senha"
            autoComplete="current-password"
          />

          <div className="security-box">
            <strong>🔐 Acesso protegido</strong>

            <p>
              O acesso depende da verificação do
              e-mail e da aprovação do funcionário
              por um responsável autorizado.
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
              ? "Verificando..."
              : "Entrar"}
          </button>

        </form>

        <footer>
          WKORA DIGITAL • Sistema interno
        </footer>

      </section>
    </main>
  );
  }
