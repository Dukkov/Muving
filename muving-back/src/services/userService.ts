import { RowDataPacket } from 'mysql2/promise';
import dbPool from '../config/dbConfig';

const checkEmailService = async (address: string): Promise<boolean> => {
  const sql: string = `SELECT 1 FROM user WHERE email = ? LIMIT 1`;
  const sqlParam: string[] = [address];
  const [rows] = await dbPool.query<RowDataPacket[]>(sql, sqlParam);

  return rows.length > 0;
};

export { checkEmailService };
