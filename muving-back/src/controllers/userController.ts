import { Request, Response } from 'express';
import { checkEmailService } from '../services/userService';

const checkEmail = async (req: Request, res: Response): Promise<void> => {
  const { address } = req.body;

  if (!address) {
    res.status(400).json({ message: 'Invalid email address' });
    return;
  }

  try {
    const emailExists = await checkEmailService(address);

    if (emailExists) res.status(400).json({ message: 'Invalid email address' });
    else res.status(200).json({ message: 'Valid email address' });
  } catch (err) {
    res
      .status(500)
      .json({
        error: err.message,
        message: 'There is something wrong with the server'
      });
  }
};

export { checkEmail };
