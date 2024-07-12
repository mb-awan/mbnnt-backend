import { Request, Response } from 'express';

import Newsletter from '@/common/models/newsLetter';
import { User } from '@/common/models/user';

export const createNewsLetter = async (req: Request, res: Response) => {
  const { title, content, author, subscribers, tags, isPublished } = req.body;

  if (subscribers?.length > 0) {
    for (const subscriber of subscribers) {
      const userExists = await User.findById(subscriber);
      if (!userExists) return res.status(404).json({ message: 'User not found' });
    }
  }

  try {
    await Newsletter.create({
      title,
      content,
      author,
      subscribers,
      tags,
      isPublished,
    });

    return res.status(201).json({
      success: true,
      message: 'NewsLetter created successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateNewsLetter = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, author, subscribers, tags, isPublished } = req.body;

  if (subscribers?.length > 0) {
    for (const subscriber of subscribers) {
      const userExists = await User.findById(subscriber);
      if (!userExists) return res.status(404).json({ message: 'User not found' });
    }
  }

  try {
    const newsLetter = await Newsletter.findById(id);
    if (!newsLetter) return res.status(404).json({ message: 'NewsLetter not found' });

    await newsLetter.updateOne({
      title,
      content,
      author,
      subscribers,
      tags,
      isPublished,
    });

    return res.status(200).json({
      success: true,
      message: 'NewsLetter updated successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getNewsLetterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newsLetter = await Newsletter.findById(id);
    if (!newsLetter) return res.status(404).json({ message: 'NewsLetter not found' });

    return res.status(200).json(newsLetter);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getNewsLetters = async (req: Request, res: Response) => {
  try {
    const newsLetters = await Newsletter.find();
    return res.status(200).json(newsLetters);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteNewsLetter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newsLetter = await Newsletter.findById(id);
    if (!newsLetter) return res.status(404).json({ message: 'NewsLetter not found' });

    await newsLetter.deleteOne();
    return res.status(200).json({ message: 'NewsLetter deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
