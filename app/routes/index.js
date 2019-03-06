import parcelRoutes from './parcelRoutes';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';

const parcelRoute = parcelRoutes;
const userRoute = userRoutes;
const adminRoute = adminRoutes;


export default function router(app) {
  parcelRoute(app);
  userRoute(app);
  adminRoute(app);

  // Other route groups could go here, in the future
}
