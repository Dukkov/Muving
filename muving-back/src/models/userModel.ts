import { ResultSetHeader } from 'mysql2/promise';
import dbPool from '../config/dbConfig';
import UserInfo from '../types/user';

class User {
  static async create(userData: UserInfo): Promise<ResultSetHeader> {
    const { email, password } = userData;
    let { name, img_link } = userData;

    if (typeof name === 'undefined') name = 'Muving user';
    if (typeof img_link === 'undefined') img_link = '1';

    const sql: string =
      'INSERT INTO user (email, password, name, img_link) VALUES (?, ?, ?, ?)';
    const sqlParam: string[] = [email, password, name, img_link];
    const [result] = await dbPool.query<ResultSetHeader>(sql, sqlParam);

    return result;
  }
}

export default User;
