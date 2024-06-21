import { Request, Response } from 'express';
import { AppDataSource } from '../utils/db';
import { Type } from '../entity/Type';
import { Not } from 'typeorm';

export const getAll = async (req: Request, res: Response) => {
  const typeRepository = AppDataSource.getRepository(Type);

  try {
    const types = await typeRepository.find({
      order: {
        id: 'ASC',
      }
    });

    res.status(200).json(types);
  } catch (error) {
    console.error('Error fetching types:', error);
    res.status(500).json({ message: 'Failed to fetch types' });
  }
};


export const addType = async (req: Request, res: Response) => {
  const { typeName } = req.body;
  const typeRepository = AppDataSource.getRepository(Type);
  const check = await typeRepository.findOne({ where: { typeName: typeName } });;
  if (check) {
    return res.status(400).json({ message: 'Type Name already exists. Please try again.' });
  }
  try {
    const documentType = await typeRepository.create({
      typeName
    });
    const savedType = typeRepository.save(documentType);
    return res.status(200).json(savedType);
  } catch (error) {
    return res.status(500).json({ message: 'Error Creating Type', error });
  }
};
export const editType = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { typeName } = req.body;
  const typeRepository = AppDataSource.getRepository(Type);
  try {
    const check = await typeRepository.findOne({ where: { typeName: typeName, id: Not(id) } });;
    if (check) {
      return res.status(400).json({ message: 'Type Name already exists. Please try again.' });
    }
    const documentType = await typeRepository.findOne({ where: { id: id } });
    if (!documentType) {
      return res.status(404).json({ message: "Type Not found" });
    }

    documentType.typeName = typeName;

    await typeRepository.save(documentType);
    return res.status(201).json(documentType);
  } catch (error) {
    return res.status(500).json({ message: 'Error Editing type' });
  }
};

export const deleteType = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const typeRepository = AppDataSource.getRepository(Type);
    const documentType = await typeRepository.findOne({ where: { id: id } });
    if (!documentType) {
      return res.status(404).json({ message: "Type Not found" });
    }
    await typeRepository.remove(documentType);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting type', error });
  }
};