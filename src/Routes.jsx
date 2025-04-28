import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SigninPage from "./pages/SigninPage";
import ConversationPage from "./pages/ConversationPage";
import NotFound from "./pages/NotFound.jsx";

import AuthContext from "@/context/AuthContext";
import { getConversations } from "@/lib/api.js";
import {
  loadAuthCache,
  saveAuthCache,
  removeAuthCache,
} from "@/lib/authCache.js";

export default function AppRoutes() {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => loadAuthCache());

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!auth.user;

  useEffect(() => {
    setLoading(true);
    setError(null);
    getConversations(auth.token)
      .then((conversations) => {
        setConversations(conversations);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  }, [auth.token]);

  const handleCreateConversation = (conversation) => {
    setConversations([...conversations, conversation]);
    navigate(`/conversations/${conversation.id}`);
  };

  const dashboardElement = (
    <Dashboard conversations={conversations} loading={loading} error={error} />
  );
  const homeElement = <Home onCreateConversation={handleCreateConversation} />;

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        setAuth: (auth) => {
          setAuth(auth);
          saveAuthCache(auth);
        },
        isAuthenticated,
        logout: () => {
          setAuth({ user: null, token: null });
          removeAuthCache();
        },
      }}
    >
      <Routes>
        <Route path="/" element={dashboardElement}>
          <Route index element={homeElement} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signin" element={<SigninPage />} />
          <Route
            path="/conversations/:conversationId"
            element={<ConversationPage />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}
