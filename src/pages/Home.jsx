import { useContext, useState } from "react";
import FormInput from "@/components/FormInput.jsx";
import AuthContext from "@/context/AuthContext.js";
import { createConversation } from "@/lib/api.js";

export default function Home({ onCreateConversation }) {
  const { token } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);
    setError(null);
    createConversation(text, token)
      .then((conversation) => {
        onCreateConversation(conversation);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setDisabled(false);
      });
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="bg-red-500 text-white p-4 mb-4">{error.message}</div>
        )}
      </div>
      <FormInput
        disabled={disabled}
        handleSubmit={handleSubmit}
        text={text}
        handleTextChange={setText}
      />
    </>
  );
}
