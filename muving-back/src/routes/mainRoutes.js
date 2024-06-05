"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mainController_1 = require("../controllers/mainController");
const mainRouter = express_1.default.Router();
mainRouter.get('/scrape', mainController_1.scraper);
exports.default = mainRouter;
