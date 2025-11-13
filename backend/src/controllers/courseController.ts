import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../types';
import { generateTopics } from '../services/openai';
import { addDays, startOfDay } from 'date-fns';

const createCourseSchema = z.object({
  courseName: z.string().min(1),
  focusArea: z.string().min(10),
  topicsPerDay: z.number().min(1).max(10),
});

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseName, focusArea, topicsPerDay } = createCourseSchema.parse(req.body);

    // Deactivate any existing active courses
    await prisma.course.updateMany({
      where: {
        userId: req.userId!,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Create new course
    const course = await prisma.course.create({
      data: {
        userId: req.userId!,
        courseName,
        focusArea,
        topicsPerDay,
        isActive: true,
      },
    });

    // Generate topics using AI
    console.log('Generating topics with AI...');
    const numberOfDays = 30; // Generate topics for 30 days
    const generatedTopics = await generateTopics(
      courseName,
      focusArea,
      topicsPerDay,
      numberOfDays
    );

    // Create topics in database with assigned dates
    const startDate = startOfDay(new Date());
    const topics = [];

    for (let i = 0; i < generatedTopics.length; i++) {
      const dayIndex = Math.floor(i / topicsPerDay);
      const assignedDate = addDays(startDate, dayIndex);

      const topic = await prisma.topic.create({
        data: {
          courseId: course.id,
          title: generatedTopics[i].title,
          description: generatedTopics[i].description,
          content: generatedTopics[i].content,
          sources: generatedTopics[i].sources,
          assignedDate,
          order: generatedTopics[i].order,
        },
      });

      topics.push(topic);
    }

    console.log(`Created ${topics.length} topics for course ${course.id}`);

    res.status(201).json(course);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Failed to create course. Please try again.' });
  }
};

export const getActiveCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await prisma.course.findFirst({
      where: {
        userId: req.userId!,
        isActive: true,
      },
    });

    res.json(course);
  } catch (error) {
    console.error('Get active course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllCourses = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        userId: req.userId!,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(courses);
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
