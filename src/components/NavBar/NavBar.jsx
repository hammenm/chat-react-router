import { useContext } from "react";
import { Link } from "react-router";
import AuthContext from "@/context/AuthContext.js";
import ConversationItem from "./ConversationItem.jsx";

export default function NavBar({ conversations, loading, error }) {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="flex flex-col bg-gray-100 dark:bg-gray-900 w-[260px] overflow-y-auto">
      <h1 className="text-2xl font-bold p-4">
        <Link to="/">mewoGPT</Link>
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && conversations.length === 0 && (
        <p>No conversations yet</p>
      )}
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <ConversationItem
              className="flex p-3 items-center gap-3 rounded-md break-all pr-14"
              conversation={conversation}
            />
          </li>
        ))}
      </ul>
      {/* Spacer */}
      <div className="flex-1" />
      <div className="p-4">
        {isAuthenticated ? (
          <button className="cursor-pointer" onClick={() => logout()}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/auth/login">Login</Link>
            <span className="mx-2">/</span>
            <Link to="/auth/signin">Sign in</Link>
          </>
        )}
      </div>
    </nav>
  );
}
