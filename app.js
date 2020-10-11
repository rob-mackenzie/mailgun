const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    console.log(`req:${req}`)
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})