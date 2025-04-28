import { NavLink } from "react-router";

export default function ConversationItem({ conversation }) {
  const className = "flex p-3 items-center gap-3 break-all pr-14";
  const to = `/conversations/${conversation.id}`;

  return (
    <NavLink
      className={({ isActive }) =>
        isActive ? `${className} bg-gray-300 dark:bg-gray-700` : className
      }
      to={to}
    >
      {conversation.firstMessage}
    </NavLink>
  );
}
