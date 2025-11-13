import { Response } from 'express';
import { format, parseISO, startOfDay } from 'date-fns';
import prisma from '../config/database';
import { AuthRequest } from '../types';

export const getTopicsByDate = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.params; // Format: YYYY-MM-DD

    const parsedDate = startOfDay(parseISO(date));

    // Get active course
    const activeCourse = await prisma.course.findFirst({
      where: {
        userId: req.userId!,
        isActive: true,
      },
    });

    if (!activeCourse) {
      return res.json([]);
    }

    // Get topics for this date
    const topics = await prisma.topic.findMany({
      where: {
        courseId: activeCourse.id,
        assignedDate: {
          gte: parsedDate,
          lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    res.json(topics);
  } catch (error) {
    console.error('Get topics by date error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTopicById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Verify user owns this topic
    if (topic.course.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(topic);
  } catch (error) {
    console.error('Get topic by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const markTopicComplete = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Verify user owns this topic
    if (topic.course.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedTopic = await prisma.topic.update({
      where: { id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });

    res.json(updatedTopic);
  } catch (error) {
    console.error('Mark topic complete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTopicsByCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;

    // Verify user owns this course
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        userId: req.userId!,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const topics = await prisma.topic.findMany({
      where: {
        courseId,
      },
      orderBy: [
        { assignedDate: 'asc' },
        { order: 'asc' },
      ],
    });

    res.json(topics);
  } catch (error) {
    console.error('Get topics by course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
