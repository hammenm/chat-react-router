import { useState } from "react";
import { signin } from "@/lib/api.js";

export default function useSignin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (credentials, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await signin(credentials);

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
