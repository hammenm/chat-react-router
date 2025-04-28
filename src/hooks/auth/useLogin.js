import { useState } from "react";
import { login } from "@/lib/api.js";

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (credentials, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await login(credentials);

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, isError: !!error, error };
}
