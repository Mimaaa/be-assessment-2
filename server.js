'use strict'

const express = require('express')
const { Client } = require('pg')
const multer = require('multer')
const fs = require('fs')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();

const app = express()
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .get('/', home)
  .get('/add', form)
  .get('/:id', get)
  .post('/', add)
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
            return res.render('home', result)
          }
        })
      })
  } catch (err) {
    result.errors.push({ id: 400, title: 'bad request' })
    res.status(400).render('error', result)
    return
  }
}

function get(req, res) {
  const id = req.params.id
  const result = { errors: [], data: undefined }

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
            return res.render('detail', result)
          }
        })
      })
  } catch (err) {
    result.errors.push({ id: 400, title: 'bad request' })
    res.status(400).render('error', result)
    return
  }
}

function form(req, res) {
  res.render('add')
}

function add(req, res) {
  const result = { errors: [], data: undefined}
  const body = req.body

  const lifterInformation = {
    naam: body.naam,
    geslacht: body.geslacht,
    geboortedatum: body.geboortedatum,
    lichaamsgewicht: +body.lichaamsgewicht
  }
  console.log(lifterInformation)

  try {
    const client = new Client()
    client.connect()
      .then(() => {
        console.log('connection complete');

        const sql = 'INSERT INTO lifters (naam, geslacht, geboortedatum, lichaamsgewicht) VALUES ($1, $2, $3, $4)'
        const params = [lifterInformation.naam, lifterInformation.geslacht, lifterInformation.geboortedatum, lifterInformation.lichaamsgewicht]
        return client.query(sql, params)
      })
      .then((result) => {
        console.log('result?', result)
        res.redirect('/')
      })
  } catch (err) {
    result.errors.push({ id: 422, title: 'unprocessable entity' })
    res.status(422).render('error.ejs', Object.assign({}, result, helpers))
    console.log(err)
    return
  }
}
