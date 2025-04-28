const key = "auth";

export function loadAuthCache() {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }

  return {
    user: null,
    token: null,
  };
}

export function saveAuthCache(data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function removeAuthCache() {
  localStorage.removeItem(key);
}
