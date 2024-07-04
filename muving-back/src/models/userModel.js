"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
class User {
    static create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = userData;
            let { name, img_link } = userData;
            if (typeof name === 'undefined')
                name = 'Muving user';
            if (typeof img_link === 'undefined')
                img_link = '1';
            const sql = 'INSERT INTO user (email, password, name, img_link) VALUES (?, ?, ?, ?)';
            const sqlParam = [email, password, name, img_link];
            const [result] = yield dbConfig_1.default.query(sql, sqlParam);
            return result;
        });
    }
}
exports.default = User;
