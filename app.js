const express = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser')

// Web server
const app = express()
app.use(bodyParser.json());
const port = process.env.PORT || 5000

// Database connection
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
.post('/emailfailure', async (req, res) => {
    try {
        const body = req.body
        const signature = body.signature
        const events = body['event-data']
        
        if (!signature || !events) {
            res.status(406).send('missing signature or events')
            return
        }

        // Check that the signature is valid
        const value = signature.timestamp + signature.token
        const hash = crypto.createHmac('sha256',
                    process.env.MAILGUN_WEBHOOK_KEY)
                         .update(value)
                         .digest('hex');
        if (hash !== signature.signature) {
          console.log('Invalid signature');
          return res.end();
        }

        console.log(`body: ${JSON.stringify(body)}`)
        console.log(`params: ${JSON.stringify(req.params)}`)
        console.log(`query: ${JSON.stringify(req.query)}`)
        console.log(`headers: ${JSON.stringify(req.headers)}`)
        // console.log(`all: ${JSON.stringify(req)}}`)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(`Error in emailfailure ${err}`)
        res.sendStatus(500)
    }
  })

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})