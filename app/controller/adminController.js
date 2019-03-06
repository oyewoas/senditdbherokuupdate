import moment from 'moment';

import dbQuery from '../db/dbquery';

import {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateAdminToken,
} from '../helpers';

// dotenv.config();

const badRequest = { status: '400', message: 'Bad Request' };
const notFound = { status: '404', message: 'Not Found' };
const noContent = { status: '204', message: 'No Content' };
const conflictExists = { status: '409', message: 'Conflict' };


/**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const createAdmin = async (req, res) => {
  const { email, username, password } = req.body;
  const isAdmin = true;
  const registered = moment(new Date());
  if (isEmpty(email) || isEmpty(username) || isEmpty(password)) {
    badRequest.description = 'Email, password and username field cannot be empty';
    return res.status(400).send(badRequest);
    
  }
  if (!isValidEmail(email) || !validatePassword(password)) {
    badRequest.description = 'Please enter a valid Email or Password';
    return res.status(400).send(badRequest);
   
  }
  const hashedPassword = hashPassword(password);
  const createUserQuery = `INSERT INTO
      users(email, username, password, registered, isadmin)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
  const values = [
    email,
    username,
    hashedPassword,
    registered,
    isAdmin,
  ];

  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    const token = generateAdminToken(dbResponse.email, dbResponse.user_id, dbResponse.admin);
    const replySignUp = { status: '201', data: [] };
    const message = 'Admin User Created Successfully';
    replySignUp.data.push({
      token,
      user: dbResponse,
      message,
    });
    return res.status(201).send(replySignUp);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      conflictExists.description = 'Admin User with that EMAIL already exist';
      return res.status(409).send(conflictExists);
    }
    return res.status(400).send(error);
  }
};

/**
   * Login
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const isAdmin = true;
  if (isEmpty(email) || isEmpty(password)) {
    badRequest.description = 'Email or Password detail is missing';
    return res.status(400).send(badRequest);
    
  }
  if (!isValidEmail(email) || !validatePassword(password)) {
    badRequest.description = 'Please enter a valid Email or Password';
    return res.status(400).send(badRequest);
    
  }
  const loginUserQuery = 'SELECT * FROM users WHERE email = $1 and isadmin = $2';
  try {
    const { rows } = await dbQuery.query(loginUserQuery, [email, isAdmin]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      badRequest.description = 'The credentials you provided is incorrect or this User does not exist';
      return res.status(400).send(badRequest);
    }
    if (!comparePassword(dbResponse.password, password)) {
      badRequest.description = 'The credentials you provided is incorrect';
      return res.status(400).send(badRequest);
    }
    const token = generateAdminToken(dbResponse.email, dbResponse.user_id, dbResponse.isadmin);
    const replySignIn = { status: '201', data: [] };
    const message = 'Admin User Logged In Successfully';
    replySignIn.data.push({
      token,
      user: dbResponse,
      message,
    });
    return res.status(201).send(replySignIn);
  } catch (error) {
    return res.status(400).send(error);
  }
};

/**
   * Delete A User
   * @param {object} req
   * @param {object} res
   * @returns {void} return status code 204
   */
const deleteAdmin = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { user_id, isadmin } = req.user;
  const deleteQuery = 'DELETE FROM users WHERE user_id=$1 AND isadmin = $2 returning *';
  try {
    // eslint-disable-next-line camelcase
    const { rows } = await dbQuery.query(deleteQuery, [user_id, isadmin]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      notFound.description = 'User not found';
      return res.status(404).send(notFound);
    }
    noContent.description = 'User deleted Successfully';
    return res.status(204).send(noContent);
  } catch (error) {
    return res.status(400).send(error);
  }
};


/**
   * Get All Users
   * @param {object} req 
   * @param {object} res 
   * @returns {object} users array
   */
const getAllAdmin = async (req, res) => {
  const isAdmin = true;
  const findAllUsersQuery = 'SELECT * FROM users WHERE isadmin = $1 ORDER BY isadmin ASC';
  try {
    const { rows } = await dbQuery.query(findAllUsersQuery, [isAdmin]);
    const dbResponse = rows;
    return res.status(200).send(dbResponse);
  } catch (error) {
    badRequest.description = 'No Admin User Record';
    return res.status(400).send(badRequest);
  }
};

/**
   * Get A Single User
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object
   */
const getAdminProfile = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { user_id, isadmin } = req.user;
  const getaUserQuery = 'SELECT * FROM users WHERE user_id = $1 AND isadmin = $2';
  try {
    // eslint-disable-next-line camelcase
    const { rows } = await dbQuery.query(getaUserQuery, [user_id, isadmin]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      badRequest.description = 'The credentials you provided is incorrect or this User does not exist';
      return res.status(400).send(badRequest);
    }
    const getUserReply = { status: '200', message: 'Admin User Returned Successfully', user: dbResponse };
    return res.status(200).send(getUserReply);
  } catch (error) {
    badRequest.description = 'Cannot Find or Get Admin user';
    return res.status(400).send(badRequest);
  }
};

/**
   * Update A Single User
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object
   */
const updateAdminProfile = async (req, res) => {
  const { firstname, lastname, othernames } = req.body;
  // eslint-disable-next-line camelcase
  const { user_id, isadmin } = req.user;
  const findProfileQuery = 'SELECT * FROM users WHERE user_id = $1 AND isadmin = $2';
  const updateProfileQuery = `UPDATE users
    SET firstname=$1,lastname=$2,othernames=$3 WHERE user_id=$4 AND isadmin=$5 returning *`;
  try {
  // eslint-disable-next-line camelcase
    const { rows } = await dbQuery.query(findProfileQuery, [user_id, isadmin]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      badRequest.description = 'User not found or does not exist';
      return res.status(404).send(badRequest);
    }
    const values = [
      firstname || dbResponse.firstname,
      lastname || dbResponse.lastname,
      othernames || dbResponse.othernames,
      // eslint-disable-next-line camelcase
      user_id,
      isadmin,
    ];
    const response = await dbQuery.query(updateProfileQuery, values);
    const dbResult = response.rows[0];
    const updateUserReply = { status: '200', message: 'Admin User Updated Successfully', user: dbResult };
    return res.status(200).send(updateUserReply);
  } catch (err) {
    badRequest.description = 'Cannot update Admin user';
    return res.status(400).send(badRequest);
  }
};



