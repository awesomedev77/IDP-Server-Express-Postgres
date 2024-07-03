import { Request, Response } from 'express';
import { AppDataSource } from '../utils/db';
import { Process } from '../entity/Process';
import { Not } from 'typeorm';
import { User } from '../entity/User';

export const getAllProcesses = async (req: Request, res: Response) => {
  const processRepository = AppDataSource.getRepository(Process);

  try {
    const processes = await processRepository.find({
      order: {
        id: 'ASC',
      }
    });

    res.status(200).json(processes);
  } catch (error) {
    console.error('Error fetching processes:', error);
    res.status(500).json({ message: 'Failed to fetch processes' });
  }
};


export const getAll = async (req: Request, res: Response) => {
  const processRepository = AppDataSource.getRepository(Process);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9;
  const sortBy = req.query.sortBy  || 'createdAt';
  const sort = req.query.sort || 'DESC';
  try {
    const order = {
      [sortBy as string]: sort
    } as { [key: string]: 'ASC' | 'DESC' };
  
    const [processes, total] = await processRepository.findAndCount({
      relations: ['creator', 'documents'],
      skip: (page - 1) * limit,
      take: limit,
      order: order
    });
    const data = {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: processes
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching processes:', error);
    res.status(500).json({ message: 'Failed to fetch processes' });
  }
};


export const addProcess = async (req: Request, res: Response) => {
  const { processName, processDescription } = req.body;
  const user = req.user as User;
  const processRepository = AppDataSource.getRepository(Process);
  const check = await processRepository.findOne({ where: { processName: processName } });;
  if (check) {
    return res.status(400).json({ message: 'Process Name already exists. Please try again.' });
  }
  try {
    const process = await processRepository.create({
      creator: { id: user.id },
      processName,
      processDescription
    });
    const savedProcess = processRepository.save(process);
    return res.status(200).json(savedProcess);
  } catch (error) {
    return res.status(500).json({ message: 'Error registering new process', error });
  }
};
// export const editProcess = async (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   const { processName, processDescription } = req.body;
//   const processRepository = AppDataSource.getRepository(Process);
//   try {
//     const check = await processRepository.findOne({ where: { processName: processName, id: Not(id) } });;
//     if (check) {
//       return res.status(400).json({ message: 'Process Name already exists. Please try again.' });
//     }
//     const process = await processRepository.findOne({ where: { id: id } });
//     if (!process) {
//       return res.status(404).json({ message: "Process Not found" });
//     }
//     process.processName = processName;
//     process.processDescription = processDescription;

//     await processRepository.save(process);
//     return res.status(201).json(process);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error Editing Process' });
//   }
// };

// export const deleteProcess = async (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   try {
//     const processRepository = AppDataSource.getRepository(Process);
//     const process = await processRepository.findOne({ where: { id: id } });
//     if (!process) {
//       return res.status(404).json({ message: "Process Not found" });
//     }
//     await processRepository.remove(process);
//     return res.status(200).json({ message: "success" });
//   } catch (error) {
//     return res.status(500).json({ message: 'Error deleting process', error });
//   }
// };