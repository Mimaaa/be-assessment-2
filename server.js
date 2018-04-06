'use strict'

const express = require('express')
const { Client } = require('pg')
const multer = require('multer')
const fs = require('fs')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();

const upload = multer({
  dest: 'static/images',
  fileFilter: fileFilter
})

const app = express()
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .get('/', home)
  .get('/add', form)
  .get('/:id', get)
  .post('/', upload.single('image'), add)
  .post('/:id', remove)
  .listen(process.env.PORT || 1902)

function home(req, res) {
  const result = { errors: [], data: undefined }

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
        json: () => { return res.json(result) },
        html: () => { return res.render('home', result) }
      })
    })
    .catch((error) => {
      console.log('er is een error')
      // result.errors.push({ id: 400, title: 'bad request' })
      // res.status(400).render('error', result)
      // return
    })
}

function get(req, res) {
  const id = req.params.id
  const result = { errors: [], data: undefined }

  const client = new Client()
  client.connect()
    .then(() => {
      console.log('Connected with DB');

      const sql = 'SELECT * FROM lifters WHERE id = $1'
      const params = [id]
      return client.query(sql, params)
    })
    .then((result) => {
      console.log(result)
      result.data = result.rows[0]
      res.format({
        json: () => { return res.json(result)},
        html: () => { return res.render('detail', result)}
      })
    })
    .catch((error) => {
      console.log('er is een error')
      // result.errors.push({ id: 400, title: 'bad request' })
      // res.status(400).render('error', result)
      // return
    })
}

function form(req, res) {
  res.render('add')
}

function add(req, res) {
  const result = { errors: [], data: undefined}

  const client = new Client()
  client.connect()
    .then(() => {
      console.log('connection complete');

      const sql = 'INSERT INTO lifters (naam, geslacht, geboortedatum, lichaamsgewicht) VALUES ($1, $2, $3, $4) RETURNING id'
      const params = [req.body.naam, req.body.geslacht, req.body.geboortedatum, +req.body.lichaamsgewicht]
      return client.query(sql, params)
    })
    .then((result) => {
      if (req.file) {
        fs.rename(req.file.path, 'static/images/' + result.rows[0].id + '.jpg')
      }
      console.log(result)
      res.redirect('/' + result.rows[0].id)
    })
    .catch((error) => {
      console.log('er is een error')
      // result.errors.push({ id: 400, title: 'bad request' })
      // res.status(400).render('error', result)
      // return
    })
}

function remove(req, res) {
  const id = req.params.id

  const client = new Client()
  client.connect()
    .then(() => {
      console.log('connection complete');

      const sql = 'DELETE FROM lifters WHERE id = $1'
      const params = [id]
      return client.query(sql, params)
    })
    .then((result) => {
      console.log(result)
      res.redirect('/')
    })
    .catch((error) => {
      console.log('er is een error')
      // result.errors.push({ id: 400, title: 'bad request' })
      // res.status(400).render('error', result)
      // return
    })
}

// https://stackoverflow.com/questions/44171497/express-multer-filefilter-error-handling
function fileFilter(req, file, cb) {
  const extension = file.mimetype.split('/')[0];
  if (extension !== 'image/jpeg') {
    return cb(null, false), new Error('Something went wrong');
  }
  cb(null, true);
};
