const { values } = require("lodash");
const mysql = require("mysql2");

const database = '';
const pool = mysql.createPool({
    host: '',
    user: '',
    password: '',
    database,
});

const batchSize = 1_000;
const totalSize = 100_000;

let currentId = 1;
const insertBatch = () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`;
        const age = currentId;
        const address = `address-${currentId}`;
        values.push([currentId, name, age, address])
        currentId++;
    }
    if (!values.length) {
        pool.end(err => {
            if (err) console.log();
        })
        return;
    }

    const sql = `Insert into ${database} (id, name, age, address) values ?`;
    pool.query(sql, [values], async function(err, result) {
        if (err) throw err;
        console.log(`Inserted ${result.affectedRows}`);
        await insertBatch();
    })
}

insertBatch().then();


// pool.query()


