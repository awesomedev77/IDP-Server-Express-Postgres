import { Request, Response } from 'express';
import { AppDataSource } from '../utils/db';
import { Application } from '../entity/Application';
import { Company } from '../entity/Company';
import { Document } from '../entity/Document';
import { Report } from '../entity/Report';
import { processDocument } from '../utils/processDocument';
import { User } from '../entity/User';

export const addApplication = async (req: Request, res: Response) => {
  const applicationRepository = AppDataSource.getRepository(Application);
  const companyRepository = AppDataSource.getRepository(Company);
  const documentRepository = AppDataSource.getRepository(Document);

  try {
    const {
      companyName,
      companyTaxNumber,
      companyLocation,
      createdBy,
      loanAmount,
      currency,
      loanType,
      applicantName,
      applicantDescription,
      applicantEmail,
      applicantPhone,
    } = req.body;

    let company = await companyRepository.findOneBy({
      companyName,
      companyTaxNumber,
      companyLocation
    });

    if (!company) {
      company = companyRepository.create({
        companyName,
        companyTaxNumber,
        companyLocation
      });
      await companyRepository.save(company);
    }

    const newApplication = applicationRepository.create({
      company: { id: company.id },
      loanAmount,
      currency,
      loanType,
      applicantName,
      applicationStatus: "Open",
      applicantDescription,
      applicantEmail,
      applicantPhone,
      creator: { id: createdBy },
    });

    const savedApplication = await applicationRepository.save(newApplication);

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const documents = (req.files as Express.Multer.File[]).map(file => {
        return documentRepository.create({
          status: 'A',
          path: file.path,
          application: savedApplication
        })
      });
      const savedDocuments = await documentRepository.save(documents);

      savedDocuments.forEach(document => {
        processDocument(document);
      });
    }

    res.status(201).json({ message: "success" });
  } catch (error) {
    console.error('Error adding application:', error);
    res.status(500).json({ message: 'Failed to add application' });
  }
};


export const getApplications = async (req: Request, res: Response) => {
  const applicationRepository = AppDataSource.getRepository(Application);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9; // Default to 9 if limit is not provided
  const user = req.user as User;
  try {
    const [applications, total] = (user?.role.replaceAll(' ', '').toLowerCase() === "admin" || user?.role.replaceAll(' ', '').toLowerCase() === "bankmanager")
      ? await applicationRepository.findAndCount({
        relations: ['company', 'creator', 'assignee', 'loanDocuments'],
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        }
      })
      : await applicationRepository.findAndCount({
        relations: ['company', 'creator', 'assignee', 'loanDocuments'],
        where: { assignee: user },
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        }
      });

    const data = {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: applications
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};


export const getApplicationById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const applicationRepository = AppDataSource.getRepository(Application);

  try {
    const application = await applicationRepository.findOne({
      where: { id },
      relations: ['company', 'creator', 'loanDocuments'],
      order: {
        loanDocuments: {
          id: "DESC"
        }
      }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return res.status(500).json({ message: 'Failed to fetch application' });
  }
};


export const updateApplicationStatus = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const applicationRepository = AppDataSource.getRepository(Application);
    const { status } = req.body;
    const application = await applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    application.applicationStatus = status;
    await applicationRepository.save(application);
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error fetching application:', error);
    return res.status(500).json({ message: 'Failed to update application' });
  }
};

export const assignTo = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const applicationRepository = AppDataSource.getRepository(Application);
    const userRepository = AppDataSource.getRepository(User);
    const { assign } = req.body
    const application = await applicationRepository.findOne({
      where: { id },
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    const user = await userRepository.findOne({ where: { id: assign } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    application.assignee = user;
    await applicationRepository.save(application);
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching application:', error);
    return res.status(500).json({ message: 'Failed to assign application' });
  }
}