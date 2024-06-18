// src/controllers/QueryController.ts
import { Request, Response } from "express";
import { Query } from "../entity/Query";
import { Message } from "../entity/Message";
import { AppDataSource } from "../utils/db";

export const getQueriesByApplication = async (req: Request, res: Response) => {
  const applicationId = parseInt(req.params.id);;
  const queryRepository = AppDataSource.getRepository(Query);

  // Fetch all queries with their latest message date
  const queries = await queryRepository
    .createQueryBuilder("query")
    .leftJoinAndSelect("query.messages", "message")
    .leftJoinAndSelect("query.user", "user")
    .where("query.application_id = :applicationId", { applicationId })
    .orderBy("message.created_at", "DESC")
    .getMany();

  const now = new Date();
  interface ResultProps {
    last7Days: Query[];
    lastMonth: Query[];
    lastYear: Query[];
    longAgo: Query[];
  }
  const groupedQueries: ResultProps = {
    last7Days: [],
    lastMonth: [],
    lastYear: [],
    longAgo: [],
  };

  queries.forEach((query) => {
    const lastMessage = query.messages[0]; // Assuming messages are sorted by created_at DESC
    if (lastMessage) {
      const daysDiff =
        (now.getTime() - lastMessage.createdAt.getTime()) / (1000 * 3600 * 24);
      if (daysDiff <= 7) {
        groupedQueries.last7Days.push(query);
      } else if (daysDiff <= 30) {
        groupedQueries.lastMonth.push(query);
      } else if (daysDiff <= 365) {
        groupedQueries.lastYear.push(query);
      } else {
        groupedQueries.longAgo.push(query);
      }
    }
  });

  return res.json(groupedQueries);
};

