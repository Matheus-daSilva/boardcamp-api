import connection from "./../db.js";

export async function getGames(req, res) {
    const { validateName }= req.query;
    try {
        if (validateName) {
            const result = await connection.query(`
            SELECT games.*, categories.name as "categoryName" 
            FROM games 
            JOIN categories ON games."categoryId" = categories.id
            WHERE lower(games.name) LIKE '%${validateName}%';`);
            res.status(200).send(result.rows);
        }
        else {
            const result2 = await connection.query(`
            SELECT games.*, categories.name as "categoryName" 
            FROM games
            JOIN categories ON games."categoryId" = categories.id;`);
            res.status(200).send(result2.rows);
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    try {
        if (!name) return res.sendStatus(400);

        if (stockTotal <= 0 && pricePerDay <= 0) return res.sendStatus(400);

        const categories = await connection.query(`
        SELECT * FROM categories WHERE categoryId=$1`, [categoryId]);

        if (categories.rows.length !== 0) {
            res.sendStatus(409)
        }

        await connection.query(`
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay])
        res.sendStatus(201)
    } catch (e) {
        res.status(500).send(e.message);
    }
}