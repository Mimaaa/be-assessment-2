'use strict'

const express = require('express')
const { Client } = require('pg')
const dotenv = require('dotenv').config();

const app = express()
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', home)
  .get('/:id', get)
  .listen(process.env.PORT || 1902)

function home(req, res) {
  const result = { errors: [], data: undefined }

  try {
    const client = new Client()
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

function get(req, res) {
  var id = req.params.id
  var result = { errors: [], data: undefined }

  try {
    const client = new Client()
    client.connect()
      .then(() => {
        console.log('connection complete');

        const sql = 'SELECT * FROM lifters WHERE id = $1'
        const params = [id]
        return client.query(sql, params)
      })
      .then((result) => {
        result.data = result.rows[0]
        res.format({
          json: function () {
            return res.json(result)
          },
          html: function () {
            return res.render('detail.ejs', result)
          }
        })
      })
  } catch (err) {
    result.errors.push({ id: 400, title: 'bad request' })
    res.status(400).render('error.ejs', result)
    return
  }
}

