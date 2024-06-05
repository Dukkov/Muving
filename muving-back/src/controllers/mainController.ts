import { Request, Response } from 'express';
import melonScraper from '../services/melonScraper';
import Music from '../types/music';

export const scraper = async (req: Request, res: Response): Promise<void> => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res
      .status(400)
      .json({ error: 'URL parameter is required and must be a string' });
    return;
  }

  try {
    const musicList: Music[] = await melonScraper(url);
    res.json(musicList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
