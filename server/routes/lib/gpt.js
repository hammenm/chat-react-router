export const askGPT = (messages, config = {}) => {
  return Promise.resolve({
    role: "assistant",
    content: "Hello, I am a bot.",
  });
};
