// Internal function for GET and POST
async function fetchGet(endpoint, token) {
  const url = `${import.meta.env.VITE_SERVER_URL}${endpoint}`;
  const response = await fetch(url, {
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  });
  if (!response.ok) {
    throw new Error("failed to fetch.");
  }
  return response.json();
}

async function fetchPost(endpoint, body, token) {
  const url = `${import.meta.env.VITE_SERVER_URL}${endpoint}`;
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, params);
  if (!response.ok) {
    throw new Error("failed to fetch.");
  }
  return response.json();
}

// Function for fetch with error message
async function fetchGetSafe(endpoint, errorMessage, token) {
  return fetchGet(endpoint, token).catch(() => {
    throw new Error(errorMessage);
  });
}

async function fetchPostSafe(endpoint, body, errorMessage, token) {
  return fetchPost(endpoint, body, token).catch(() => {
    throw new Error(errorMessage);
  });
}

// Exported function, used in the application
export async function getConversations(token) {
  return fetchGetSafe("/conversations", "Failed to fetch conversations", token);
}

export async function createConversation(message, token) {
  const errorMessage = "Failed to create conversation";
  return fetchPostSafe("/conversations", { message }, errorMessage, token);
}

export async function getConversation(conversationId, token) {
  const endpoint = `/conversations/${conversationId}`;
  const errorMessage = `Failed to get conversation ${conversationId}`;
  return fetchGetSafe(endpoint, errorMessage, token);
}

export async function replyConversation(conversationId, message, token) {
  const endpoint = `/conversations/${conversationId}`;
  const errorMessage = `Failed to get reply to conversation ${conversationId}`;
  return fetchPostSafe(endpoint, { message }, errorMessage, token);
}

export async function login({ email, password }) {
  return fetchPostSafe("/auth/login", { email, password }, "Failed to login");
}

export async function signin({ email, password }) {
  const errorMessage = "Failed to sign in";
  return fetchPostSafe("/auth/signin", { email, password }, errorMessage);
}
