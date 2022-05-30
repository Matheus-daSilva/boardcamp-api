import connection from "./../db.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    const { customerId, gameId } = req.query;

    if(!customerId) return res.sendStatus(409);
    if(!gameId) return res.sendStatus(409);
    try {
        const result = await connection.query(`SELECT rentals.*, categories.name as "categoryName", customers.name as "customerName", games.name as "gameName", games.categoryId as "categoryId"
        FROM rentals
        JOIN customers ON rentals.'customerId' = customers.id
        JOIN games ON rentals.'gameId'= games.id
        JOIN categories ON games.'categoryId" = categories.id
        WHERE rentals.'customerId' = $1
        `, [customerId]);
        
        return res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export async function postRental(req, res) {
    const { pricePerDay } = res.locals;
    const { customerId, gameId, daysRented } = req.body;
    const date = dayjs().format("YYYY-MM-DD");
    const originalPrice = daysRented * pricePerDay;
    try {

        if(daysRented <= 0) return res.sendStatus(400);

        const categories = await connection.query(`
        SELECT * FROM games WHERE categoryId=$1`, [gameId]);
        if (categories.rows.length === 0) {
            res.sendStatus(400)
        }

        const user = await connection.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
        if (user.rows.length === 0) {
            res.sendStatus(400);
        }
    
        await connection.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice", "returnDate", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
        [customerId, gameId, `${date}`, daysRented, originalPrice, null, null]);

        res.sendStatus(201);
    } catch (e) {
        return res.sendStatus(500);
    }
}