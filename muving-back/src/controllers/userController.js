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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = void 0;
const userService_1 = require("../services/userService");
const checkEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.body;
    if (!address) {
        res.status(400).json({ message: 'Invalid email address' });
        return;
    }
    try {
        const emailExists = yield (0, userService_1.checkEmailService)(address);
        if (emailExists)
            res.status(400).json({ message: 'Invalid email address' });
        else
            res.status(200).json({ message: 'Valid email address' });
    }
    catch (err) {
        res
            .status(500)
            .json({
            error: err.message,
            message: 'There is something wrong with the server'
        });
    }
});
exports.checkEmail = checkEmail;
