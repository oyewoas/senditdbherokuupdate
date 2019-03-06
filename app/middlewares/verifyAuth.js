
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import dbQuery from '../db/dbquery';

dotenv.config();

/**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */

const badRequest = { status: '400', message: 'Bad Request' };
const notFound = { status: '404', message: 'Not Found' };

const verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    badRequest.description = 'Token not provided';
    return res.status(400).send(badRequest);
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    const selectUser = 'SELECT * FROM users WHERE user_id = $1';
    const { rows } = await dbQuery.query(selectUser, [decoded.userId]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      badRequest.description = 'The token you provided is invalid';
      return res.status(400).send(badRequest);
    }
    req.user = { user_id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).send({
      status: '401',
      message: 'Auth failed',
      error,
    });
  }
};


export default verifyToken;
