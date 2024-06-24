import { Request, Response } from 'express';
import { AppDataSource } from '../utils/db';
import { Process } from '../entity/Process';
import { Document } from '../entity/Document';
import { Report } from '../entity/Report';
import { processDocument } from '../utils/processDocument';
import { User } from '../entity/User';
export const getDetailsByProcess = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const processRepository = AppDataSource.getRepository(Process);

  try {
    const item = await processRepository.findOne({
      where: { id },
      relations: ['creator', 'documents'],
      order: {
        documents: {
          id: "DESC"
        }
      }
    });

    if (!item) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching application:', error);
    return res.status(500).json({ message: 'Failed to fetch application' });
  }
};