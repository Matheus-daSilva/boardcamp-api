import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getCategories } from "./controllers/categoriesController.js";
import { postCategories } from "./controllers/categoriesController.js";
import { getGames } from "./controllers/gamesController.js";
import { postGames } from "./controllers/gamesController.js";


const app = express();
app.use(json());
app.use(cors());
dotenv.config();

app.get("/categories", getCategories);
app.post("/categories", postCategories);
app.get("/games", getGames);
app.post("/games", postGames);


app.listen(process.env.PORT, () => console.log('O servidor está rodando'))