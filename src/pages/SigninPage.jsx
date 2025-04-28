import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthContext from "@/context/AuthContext.js";
import useSignin from "@/hooks/auth/useSignin.js";

export default function SigninPage() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, isError, error, mutate } = useSignin();

  const onSuccess = (data) => {
    setAuth(data);
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) return;
    if (isLoading) return;

    mutate({ email, password }, { onSuccess });
  };

  return (
    <main className="flex flex-col h-full w-full bg-gray-200 dark:bg-gray-800">
      <div className="flex flex-1 overflow-y-auto">
        <div className="flex-1" />
        <div className="items-center justify-center w-1/2 p-4 m-auto">
          <div className="w-full space-y-4 p-4 rounded-lg bg-gray-300 dark:bg-gray-700">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                disabled={isLoading}
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 p-2 rounded-lg text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="password">Password</label>
              <input
                disabled={isLoading}
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                className="border border-gray-300 p-2 rounded-lg text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {isError && (
                <div className="bg-red-500 text-white p-4">
                  {error?.message}
                </div>
              )}
              <button
                disabled={isLoading}
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-500 disabled:hover:bg-gray-500"
              >
                {isLoading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                Sign in
              </button>
            </form>
            <Link to="/auth/login">
              <span className="hover:underline">
                Already have an account? Login
              </span>
            </Link>
          </div>
        </div>
        <div className="flex-1" />
      </div>
    </main>
  );
}
