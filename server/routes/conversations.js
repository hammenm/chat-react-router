import { Router } from "express";
import { getAuthUser } from "./lib/auth.js";
import prisma from "./lib/db.js";
import { askGPT } from "./lib/gpt.js";

const router = Router();

router.get("/", async (req, res) => {
  const userAuth = await getAuthUser(req);

  const where = userAuth
    ? { userId: userAuth.id }
    : {
        user: {
          is: null,
        },
      };

  const conversations = await prisma.conversation
    .findMany({
      where,
      include: {
        messages: {
          orderBy: {
            timestamp: "asc",
          },
          take: 1,
          select: {
            content: true,
          },
        },
      },
    })
    .then((conversations) =>
      conversations.map(({ messages, ...conversation }) => ({
        ...conversation,
        firstMessage: messages[0]?.content,
      })),
    );

  res.json(conversations);
});

router.post("/", async (req, res) => {
  const timestamp = new Date();
  const userAuth = await getAuthUser(req);
  const { message: content } = req.body;

  const messageGPT = await askGPT([
    {
      role: "user",
      content,
    },
  ]);

  const conversation = await prisma.conversation.create({
    data: {
      userId: userAuth?.id,
      messages: {
        create: [
          {
            role: "user",
            content,
            timestamp,
          },
          messageGPT,
        ],
      },
    },
    include: {
      messages: {
        select: {
          id: true,
          content: true,
          role: true,
          timestamp: true,
        },
      },
    },
  });

  const conversationUpdated = {
    ...conversation,
    firstMessage: content,
  };

  res.status(201).json(conversationUpdated);
});

function throwErrorConversation() {
  const error = new Error("Conversation not found!");
  error.status = 404;
  throw error;
}

router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: Number(conversationId),
    },
    include: {
      messages: {
        select: {
          id: true,
          content: true,
          role: true,
          timestamp: true,
        },
      },
    },
  });

  if (!conversation) {
    throwErrorConversation();
  }

  // Case when the conversation exists and it's owned by a user
  if (conversation && conversation.userId !== null) {
    const userAuth = await getAuthUser(req);

    // Check that the request is authenticated
    // And that the conversation is owned by the user doing the request
    if (!userAuth || conversation.userId !== userAuth.id) {
      throwErrorConversation();
    }
  }

  res.status(200).json(conversation);
});

router.post("/:conversationId", async (req, res) => {
  const timestamp = new Date();
  const { conversationId } = req.params;

  // Check if conversation exists
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: Number(conversationId),
    },
    include: {
      messages: {
        select: {
          content: true,
          role: true,
        },
      },
    },
  });

  if (!conversation) {
    throwErrorConversation();
  }

  // Check if conversation is owned by user
  if (conversation.userId !== null) {
    const userAuth = await getAuthUser(req);

    // Check that the request is authenticated
    // And that the conversation is owned by the user doing the request
    if (!userAuth || conversation.userId !== userAuth.id) {
      throwErrorConversation();
    }
  }

  const { message: content } = req.body;

  const messageGPT = await askGPT([
    ...conversation.messages,
    {
      role: "user",
      content,
    },
  ]);

  const conversationUpdated = await prisma.conversation.update({
    where: {
      id: conversation.id,
    },
    data: {
      messages: {
        create: [
          {
            role: "user",
            content,
            timestamp,
          },
          messageGPT,
        ],
      },
    },
    include: {
      messages: {
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          content: true,
          role: true,
          timestamp: true,
        },
        take: 2,
      },
    },
  });

  // Reverse messages order
  conversationUpdated.messages.reverse();

  res.json({ messages: conversationUpdated.messages });
});

export default router;
