/* eslint-disable import/named */
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import 'babel-polyfill';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import router from './app/routes';
// import { createAllTables, dropAllTables } from './app/db/db';

const port = process.env.PORT || 4000;

const swaggerDocument = YAML.load(path.join(process.cwd(), './swagger/swagger.yaml'));

// createAllTables();
// dropAllTables();
dotenv.config();

// create express app
const app = express();
// const entries = [];
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router(app);

// listen for requests
const server = app.listen(port, () => {
  console.log(`Server is listening at this port ${port}`);
});

export default server;
