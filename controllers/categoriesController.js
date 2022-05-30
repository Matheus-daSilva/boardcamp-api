import connection from "./../db.js";


export async function getCategories(req, res) {
    try {
        const result = await connection.query(`SELECT * FROM categories`);
        res.send(result.rows);
    } catch(e) {
        console.log(e);
        res.status(500).send(e.message);
    }
}

export async function postCategories(req, res) {
    const newCategorie = req.body;
    try {
        const result = await connection.query(`
        INSERT INTO categories (name) VALUES ($1)`, [newCategorie.name] )
        res.sendStatus(201)
    } catch(e) {
        console.log(e);
        res.status(500).send(e.message);
    }
}