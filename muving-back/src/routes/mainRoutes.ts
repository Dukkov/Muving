import express from 'express';
import { scraper } from '../controllers/mainController';

const mainRouter = express.Router();
// mainRouter.get('/', sayHi);
mainRouter.get('/scrape', scraper);

export default mainRouter;
