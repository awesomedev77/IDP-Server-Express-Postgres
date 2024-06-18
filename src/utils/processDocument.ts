import { AppDataSource } from "./db";
import { Document } from "../entity/Document";
import { Report } from "../entity/Report";
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';


const extractFileName = (path: string): string => {
    // Split the path by the '\' to isolate the file part
    const parts = path.split('\\');
    const fullFileName = parts.pop(); // Get the last element which is the file name with timestamp

    if (!fullFileName) {
        return 'Invalid path'; // Return an error message or handle it as needed
    }

    // Remove the timestamp by splitting on the first dash and taking the rest parts
    const nameParts = fullFileName.split('-');
    nameParts.shift(); // Remove the timestamp part (first element)

    // Rejoin the remaining parts that were split, to handle cases where filename might contain dashes
    return nameParts.join('-');
};

export const processDocument = async (document: Document) => {
    const documentRepository = AppDataSource.getRepository(Document);
    const reportRepository = AppDataSource.getTreeRepository(Report);
    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(document.path);
        formData.append('file', fileStream, extractFileName(document.path));

        // const response = await fetch(`${process.env.API_URL}/report/${document.application.id}`, {
        //   method: 'POST',
        //   body: formData,
        //   headers: formData.getHeaders()
        // });
        const delay = (time: number) => {
            return new Promise(resolve => setTimeout(resolve, time));
        }
        const getResult = async () => {
            await delay(10000);
            return `json{
            "DocumentType": ["Memorandum of Association (MoA)"],
            "CompanyName": "SMART SENSE DRONE SERVICES L.L.C",
            "CompanyDescription": "SMART SENSE DRONE SERVICES L.L.C is a Limited Liability Company that operates in the drone services industry. The company's primary operations involve the use of drones for various services, potentially including surveillance, delivery, and other applications. The company's unique selling proposition lies in its innovative use of drone technology, potentially leveraging AI and other advanced technologies to provide superior services.",
            "Directors": ["Mr. NAVANEETHA BABU CHELLATHURAI CHELLATHURAI", "Mr. HENDRIK OSKAR SCHOUTEN", "Mr. LUCA ROMANINI"],
            "Shareholders": ["Mr. NAVANEETHA BABU CHELLATHURAI CHELLATHURAI (50%)", "Mr. HENDRIK OSKAR SCHOUTEN (50%)"],
            "NewsArticles": "The company's industry is experiencing significant advancements, with companies like XTEND securing substantial funding to redefine robotics with AI-powered common sense. This development indicates a growing interest and investment in the drone and robotics industry, potentially presenting opportunities for SMART SENSE DRONE SERVICES L.L.C to secure funding or partnerships for growth and expansion.",
            "CompanyRisk": "Medium",
            "ShareholdersRisk": "Medium",
            "DirectorsRisk": "Low"
        }
        
        Explanation:
        
        The company, SMART SENSE DRONE SERVICES L.L.C, is a Limited Liability Company that specializes in drone services. The company's directors are Mr. NAVANEETHA BABU CHELLATHURAI CHELLATHURAI, Mr. HENDRIK OSKAR SCHOUTEN, and Mr. LUCA ROMANINI. The shareholders are Mr. NAVANEETHA BABU CHELLATHURAI CHELLATHURAI and Mr. HENDRIK OSKAR SCHOUTEN, each holding a 50% stake in the company.
        
        The company risk is assessed as Medium, considering the inherent risks associated with the drone services industry, including regulatory changes, technological advancements, and market competition. The shareholders' risk is also Medium, given the equal distribution of shares between two shareholders, which could lead to potential conflicts in decision-making. The directors' risk is assessed as Low, as the directors have a clear strategic direction and are experienced in their roles.
        
        No news articles were found using the API, indicating a lack of recent public exposure or significant events involving the company.
        
        Uploaded Documents
        SMARTSENSE AMENDED MOA.pdf
        `;
        }

        // if (response.ok) {
        if (1) {
            // const responseText = await response.text();
            const responseText = await getResult();
            const start_pos = responseText.indexOf('{');
            const end_pos = responseText.lastIndexOf('}') + 1;
            const explanationSplit = responseText.split("Explanation:");
            const explanation = explanationSplit.length > 1 ? explanationSplit[1].trim() : '';

            try {
                const reportData = JSON.parse(responseText.substring(start_pos, end_pos));
                const report = new Report();
                report.companyName = reportData.CompanyName;
                report.documentType = reportData.DocumentType.join(", ");
                report.companyDescription = reportData.CompanyDescription;
                report.directors = reportData.Directors;
                report.shareholders = reportData.Shareholders;
                report.newsArticles = reportData.NewsArticles;
                report.companyRisk = reportData.CompanyRisk;
                report.shareholdersRisk = reportData.ShareholdersRisk;
                report.directorsRisk = reportData.DirectorsRisk;
                report.explanation = explanation;
                report.documentId = document.id;
                await reportRepository.save(report);
                document.status = 'Y';
                await documentRepository.save(document);
                return "success";
            } catch (error) {
                document.status = 'N';
                await documentRepository.save(document);
                console.error(`Failed to parse JSON response. Error: ${error}`);
                return "error";
            }
        } else {
            document.status = "N"
            await documentRepository.save(document);
            // console.error(`Failed to upload ${extractFileName(document.path)}. Error: ${await response.text()}`);
            console.error('error')
            return "error";
        }
    } catch (error) {
        document.status = "N"
        await documentRepository.save(document);
        console.error(`Error processing document ${extractFileName(document.path)}: ${error}`);
        return "error";
    }
}