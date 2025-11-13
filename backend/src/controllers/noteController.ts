import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../types';

const createNoteSchema = z.object({
  topicId: z.string(),
  content: z.string(),
});

const updateNoteSchema = z.object({
  content: z.string(),
});

export const getNoteByTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId } = req.params;

    const note = await prisma.note.findUnique({
      where: {
        topicId,
      },
    });

    if (!note) {
      return res.json(null);
    }

    // Verify user owns this note
    if (note.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note by topic error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId, content } = createNoteSchema.parse(req.body);

    // Check if note already exists for this topic
    const existingNote = await prisma.note.findUnique({
      where: { topicId },
    });

    if (existingNote) {
      return res.status(400).json({ message: 'Note already exists for this topic' });
    }

    const note = await prisma.note.create({
      data: {
        topicId,
        userId: req.userId!,
        content,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = updateNoteSchema.parse(req.body);

    // Verify user owns this note
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { content },
    });

    res.json(updatedNote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
