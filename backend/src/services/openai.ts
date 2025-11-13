import OpenAI from 'openai';
import { config } from '../config/env';
import { ChatMessage, GeneratedTopic } from '../types';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export const generateTopics = async (
  courseName: string,
  focusArea: string,
  topicsPerDay: number,
  numberOfDays: number = 30
): Promise<GeneratedTopic[]> => {
  const totalTopics = topicsPerDay * numberOfDays;

  const prompt = `You are an expert curriculum designer creating micro-learning content. Generate ${totalTopics} detailed micro-learning topics for a course on "${courseName}".

Focus Area: ${focusArea}

Requirements:
1. Each topic should be learnable in 15-30 minutes
2. Topics should be clear, specific, and activity-oriented
3. Progress from beginner to intermediate/advanced concepts
4. Make learning easy and understandable
5. Each topic should build on previous ones logically

For each topic, provide:
- title: A clear, concise title
- description: A 1-2 sentence description of what will be learned
- content: Detailed explanation (300-500 words) with examples, analogies, and practical applications
- sources: 2-3 relevant URLs for further reading (can be documentation, articles, tutorials)

Return a JSON array of topics with this exact structure:
[
  {
    "title": "Topic Title",
    "description": "Brief description",
    "content": "Detailed content...",
    "sources": ["url1", "url2"],
    "order": 1
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or markdown formatting.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert curriculum designer. Always respond with valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content || '';

    // Remove markdown code blocks if present
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const topics = JSON.parse(cleanedContent);
    return topics;
  } catch (error) {
    console.error('Error generating topics:', error);
    throw new Error('Failed to generate topics');
  }
};

export const chatWithAI = async (
  topicContent: string,
  messages: ChatMessage[]
): Promise<ChatMessage> => {
  try {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are a helpful learning assistant. The student is learning about the following topic:

${topicContent}

Help them understand the topic better by:
1. Answering questions clearly and concisely
2. Providing examples and analogies
3. Breaking down complex concepts
4. Encouraging critical thinking
5. Being patient and supportive

Keep responses concise (2-3 paragraphs max) unless asked for more detail.`,
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
    };

    return assistantMessage;
  } catch (error) {
    console.error('Error in AI chat:', error);
    throw new Error('Failed to get AI response');
  }
};

export const generateGameContent = async (
  topicTitle: string,
  topicContent: string
): Promise<string> => {
  const prompt = `Create a simple, educational 2D game in HTML5 that teaches the concept: "${topicTitle}".

Topic content: ${topicContent}

Create a complete, self-contained HTML file that includes:
1. HTML structure
2. CSS styling (make it colorful and engaging)
3. JavaScript game logic using Canvas or DOM elements
4. The game should:
   - Be interactive and fun
   - Reinforce the learning concept
   - Have clear instructions
   - Track score or progress
   - Be playable immediately

Return ONLY the complete HTML code, no explanations or markdown formatting.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert game developer. Return only valid HTML code, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    let gameHtml = completion.choices[0]?.message?.content || '';

    // Remove markdown code blocks if present
    gameHtml = gameHtml
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return gameHtml;
  } catch (error) {
    console.error('Error generating game:', error);
    throw new Error('Failed to generate game');
  }
};

export const convertToAudio = async (content: string): Promise<string> => {
  // This would integrate with text-to-speech APIs
  // For now, return a placeholder
  return 'Audio generation not yet implemented. Integrate with services like ElevenLabs, Amazon Polly, or Google TTS.';
};

export const convertToPodcast = async (content: string): Promise<string> => {
  // This would create a podcast-style narration
  return 'Podcast generation not yet implemented. This would create a conversational-style audio.';
};

export const convertToVideo = async (
  topicTitle: string,
  content: string
): Promise<string> => {
  // This would integrate with video generation APIs
  return 'Video generation not yet implemented. Integrate with services like D-ID, Synthesia, or create slideshows with narration.';
};

export const convertToComic = async (
  topicTitle: string,
  content: string
): Promise<{ panels: string[] }> => {
  // This would generate comic panels using image generation APIs
  return {
    panels: ['Comic generation not yet implemented. Integrate with DALL-E or Midjourney APIs.'],
  };
};

export const buildCustomFeature = async (
  topicContent: string,
  description: string
): Promise<string> => {
  const prompt = `Create a custom interactive learning feature based on this description: "${description}"

Topic content: ${topicContent}

Create a complete, self-contained HTML file with inline CSS and JavaScript that implements this custom feature.
Make it interactive, educational, and visually appealing.

Return ONLY the complete HTML code, no explanations or markdown formatting.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert web developer. Return only valid HTML code, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    let html = completion.choices[0]?.message?.content || '';

    // Remove markdown code blocks if present
    html = html
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return html;
  } catch (error) {
    console.error('Error building custom feature:', error);
    throw new Error('Failed to build custom feature');
  }
};
