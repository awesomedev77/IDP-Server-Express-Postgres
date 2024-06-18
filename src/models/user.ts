// src/models/user.ts

import { AppDataSource } from '../utils/db';
import { User } from '../entity/User';

export const findUserByUsername = async (email: string): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOneBy({ email });
};

export const findUserById = async (id: number): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  return userRepository.findOneBy({ id });
};

export const createUser = async (email: string, fullName: string, role: string, hash: string): Promise<User> => {
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.create({
    email,
    fullName,
    role,
    password: hash
  });
  return userRepository.save(user);
};