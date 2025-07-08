const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../models/chatHistoryModel');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Ask a question to the AI and save history
// @route   POST /api/interview/ask
// @access  Private
const askAI = asyncHandler(async (req, res) => {
  const { question, history } = req.body;
  const userId = req.user.id;

  if (!question) {
    res.status(400);
    throw new Error('Please provide a question');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are the "AI Study Buddy," a friendly, encouraging, and incredibly knowledgeable AI assistant. Your personality is patient, supportive, and a little bit fun, like a helpful friend. Your primary goal is to help a student understand their topics better.

    **Your Core Instructions:**
    1.  **Be Conversational:** Do not just answer questions. Engage the user. Ask follow-up questions.
    2.  **Handle Imperfect Language:** Understand the user's intent even with typos or bad grammar.
    3.  **Maintain Context:** Always remember the previous parts of the conversation.
    4.  **Offer Help Proactively:** Suggest summarizing, quizzing, or simplifying topics.

    **Your First Message:** Start your very first interaction in a new chat with a warm welcome like: "Hey there! I'm your AI Study Buddy. I'm here to help you with any subject. What's on your mind today?"`;
    
    const fullHistory = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Got it! I'm ready to be the best AI Study Buddy ever. Let's help this student succeed!" }] },
        ...(history || [])
    ];

    const chat = model.startChat({
      history: fullHistory,
    });

    const result = await chat.sendMessage(question);
    const response = await result.response;
    const aiAnswer = response.text();

    let chatHistory = await ChatHistory.findOne({ user: userId });
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({ user: userId, conversation: [] });
    }
    chatHistory.conversation.push({ role: 'user', text: question });
    chatHistory.conversation.push({ role: 'ai', text: aiAnswer });
    await chatHistory.save();

    res.status(200).json({ answer: aiAnswer });
  } catch (error) {
    console.error('Error calling Gemini AI or saving chat:', error);
    res.status(500).json({ message: 'Failed to get a response from the AI' });
  }
});


// @desc    Get the user's chat history
// @route   GET /api/interview/history
// @access  Private
const getChatHistory = asyncHandler(async (req, res) => {
  const chatHistory = await ChatHistory.findOne({ user: req.user.id });

  if (chatHistory) {
    res.status(200).json(chatHistory.conversation);
  } else {
    // If no history, return an empty array
    res.status(200).json([]);
  }
});


module.exports = {
  askAI,
  getChatHistory, // <-- We added the new function here
};
