import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export async function createRequest({
  service,
  customer,
  answers,
}) {
  const request = {
    service: {
      type: service,
      name:
        service === "site"
          ? "Desenvolvimento de Site"
          : service === "saas"
            ? "Desenvolvimento de SaaS"
            : "Marketing",
    },

    customer: {
      name: customer?.name || "",
      company: customer?.company || "",
      contact: customer?.contact || "",
    },

    answers: answers || {},

    status: "nova",

    createdAt: serverTimestamp(),
  };

  const referencia = await addDoc(
    collection(db, "solicitacoes"),
    request
  );

  return {
    id: referencia.id,
    ...request,
  };
}
