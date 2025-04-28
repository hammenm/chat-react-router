import { Outlet } from "react-router";
import NavBar from "@/components/NavBar";

export default function Dashboard({ conversations, loading, error }) {
  return (
    <div className="flex h-screen w-screen text-gray-800 dark:text-gray-200">
      <NavBar conversations={conversations} loading={loading} error={error} />
      <main className="flex flex-col h-full w-full bg-gray-200 dark:bg-gray-800">
        <Outlet />
      </main>
    </div>
  );
}