/**
 * Update A Parcel status
 * @param {object} req 
 * @param {object} res 
 * @returns {object} updated parcel status
 */
const updateParcelStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (isEmpty(status)) {
    badRequest.description = 'Parcel status cannot be empty';
    return res.status(400).send(badRequest);
  }
  // eslint-disable-next-line camelcase
  const findAparcelQuery = 'SELECT * FROM parcels WHERE parcel_id=$1';
  const updateParcelQuery = `UPDATE parcels
      SET status=$1 WHERE parcel_id=$2 returning *`;
  try {
    // eslint-disable-next-line camelcase
    const { rows } = await dbQuery.query(findAparcelQuery, [id]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      notFound.description = 'Parcel order Not Found';
      return res.status(404).send(notFound);
    }
    const values = [
      status,
      id,
      // eslint-disable-next-line camelcase
    ];
    const response = await dbQuery.query(updateParcelQuery, values);
    const dbResult = response.rows[0];
    const parcelId = dbResult.parcel_id;
    const statusReport = dbResult.status;
    const updateParcelReply = { status: '200', data: [] };
    const message = 'Parcel status updated';
    updateParcelReply.data.push({
      parcelId,
      statusReport,
      message,
    });
    return res.status(200).send(updateParcelReply);
  } catch (err) {
    return res.status(400).send(err);
  }
}; 

/**
 * Update A Parcel currentlocation
 * @param {object} req 
 * @param {object} res 
 * @returns {object} updated parcel
 */
const updateParcelLocation = async (req, res) => {
  const { id } = req.params;
  const { currentlocation } = req.body;
  if (isEmpty(currentlocation)) {
    badRequest.description = 'Current Location cannot be empty';
    return res.status(400).send(badRequest);
  }
  // eslint-disable-next-line camelcase
  const findAparcelQuery = 'SELECT * FROM parcels WHERE parcel_id=$1';
  const updateParcelQuery = `UPDATE parcels
        SET currentlocation=$1 WHERE parcel_id=$2 returning *`;
  try {
    // eslint-disable-next-line camelcase
    const { rows } = await dbQuery.query(findAparcelQuery, [id]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      notFound.description = 'Parcel order Not Found';
      return res.status(404).send(notFound);
    }
    const values = [
      currentlocation,
      id,
      // eslint-disable-next-line camelcase
    ];
    const response = await dbQuery.query(updateParcelQuery, values);
    const dbResult = response.rows[0];
    const parcelId = dbResult.parcel_id;
    const currentLocation = dbResult.currentlocation;
    const updateParcelReply = { status: '200', data: [] };
    const message = 'Parcel location updated';
    updateParcelReply.data.push({
      parcelId,
      currentLocation,
      message,
    });
    return res.status(200).send(updateParcelReply);
  } catch (err) {
    return res.status(400).send(err);
  }
}; 

/**
 * Update A Parcel Delivery time
 * @param {object} req 
 * @param {object} res 
 * @returns {object} updated parcel
 */
const updateDeliveryTime = async (req, res) => {
  const { id } = req.params;
  const deliveredOn = moment(new Date());
  // eslint-disable-next-line camelcase
  const findAparcelQuery = 'SELECT * FROM parcels WHERE parcel_id=$1';
  const updateParcelQuery = `UPDATE parcels
          SET deliveredon=$1 WHERE parcel_id=$2 returning *`;
  try {
    // eslint-disable-next-line camelcase
    const { rows } = await dbQuery.query(findAparcelQuery, [id]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      notFound.description = 'Parcel order Not Found';
      return res.status(404).send(notFound);
    }
    const values = [
      deliveredOn,
      id,
      // eslint-disable-next-line camelcase
    ];
    const response = await dbQuery.query(updateParcelQuery, values);
    const dbResult = response.rows[0];
    const parcelId = dbResult.parcel_id;
    const { deliveredon }= dbResult;
    const updateParcelReply = { status: '200', data: [] };
    const message = 'Parcel Delivery Time updated';
    updateParcelReply.data.push({
      parcelId,
      deliveredon,
      message,
    });
    return res.status(200).send(updateParcelReply);
  } catch (err) {
    return res.status(400).send(err);
  }
}; 

/**
   * Get All Parcel Order
   * @param {object} req 
   * @param {object} res 
   * @returns {object} Parcel array
   */
const adminGetAllParcelOrders = async (req, res) => {
  const getAllParcelOrdersQuery = 'SELECT * FROM parcels ORDER BY parcel_id DESC';
  try {
    const { rows } = await dbQuery.query(getAllParcelOrdersQuery);
    const dbResponse = rows;
    const getAllParcelOrdersReply = { status: '200', data: dbResponse };
    return res.status(200).send(getAllParcelOrdersReply);
  } catch (error) {
    badRequest.description = 'No Parcel Order';
    return res.status(400).send(error);
  }
};

export {
  createAdmin,
  loginAdmin,
  deleteAdmin,
  getAllAdmin,
  getAdminProfile,
  updateAdminProfile,
  updateParcelStatus,
  updateParcelLocation,
  updateDeliveryTime,
  adminGetAllParcelOrders,
};
