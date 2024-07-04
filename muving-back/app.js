"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appConfig_1 = __importDefault(require("./src/config/appConfig"));
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/user', userRoutes_1.default);
app.get('/', (_, res) => {
    res.status(200).json({ message: 'Hello!' });
});
app.listen(appConfig_1.default.port, () => {
    console.log(`Port ${appConfig_1.default.port} ready`);
});
