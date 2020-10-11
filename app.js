const express = require('express')
const crypto = require('crypto')
const multer = require('multer')
const bodyParser = require('body-parser')


const app = express()
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}))
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
      console.log(`body: ${JSON.stringify(body)}`)
      console.log(`params: ${JSON.stringify(req.params)}`)
      console.log(`query: ${JSON.stringify(req.query)}`)
      console.log(`headers: ${JSON.stringify(req.headers)}`)
      // console.log(`all: ${JSON.stringify(req)}}`)
      res.sendStatus(200)
  })

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})