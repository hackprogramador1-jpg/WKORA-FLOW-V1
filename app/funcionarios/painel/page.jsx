"use client";

import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../../../lib/firebase";

export default function FuncionariosPainelPage() {
  const [carregando, setCarregando] = useState(true);
  const [funcionario, setFuncionario] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const cancelar = onAuthStateChanged(
      auth,
      async (usuario) => {
        if (!usuario) {
          window.location.href = "/funcionarios/login";
          return;
        }

        try {
          if (!usuario.emailVerified) {
            await signOut(auth);
            window.location.href =
              "/funcionarios/login";
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
            window.location.href =
              "/funcionarios/login";
            return;
          }

          const dados = snapshot.data();

          if (dados.status !== "aprovado") {
            await signOut(auth);
            window.location.href =
              "/funcionarios/login";
            return;
          }

          if (
            !dados.cargo ||
            dados.cargo === "pendente"
          ) {
            await signOut(auth);
            window.location.href =
              "/funcionarios/login";
            return;
          }

          setFuncionario(dados);
          setCarregando(false);

        } catch (error) {
          console.error(error);

          setErro(
            "Não foi possível carregar sua conta."
          );

          setCarregando(false);
        }
      }
    );

    return () => cancelar();
  }, []);

  async function sair() {
    await signOut(auth);

    window.location.href =
      "/funcionarios/login";
  }

  if (carregando) {
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

          <h1>Carregando...</h1>

          <p className="funcionarios-description">
            Verificando sua autorização de acesso.
          </p>
        </section>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="funcionarios-page">
        <section className="funcionarios-card">
          <div className="error-message">
            {erro}
          </div>
        </section>
      </main>
    );
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

        <h1>
          Olá, {funcionario?.nome || "Funcionário"}
        </h1>

        <p className="funcionarios-description">
          Sua conta está autorizada para acessar
          o sistema interno da WKORA DIGITAL.
        </p>

        <div className="security-box">

          <strong>
            🔐 Conta autorizada
          </strong>

          <p>
            Cargo atual:{" "}
            <strong>
              {funcionario?.cargo}
            </strong>
          </p>

        </div>

        <div className="success-message">
          Login realizado com sucesso.
        </div>

        <button
          type="button"
          className="create-account-button"
          onClick={sair}
        >
          Sair da conta
        </button>

        <footer>
          WKORA DIGITAL • Sistema interno
        </footer>

      </section>

    </main>
  );
}
