import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = (password) => { return bcrypt.hashSync(password, salt); };

/**
   * comparePassword
   * @param {string} hashPassword 
   * @param {string} password 
   * @returns {Boolean} return True or False
   */
const comparePassword = (hashedPassword, password) => {
  return bcrypt.compareSync(password, hashedPassword);
};

/**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
const isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

/**
   * validatePassword helper method
   * @param {string} password
   * @returns {Boolean} True or False
   */
const validatePassword = (password) => {
  if (password.length < 5 || password === '') {
    return false;
  } return true;
};
/**
   * isEmpty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
const isEmpty = (input) => {
  if (input === undefined) {
    return true;
  }
  if (input.replace(/\s/g, '').length) {
    return false;
  } return true;
};

/**
   * Generate Token
   * @param {string} id
   * @returns {string} token
   */
const generateToken = (email, id) => {
  const token = jwt.sign({
    userEmail: email,
    userId: id,
  },
  process.env.JWT_KEY, { expiresIn: '3d' });
  return token;
};

const generateAdminToken = (email, id, isAdmin) => {
  const token = jwt.sign({
    userEmail: email,
    userId: id,
    admin: isAdmin,
  },
  process.env.JWT_KEY, { expiresIn: '3d' });
  return token;
};

export {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateToken,
  generateAdminToken,
};
