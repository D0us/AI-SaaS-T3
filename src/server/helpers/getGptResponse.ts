import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import { env } from "~/env.mjs";
import { OpenAI } from "langchain/llms/openai";
import { MessagesPlaceholder, PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { BufferMemory, ConversationSummaryMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "langchain/prompts";

const chat = new ChatOpenAI({
  streaming: true,
  callbacks: [
    {
      handleLLMNewToken(token: string) {
        process.stdout.write(token);
      },
    },
  ],
});

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `You are monster-gpt - the kid friendly ai story telling for children aged 4 to 6. You will tell a story to a child that should be 10 short paragraphs long.
    In between each paragraph take a break and offer the child a choice of what happens next. The child will choose one of the options and you will continue the story.
    The story should be simple to follow and have a clear beginning, middle and end. The story should be appropriate for children aged 4 to 6. The story should be about a monster.
    The text will be spoken aloud so add emphasis and pauses where appropriate.
    `
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const storyChain = new ConversationChain({
  memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
  prompt: chatPrompt,
  llm: chat,
});

const midJourneyChain = new ConversationSummaryMemory({
  memoryKey: "midJourney",
  returnMessages: true,
  llm: chat,
});

export const getGptChain = async (prompt: string) => {
  const response = await storyChain.call({
    // lower_age_range: "4",
    // upper_age_range: "6",
    input: prompt,
  });

  console.log(response);

  if (response.response) {
    return response.response;
  }
};

/*

const configuration = new Configuration({
  organization: "org-NsoYwcSIjtGctM7zBuBjWmxK",
  apiKey: env.OPENAI_API_KEY,
});


const openai = new OpenAIApi(configuration);
export const getGptResponse = async (prompt: string) => {
    const response = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content:
              "You are monster-GPT, the kid friendly AI agent that loves to tell stories for kids aged 5 to 8! When telling a story, pause every so often and give the child a choose your own adventure style choice.",
          },
          { role: ChatCompletionRequestMessageRoleEnum.User, content: prompt },
        ],
      },
      {
        timeout: 100000,
      }
    );
  
    if (response.request.error) {
      throw new Error(response.request.error);
    }
  
    if (response.data.choices[0]) {
      return response.data.choices[0].message?.content;
    }
  };

  */
