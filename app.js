const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const {Pool} = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

app.get('/', (req, res) => {
    console.log(`req:${req}`)
    res.send('Hello World!')
})
.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.send(results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .post('/emailfailure', (req, res) => {
      const body = req.body;
      console.log(`body: ${body}`)
      console.log(`params: ${req.params}`)
      console.log(`query: ${req.query}`)
      console.log(`headers: ${JSON.stringify(req.headers)}`)
      // console.log(`all: ${JSON.stringify(req)}}`)
      res.sendStatus(200)
  })

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})