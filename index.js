import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getCategories } from "./controllers/categoriesController.js";
import { postCategories } from "./controllers/categoriesController.js";
import { getGames } from "./controllers/gamesController.js";
import { postGames } from "./controllers/gamesController.js";
import { getCustumers } from "./controllers/customersController.js";
import { getOneCustumer } from "./controllers/customersController.js";
import { postCustumers } from "./controllers/customersController.js";
import { putCustumers } from "./controllers/customersController.js";
import { postRental } from "./controllers/rentalsController.js";
import { getRentals } from "./controllers/rentalsController.js";
import { deleteRentals } from "./controllers/rentalsController.js";

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

app.get("/categories", getCategories);
app.post("/categories", postCategories);
app.get("/games", getGames);
app.post("/games", postGames);
app.get("/customers", getCustumers);
app.get("/customers/:id", getOneCustumer);
app.post("/customers", postCustumers);
app.put("/customers/:id", putCustumers)
app.get("/rentals", getRentals);
app.post("/rentals", postRental);
app.delete("/rentals/:id", deleteRentals);


app.listen(process.env.PORT, () => console.log('O servidor está rodando'))