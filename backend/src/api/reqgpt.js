const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getResponseData = async (promptText) => {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  try {
    const completion = await openai.createChatCompletion({
      model,
      messages: [{ role: "user", content: promptText }],
    });
    return completion.data.choices[0].message.content;
  } catch (error) {
    const apiMessage = error?.response?.data?.error?.message;
    console.error("OpenAI API error:", apiMessage || error.message);
    throw error;
  }
};

module.exports = getResponseData;
