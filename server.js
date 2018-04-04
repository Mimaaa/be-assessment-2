'use strict'

const express = require('express')
const { Client } = require('pg')
const dotenv = require('dotenv').config();

const app = express()
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', home)
  .listen(process.env.PORT || 1902)

function home(req, res) {
  var result = { errors: [], data: undefined }

  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    })
    client.connect()
      .then(() => {
        console.log('connection complete');

        const sql = 'SELECT * FROM lifters'
        return client.query(sql)
      })
      .then((result) => {
        result.data = result.rows
        res.format({
          json: function () {
            return res.json(result)
          },
          html: function () {
            return res.render('home.ejs', result)
          }
        })
      })
  } catch (err) {
    result.errors.push({ id: 400, title: 'bad request' })
    res.status(400).render('error.ejs', result)
    return
  }
}


