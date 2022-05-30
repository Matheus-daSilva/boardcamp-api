import connection from "./../db.js";

export async function getCustumers(req, res) {
    try {
        const result = await connection.query(`SELECT * FROM customers`);
        res.send(result.rows);
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export async function getOneCustumer(req, res) {
    const { id } = req.params;
    try {
        const result = await connection.query(`SELECT * FROM customers WHERE id=$1`, [id]);
        if (result.rows.length !== 0) {
            res.sendStatus(404);
        }

        res.send(result.rows);
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export async function postCustumers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        if (!name) return res.sendStatus(400);
        if (cpf.length !== 11) return res.sendStatus(400);
        if (phone.length < 10 || phone.length > 11) return res.sendStatus(400);

        const user = await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);

        if (user.rows.length !== 0) {
            res.sendStatus(409);
        }

        await connection.query(`
        INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday])
        res.sendStatus(201)
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export async function putCustumers(req, res) {
    const { custumersId } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        if (!name) return res.sendStatus(400);
        if (cpf.length !== 11) return res.sendStatus(400);
        if (phone.length < 10 || phone.length > 11) return res.sendStatus(400);

        const user = await connection.query(`SELECT * FROM customers WHERE id=$1`, [custumersId]);

        if (user.rows.length !== 0) {
            res.sendStatus(409);
        }

        await connection.query(`
        UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 
        WHERE id=$5`, [name, phone, cpf, birthday, custumersId])
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send(e.message);
    }
}