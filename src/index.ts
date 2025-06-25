import { env } from './config/env';
import express from 'express';
import coffeeRoutes from './modules/coffee/coffee.route';

const app = express();
const PORT = env.port;

app.use(express.json());

const apiRouter = express.Router();
apiRouter.use('/coffee', coffeeRoutes);
app.use(env.apiPrefix, apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${env.apiPrefix}`);
});
