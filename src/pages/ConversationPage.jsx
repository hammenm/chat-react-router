import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Message from "@/components/Message";
import MessageLoading from "@/components/MessageLoading";
import FormInput from "@/components/FormInput.jsx";

import AuthContext from "@/context/AuthContext.js";
import { getConversation, replyConversation } from "@/lib/api.js";

export default function ConversationPage() {
  const { conversationId } = useParams();
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [errorInit, setErrorInit] = useState(null);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [errorResponse, setErrorResponse] = useState(null);

  useEffect(() => {
    setLoadingInit(true);
    setErrorInit(null);
    getConversation(conversationId, token)
      .then((conversation) => {
        setMessages(conversation.messages);
      })
      .catch((error) => {
        setErrorInit(error.message);
      })
      .finally(() => setLoadingInit(false));
  }, [conversationId]);

  const disabledForm = loadingResponse || !!errorResponse;
  const onSubmit = (e) => {
    e.preventDefault();
    replyConversation(conversationId, message, token)
      .then((conversation) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          ...conversation.messages,
        ]);
        setMessage("");
      })
      .catch((err) => {
        setErrorResponse(err);
      })
      .finally(() => setLoadingResponse(false));
  };

  return (
    <main className="flex flex-col h-full w-full bg-gray-200 dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto">
        {loadingInit && <p>Loading...</p>}
        {errorInit && <p className="text-red-500">Error: {errorInit}</p>}
        {messages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            role={message.role}
          />
        ))}
        {loadingResponse && <MessageLoading />}
        {errorResponse && (
          <Message
            role="assistant"
            content={`Error: ${errorResponse.message}`}
          />
        )}
      </div>
      <FormInput
        disabled={disabledForm}
        handleSubmit={onSubmit}
        text={message}
        handleTextChange={setMessage}
      />
    </main>
  );
}
