"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const appConfig = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000
};
exports.default = appConfig;
