import connection from "./../db.js";


export async function getCategories(req, res) {
    try {
        const result = await connection.query(`SELECT * FROM categories`);
        res.send(result.rows);
    } catch(e) {
        res.status(500).send(e.message);
    }
}

export async function postCategories(req, res) {
    const newCategorie = req.body;
    try {
        if (!newCategorie.name) return res.senStatus(400);

        const categories = await connection.query(`
        SELECT * FROM categories WHERE name=$1`, [newCategorie.name]);

        if (categories.rows.length !== 0) {
            res.sendStatus(409)
        }

        const result = await connection.query(`
        INSERT INTO categories (name) VALUES ($1)`, [newCategorie.name] )
        res.sendStatus(201)
    } catch(e) {
        console.log(e);
        res.status(500).send(e.message);
    }
}