const STORE_KEY = "wkora_flow_requests";

export function getRequests() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem(STORE_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function createRequest({
  service,
  customer,
  answers
}) {
  const requests = getRequests();

  const request = {
    id: `WK-${Date.now()}`,
    createdAt: new Date().toISOString(),

    service: {
      type: service,
      name:
        service === "site"
          ? "Desenvolvimento de Site"
          : service === "saas"
            ? "Desenvolvimento de SaaS"
            : "Marketing"
    },

    customer: {
      name: customer.name || "",
      company: customer.company || "",
      contact: customer.contact || ""
    },

    answers: answers || {},

    status: "nova",

    proposal: {
      value: null,
      deadline: null,
      notes: ""
    },

    internal: {
      assignedTo: null,
      notes: ""
    }
  };

  const updated = [request, ...requests];

  localStorage.setItem(
    STORE_KEY,
    JSON.stringify(updated)
  );

  return request;
}

export function updateRequest(id, changes) {
  const requests = getRequests();

  const updated = requests.map((request) => {
    if (request.id !== id) {
      return request;
    }

    return {
      ...request,
      ...changes
    };
  });

  localStorage.setItem(
    STORE_KEY,
    JSON.stringify(updated)
  );

  return updated.find((request) => request.id === id) || null;
}
