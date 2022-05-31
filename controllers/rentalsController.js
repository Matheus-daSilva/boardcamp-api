import connection from "./../db.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    const { customerId, gameId } = req.query;
    let result
    try {
        if (!customerId && !gameId) {
            result = await connection.query(`SELECT rentals.*, categories.name as "categoryName", customers.name as "customerName", games.name as "gameName", games."categoryId" as "categoryId"
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId"= games.id
            JOIN categories ON games."categoryId" = categories.id
            `);
        }
        if (customerId) {
            result = await connection.query(`SELECT rentals.*, categories.name as "categoryName", customers.name as "customerName", games.name as "gameName", games."categoryId" as "categoryId"
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId"= games.id
            JOIN categories ON games."categoryId" = categories.id
            WHERE rentals."customerId" = $1
            `, [customerId]);
        }
        if (gameId) {
            result = await connection.query(`SELECT rentals.*, categories.name as "categoryName", customers.name as "customerName", games.name as "gameName", games."categoryId" as "categoryId"
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId"= games.id
            JOIN categories ON games."categoryId" = categories.id
            WHERE rentals."gameId" = $1
            `, [gameId]);
        }

        const obj = result.rows.map((item) => {
            return {
                id: item.id,
                customerId: item.customerId,
                gameId: item.gameId,
                rentDate: dayjs(item.rentDate).format("YYYY-MM-DD"),
                daysRented: item.daysRented,
                returnDate: dayjs(item.returnDate).format("YYYY-MM-DD"),
                originalPrice: item.originalPrice,
                delayFee: item.delayFee,
                customer: {
                    id: item.customerId,
                    name: item.name
                },
                game: {
                    id: item.gameId,
                    name: item.game,
                    categoryId: item.categoryId,
                    categoryName: item.categoryName
                }
            }
        })
        return res.status(200).send(obj);
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export async function postRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const date = dayjs().format("YYYY-MM-DD");


    if (daysRented <= 0) return res.sendStatus(400);
    try {
        const categories = await connection.query(`
        SELECT * FROM games WHERE id=$1`, [gameId]);
        if (!categories.rows[0]) {
            res.sendStatus(400)
        }

        const user = await connection.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
        if (!user.rows[0]) {
            res.sendStatus(400);
        }

        const originalPrice = daysRented * categories.rows[0].pricePerDay

        await connection.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice", "returnDate", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, `${date}`, daysRented, originalPrice, null, null]);

        res.sendStatus(201);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

export async function deleteRentals(req, res) {
    const { id } = req.params;
    console.log(id)

    try {
        const validate = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        console.log(validate.rows[0])
        if (!validate.rows[0]) {
            return res.sendStatus(404);
        }
        await connection.query(`DELETE FROM rentals WHERE id=$1`, [id])
        res.sendStatus(201);
    } catch (e) {
        res.status(500).send(e.message)
    }
}
