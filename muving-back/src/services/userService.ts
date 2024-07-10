import { RowDataPacket } from 'mysql2/promise';
import dbPool from '../config/dbConfig';
import nodemailer from 'nodemailer';
import redisClient from '../config/redisConfig';

const checkEmailService = async (address: string): Promise<boolean> => {
  const sql: string = `SELECT 1 FROM user WHERE email = ? LIMIT 1`;
  const sqlParam: string[] = [address];
  const [rows] = await dbPool.query<RowDataPacket[]>(sql, sqlParam);

  return rows.length > 0;
};

const sendVerificationCodeService = async (address: string): Promise<void> => {
  const code: number = Math.random() * 900000 + 100000;
  await redisClient.set(address, code, 'EX', 600);
};

const verifyCodeService = async (
  address: string,
  code: string
): Promise<void> => {};

export { checkEmailService, sendVerificationCodeService, verifyCodeService };
