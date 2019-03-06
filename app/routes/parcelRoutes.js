import { 
  createParcel,
  getAllParcelOrders,
  getAparcel,
  getAllParcelforUser,
  cancelParcelOrder,
  updateParcelDestination,
} from '../controller/parcelsController';
import verifyAuth from '../middlewares/verifyAuth';

export default function route(app) {
  // const badRequest = { status: 400, message: 'Bad Request' };

  // Get Request for a single Parcel
  app.get('/api/v1/parcels/:id', verifyAuth, getAparcel);


  // // Get request for all Parcels order by a user
  app.get('/api/v1/users/parcels', verifyAuth, getAllParcelforUser);


  // // Post Request for a parcel entry
  app.post('/api/v1/parcels', verifyAuth, createParcel);

  // Delete Request to delete A parcel
  app.patch('/api/v1/parcels/:id/cancel', verifyAuth, cancelParcelOrder);

  app.patch('/api/v1/parcels/:id/destination', verifyAuth, updateParcelDestination);

  // Fetch all parcel delivery orders
  // app.get('/api/v1/parcels', getAllParcelOrders);



  // // Put Request to modify the content of an entryRoutes
  // app.put('/api/v1/entries/:id', checkAuth, updateEntry);

}