export const createQueryAndMessage = async (req: Request, res: Response) => {
  const { applicationId, prompt } = req.body;
  const queryRepository = AppDataSource.getRepository(Query);
  const messageRepository = AppDataSource.getRepository(Message);
  const user = req.user;

  const query = queryRepository.create({
    user: user,
    applicationId: applicationId,
  });
  const savedQuery = await queryRepository.save(query);

  const delay = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };
  const getResult = async () => {
    await delay(3000);
    return "Yes, Emirates was highly profitable in the last year. For the financial year 2022-23, Emirates Group achieved a record profit of AED 10.6 billion (US$ 2.9 billion), a significant turnaround from the previous year's loss of AED 3.9 billion (US$ 1.1 billion). The company's performance was its best ever, with a substantial increase in passenger and cargo capacity, leading to an 81% increase in total revenue to AED 107.4 billion (US$ 29.3 billion)​ (Emirates)​. In the first half of the 2023-24 financial year, Emirates continued its strong performance, recording a profit of AED 9.4 billion (US$ 2.6 billion), nearly matching the full-year profit of the previous year and marking it as the best-ever half-year performance for the Group.";
  };
  //   const response = await fetch(`${process.env.API_URL}/report/${document.application.id}`, {
  //     method: 'POST',
  //     body: formData,
  //     headers: formData.getHeaders()
  //   });
  if (1) {
    const answer = await getResult();
    const message = messageRepository.create({
      query: savedQuery,
      prompt: prompt,
      answer: answer,
    });
    await messageRepository.save(message);
    savedQuery.messages = [message];
    return res.status(201).json(savedQuery);
  } else {
    const message = messageRepository.create({
      query: savedQuery,
      prompt: prompt,
    });
    await messageRepository.save(message);
    savedQuery.messages = [message];
    return res.status(201).json(savedQuery);
  }
};
export const addMessage = async (req: Request, res: Response) => {
  const { queryId, prompt } = req.body;
  const queryRepository = AppDataSource.getRepository(Query);
  const messageRepository = AppDataSource.getRepository(Message);
  const user = req.user;

  const query = await queryRepository.findOne({
    relations: ['user', 'messages'],
    where: {
      id: queryId
    },
    order: {
      messages: {
        createdAt: "DESC"
      }
    }
  });
  if (!query) {
    return res.status(404).json({ message: 'Query not found. Please try again.' });
  }

  const delay = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };
  const getResult = async () => {
    await delay(3000);
    return "Yes, Emirates was highly profitable in the last year. For the financial year 2024-23, Emirates Group achieved a record profit of AED 10.6 billion (US$ 2.9 billion), a significant turnaround from the previous year's loss of AED 3.9 billion (US$ 1.1 billion). The company's performance was its best ever, with a substantial increase in passenger and cargo capacity, leading to an 81% increase in total revenue to AED 107.4 billion (US$ 29.3 billion)​ (Emirates)​. In the first half of the 2023-24 financial year, Emirates continued its strong performance, recording a profit of AED 9.4 billion (US$ 2.6 billion), nearly matching the full-year profit of the previous year and marking it as the best-ever half-year performance for the Group.";
  };
  //   const response = await fetch(`${process.env.API_URL}/report/${document.application.id}`, {
  //     method: 'POST',
  //     body: formData,
  //     headers: formData.getHeaders()
  //   });
  if (1) {
    const answer = await getResult();
    const message = messageRepository.create({
      query: query,
      prompt: prompt,
      answer: answer,
    });
    await messageRepository.save(message);
    query.messages = [message, ...query.messages];
    return res.status(201).json(query);
  } else {
    const message = messageRepository.create({
      query: query,
      prompt: prompt,
    });
    await messageRepository.save(message);
    query.messages = [message, ...query.messages];
    return res.status(201).json(query);
  }
};
export const editMessage = async (req: Request, res: Response) => {
  const { queryId, prompt } = req.body;
  const queryRepository = AppDataSource.getRepository(Query);
  const messageRepository = AppDataSource.getRepository(Message);

  const query = await queryRepository.findOne({
    relations: ['user', 'messages'],
    where: {
      id: queryId
    },
    order: {
      messages: {
        createdAt: "DESC"
      }
    }
  });
  if (!query) {
    return res.status(404).json({ message: 'Query not found. Please try again.' });
  }

  const delay = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };
  const getResult = async () => {
    await delay(3000);
    return "Yes, Emirates was highly profitable in the last year. For the financial year 2024-23, Emirates Group achieved a record profit of AED 10.6 billion (US$ 2.9 billion), a significant turnaround from the previous year's loss of AED 3.9 billion (US$ 1.1 billion). The company's performance was its best ever, with a substantial increase in passenger and cargo capacity, leading to an 81% increase in total revenue to AED 107.4 billion (US$ 29.3 billion)​ (Emirates)​. In the first half of the 2023-24 financial year, Emirates continued its strong performance, recording a profit of AED 9.4 billion (US$ 2.6 billion), nearly matching the full-year profit of the previous year and marking it as the best-ever half-year performance for the Group.";
  };
  //   const response = await fetch(`${process.env.API_URL}/report/${document.application.id}`, {
  //     method: 'POST',
  //     body: formData,
  //     headers: formData.getHeaders()
  //   });
  if (1) {
    const answer = await getResult();
    const message = query.messages[0];
    const currentTime = new Date(); 
    // const formattedTime = moment(currentTime).format('YYYY-MM-DD HH:mm:ss');
    message.prompt = prompt;
    message.answer = answer;
    message.createdAt = currentTime;
    await messageRepository.save(message);
    query.messages[0] = message;
    return res.status(201).json(query);
  } else {
    const message = query.messages[0];
    message.prompt = prompt;
    message.answer = "";
    const currentTime = new Date(); 
    // const formattedTime = moment(currentTime).format('YYYY-MM-DD HH:mm:ss');
    message.createdAt = currentTime;
    await messageRepository.save(message);
    query.messages[0] = message;
    return res.status(201).json(query);
  }
};


