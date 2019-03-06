
import moment from 'moment';

import dbQuery from '../db/dbquery';

import { isEmpty } from '../helpers';

const badRequest = { status: '400', message: 'Bad Request' };
const notFound = { status: '404', message: 'Not Found' };
const noContent = { status: '204', message: 'No Content' };
const conflictExists = { status: '409', message: 'Conflict' };

/**
   * Create A Parcel Delivery Order
   * @param {object} req
   * @param {object} res
   * @returns {object} Parcel object
   */

const createParcel = async (req, res) => {
  const {
    parcelname, weight, weightmetric, fromaddress, toaddress,
  } = req.body;
  const sentOn = moment(new Date());
  // eslint-disable-next-line camelcase
  const { user_id } = req.user;
  if (isEmpty(parcelname) || isEmpty(weight) || isEmpty(weightmetric) || isEmpty(fromaddress) || isEmpty(toaddress)) {
    badRequest.description = 'All starred field must be filled up';
    return res.status(400).send(badRequest);
  }
  const createParcelQuery = `INSERT INTO
      parcels ( placedby, parcelname, weight, weightmetric, senton, fromaddress, toaddress)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
  const values = [
  // eslint-disable-next-line camelcase
    user_id,
    parcelname,
    weight,
    weightmetric,
    sentOn,
    fromaddress,
    toaddress,
  ];

  try {
    const { rows } = await dbQuery.query(createParcelQuery, values);
    const dbResponse = rows[0];
    const parcelId = dbResponse.parcel_id;
    const createParcelReply = { status: '201', data: [] };
    const message = 'Order Created';
    createParcelReply.data.push({
      parcelId,
      message,
    });
    return res.status(201).send(createParcelReply);
  } catch (error) {
    return res.status(400).send(error);
  }
};

/**
   * Get All Parcel Order
   * @param {object} req 
   * @param {object} res 
   * @returns {object} Parcel array
   */
const getAllParcelOrders = async (req, res) => {
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

/**
   * Get A Parcel
   * @param {object} req 
   * @param {object} res
   * @returns {object} Parcel object
   */
const getAparcel = async (req, res) => {
  const { id } = req.params;
  // eslint-disable-next-line camelcase
  const { user_id } = req.user;
  const getAparcelQuery = 'SELECT * FROM parcels WHERE parcel_id = $1 AND placedby = $2';
  try {
  // eslint-disable-next-line camelcase
    const { rows } = await dbQuery.query(getAparcelQuery, [id, user_id]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      notFound.description = 'Parcels Not Found';
      return res.status(404).send(notFound);
    }
    const getAparcelReply = { status: '200', data: [] };
    getAparcelReply.data.push(dbResponse);
    return res.status(200).send(getAparcelReply);
  } catch (error) {
    return res.status(400).send(error);
  }
};

/**
   * Get Parcels For A User
   * @param {object} req 
   * @param {object} res
   * @returns {object} Parcel object
   */
const getAllParcelforUser = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { user_id } = req.user;
  const getAllParcelForUserQuery = 'SELECT * FROM parcels WHERE placedby = $1 ORDER BY parcel_id DESC';
  try {
    // eslint-disable-next-line camelcase
    const { rows } = await dbQuery.query(getAllParcelForUserQuery, [user_id]);
    const dbResponse = rows;
    // const dbRowCount = rowCount;
    if (!dbResponse) {
      notFound.description = 'Users Parcels order Not Found';
      return res.status(404).send(notFound);
    }
    const getAparcelReply = { status: '200', data: dbResponse };
    // getAparcelReply.data.push(dbRowCount);
    return res.status(200).send(getAparcelReply);
  } catch (error) {
    return res.status(400).send(error);
  }
};

/**
   * Delete A Parcel
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
const cancelParcelOrder = async (req, res) => {
  const { id } = req.params;
  // eslint-disable-next-line camelcase
  const { user_id } = req.user;
  const cancelParcelQuery = 'DELETE FROM parcels WHERE parcel_id=$1 AND placedby = $2 returning *';
  try {
  // eslint-disable-next-line camelcase
    const { rows } = await dbQuery.query(cancelParcelQuery, [id, user_id]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      notFound.description = 'Users Parcels order Not Found';
      return res.status(404).send(notFound);
    }
    const cancelParcelReply = { status: '200', data: [] };
    const message = 'Order Cancelled';
    cancelParcelReply.data.push({
      id,
      message,
    });
    return res.status(200).send(cancelParcelReply);
  } catch (error) {
    return res.status(400).send(error);
  }
};

  /**
 * Update A Reflection
 * @param {object} req 
 * @param {object} res 
 * @returns {object} updated reflection
 */
const updateParcelDestination = async (req, res) => {
  const { id } = req.params;
  const { toaddress } = req.body;
  // eslint-disable-next-line camelcase
  const { user_id } = req.user;
  if (isEmpty(toaddress)) {
    badRequest.description = 'Parcel Destination cannot be empty';
    return res.status(400).send(badRequest);
  }
  const findAparcelQuery = 'SELECT * FROM parcels WHERE parcel_id=$1 AND placedby = $2';
  const updateParcelQuery =`UPDATE parcels
    SET toaddress=$1 WHERE parcel_id=$2 AND placedby = $3 returning *`;
  try {
  // eslint-disable-next-line camelcase
    const { rows } = await dbQuery.query(findAparcelQuery, [id, user_id]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      notFound.description = 'Parcel order Not Found';
      return res.status(404).send(notFound);
    }
    const values = [
      toaddress,
      id,
      // eslint-disable-next-line camelcase
      user_id,
    ];
    const response = await dbQuery.query(updateParcelQuery, values);
    const dbResult = response.rows[0];
    const parcelId = dbResult.parcel_id;
    const to = dbResult.toaddress;
    const updateParcelReply = { status: '200', data: [] };
    const message = 'Parcel destination updated';
    updateParcelReply.data.push({
      parcelId,
      to,
      message,
    });
    return res.status(200).send(updateParcelReply);
  } catch (err) {
    return res.status(400).send(err);
  }
}; 
export {
  createParcel,
  getAllParcelOrders,
  getAparcel,
  getAllParcelforUser,
  cancelParcelOrder,
  updateParcelDestination,
};
