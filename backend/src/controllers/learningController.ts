import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest, ChatMessage } from '../types';
import {
  chatWithAI,
  generateGameContent,
  convertToAudio,
  convertToPodcast,
  convertToVideo,
  convertToComic,
  buildCustomFeature,
} from '../services/openai';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ),
});

export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId } = req.params;
    const { messages } = chatSchema.parse(req.body);

    // Get topic
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { course: true },
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Verify user owns this topic
    if (topic.course.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get AI response
    const assistantMessage = await chatWithAI(topic.content, messages as ChatMessage[]);

    // Save learning session
    await prisma.learningSession.create({
      data: {
        topicId,
        userId: req.userId!,
        mode: 'chat',
        data: { messages: [...messages, assistantMessage] },
      },
    });

    res.json(assistantMessage);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to get AI response' });
  }
};

export const generateGame = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId } = req.params;

    // Get topic
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { course: true },
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Verify user owns this topic
    if (topic.course.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if game already exists
    let conversion = await prisma.mediaConversion.findFirst({
      where: {
        topicId,
        mode: 'game',
        status: 'completed',
      },
    });

    if (!conversion) {
      // Generate game
      const gameHtml = await generateGameContent(topic.title, topic.content);

      // Create a data URL for the game
      const gameDataUrl = `data:text/html;base64,${Buffer.from(gameHtml).toString('base64')}`;

      // Save conversion
      conversion = await prisma.mediaConversion.create({
        data: {
          topicId,
          mode: 'game',
          content: gameHtml,
          url: gameDataUrl,
          status: 'completed',
        },
      });

      // Save learning session
      await prisma.learningSession.create({
        data: {
          topicId,
          userId: req.userId!,
          mode: 'game',
        },
      });
    }

    res.json({ gameHtml: conversion.content, gameUrl: conversion.url });
  } catch (error) {
    console.error('Generate game error:', error);
    res.status(500).json({ message: 'Failed to generate game' });
  }
};

export const generateAudio = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId } = req.params;

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { course: true },
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.course.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const audioUrl = await convertToAudio(topic.content);

    await prisma.learningSession.create({
      data: {
        topicId,
        userId: req.userId!,
        mode: 'audio',
      },
    });

    res.json({ audioUrl });
  } catch (error) {
    console.error('Generate audio error:', error);
    res.status(500).json({ message: 'Failed to generate audio' });
  }
};

export const generatePodcast = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId } = req.params;

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { course: true },
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.course.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const audioUrl = await convertToPodcast(topic.content);

    await prisma.learningSession.create({
      data: {
        topicId,
        userId: req.userId!,
        mode: 'podcast',
      },
    });

    res.json({ audioUrl });
  } catch (error) {
    console.error('Generate podcast error:', error);
    res.status(500).json({ message: 'Failed to generate podcast' });
  }
};

export const generateVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId } = req.params;

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { course: true },
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.course.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const videoUrl = await convertToVideo(topic.title, topic.content);

    await prisma.learningSession.create({
      data: {
        topicId,
        userId: req.userId!,
        mode: 'video',
      },
    });

    res.json({ videoUrl });
  } catch (error) {
    console.error('Generate video error:', error);
    res.status(500).json({ message: 'Failed to generate video' });
  }
};

export const generateComic = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId } = req.params;

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { course: true },
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.course.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { panels } = await convertToComic(topic.title, topic.content);

    await prisma.learningSession.create({
      data: {
        topicId,
        userId: req.userId!,
        mode: 'comic',
      },
    });

    res.json({ comicUrl: '', panels });
  } catch (error) {
    console.error('Generate comic error:', error);
    res.status(500).json({ message: 'Failed to generate comic' });
  }
};

export const customFeature = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { course: true },
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.course.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const content = await buildCustomFeature(topic.content, description);

    await prisma.learningSession.create({
      data: {
        topicId,
        userId: req.userId!,
        mode: 'custom',
        data: { description, content },
      },
    });

    res.json({ content });
  } catch (error) {
    console.error('Custom feature error:', error);
    res.status(500).json({ message: 'Failed to generate custom feature' });
  }
};
