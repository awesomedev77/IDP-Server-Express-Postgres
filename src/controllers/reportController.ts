import { Request, Response } from "express";
import { AppDataSource } from "../utils/db";
import { Report } from "../entity/Report";
import { Document } from "../entity/Document";
import { processDocument } from "../utils/processDocument";

// Fetch user profile
export const getReportByDocumentId = async (req: Request, res: Response) => {
  const documentId = parseInt(req.params.id);
  const reportRepository = AppDataSource.getRepository(Report);
  try {
    const report = await reportRepository.findOne({
      where: { documentId: documentId },
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({ message: "Failed to fetch application" });
  }
};
export const addDocument = async (req: Request, res: Response) => {
  const loanId = parseInt(req.params.id);
  console.log(loanId);
  const documentRepository = AppDataSource.getRepository(Document);
  try {
    let savedDocuments: Document[] = [];
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const documents = (req.files as Express.Multer.File[]).map((file) => {
        return documentRepository.create({
          status: "A",
          path: file.path,
          application: { id: loanId },
        });
      });
      savedDocuments = await documentRepository.save(documents);

      const finalDocuments = await Promise.all(
        savedDocuments.map(async (document) => {
          const result = await processDocument(document);
          document.status = result === "success" ? "Y" : "N";
          return document; // Make sure to save the updated document status
        })
      );
      return res.status(201).json(finalDocuments);
    } else {
      return res.status(400).json({ message: "No files uploaded" });
    }
  } catch (error) {
    console.error("Error adding application:", error);
    return res.status(501).json({ message: "Failed to add application" });
  }
};
export const generateReport = async (req: Request, res: Response) => {
  const documentId = parseInt(req.params.id);
  const documentRepository = AppDataSource.getRepository(Document);
  const document = await documentRepository.findOne({
    where: { id: documentId },
  });
  try {
    if (document) {
      const result = await processDocument(document);
      if (result == "success") {
        document.status = "Y";
        return res.status(201).json(document);
      } else {
        document.status = "N";
        return res.status(201).json(document);
      }
    } else {
      return res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    console.error("Error adding application:", error);
    return res.status(501).json({ message: "Failed to add application" });
  }
};
