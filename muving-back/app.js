"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appConfig_1 = __importDefault(require("./src/config/appConfig"));
const mainRoutes_1 = __importDefault(require("./src/routes/mainRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', mainRoutes_1.default);
app.listen(appConfig_1.default.port, () => {
    console.log(`Port ${appConfig_1.default.port} ready`);
});
