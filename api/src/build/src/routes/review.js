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
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const review = express_1.default.Router();
review.post("/client", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //recibe id del client que es destinatario de la review
    const { id, idOffer, review } = req.body;
    try {
        let response;
        //si la review va dirigida al Client, de ejecuta la funcion de review para clients
        response = yield (0, reviewController_1.postReviewClient)(id, idOffer, review);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
}));
review.post("/worker", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //recibe id del worker qeu es destinatario de la review
    const { id, idOffer, review } = req.body;
    try {
        let response;
        //si la review va dirigida al Worker, de ejecuta la funcion de review para workers
        response = yield (0, reviewController_1.postReviewWorker)(id, idOffer, review);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = review;
