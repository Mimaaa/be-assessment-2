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

const client = new Client()
client.connect()
console.log('Connected with DB');

const app = express()
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .get('/', home)
  .get('/add', addForm)
  .get('/:id', get)
  .get('/edit/:id', editForm)
  .post('/', upload.single('image'), add)
  .post('/:id', remove)
  .post('/edit/:id', edit)
  .listen(process.env.PORT || 1902)

function home(req, res) {
  const result = { errors: [], data: undefined }
  const sql = 'SELECT * FROM lifters ORDER BY id'

  client.query(sql)
    .then((data) => {
      if (data.rowCount === 0) {
        result.errors.push({ id: 404, title: 'not found' })
        res.status(404).render('error', result)
        return
      } else {
        result.data = data.rows
        res.format({
          json: () => { return res.json(result) },
          html: () => { return res.render('home', result) }
        })
      }
    })
    .catch((error) => {
      result.errors.push({ id: 400, title: 'bad request' })
      res.status(400).render('error', result)
      return
    })
}

function get(req, res) {
  const id = req.params.id
  const result = { errors: [], data: undefined }
  const sql = 'SELECT * FROM lifters WHERE id = $1'
  const params = [id]

  client.query(sql, params)
    .then((data) => {
      if (data.rowCount === 0) {
        result.errors.push({ id: 404, title: 'not found' })
        res.status(404).render('error', result)
        return
      } else {
        result.data = data.rows[0]
        res.format({
          json: () => { return res.json(result) },
          html: () => { return res.render('detail', result) }
        })
      }
    })
    .catch((error) => {
      result.errors.push({ id: 400, title: 'bad request' })
      res.status(400).render('error', result)
      return
    })
}

function addForm(req, res) {
  res.render('add')
}

function add(req, res) {
  const result = { errors: [], data: undefined}
  const sql = 'INSERT INTO lifters (naam, geslacht, geboortedatum, lichaamsgewicht) VALUES ($1, $2, $3, $4) RETURNING id'
  const params = [req.body.naam, req.body.geslacht, req.body.geboortedatum, +req.body.lichaamsgewicht]

  client.query(sql, params)
    .then((data) => {
      if (data.rowCount === 0) {
        result.errors.push({ id: 422, title: 'unprocessable entity' })
        res.status(422).render('error', result)
        return
      } else {
        // if (req.file) {
        //   fs.rename(req.file.path, 'static/images/' + data.rows[0].id + '.jpg')
        // }
        // console.log(data)
        res.redirect('/' + data.rows[0].id)
      }
    })
    .catch((error) => {
      console.log('er is een error')
      result.errors.push({ id: 400, title: 'bad request' })
      res.status(400).render('error', result)
      return
    })
}

function remove(req, res) {
  const id = req.params.id
  const sql = 'DELETE FROM lifters WHERE id = $1'
  const params = [id]

  client.query(sql, params)
    .then((data) => {
      if (data.rowCount === 0) {
        result.errors.push({ id: 404, title: 'not found' })
        res.status(404).render('error', result)
        return
      } else {
        res.redirect('/')
      }
    })
    .catch((error) => {
      result.errors.push({ id: 400, title: 'bad request' })
      res.status(400).render('error', result)
      return
    })
}

function editForm(req, res) {
  const id = req.params.id
  const result = { errors: [], data: undefined }
  const sql = 'SELECT * FROM lifters WHERE id = $1'
  const params = [id]

  client.query(sql, params)
    .then((data) => {
      if (data.rowCount === 0) {
        result.errors.push({ id: 404, title: 'not found' })
        res.status(404).render('error', result)
        return
      } else {
        result.data = data.rows[0]
        res.format({
          json: () => { return res.json(result) },
          html: () => { return res.render('edit', result) }
        })
      }
    })
    .catch((error) => {
      result.errors.push({ id: 400, title: 'bad request' })
      res.status(400).render('error', result)
      return
    })
}

function edit(req, res) {
  const result = { errors: [], data: undefined }
  const sql = 'UPDATE lifters SET naam = $1, geslacht = $2, geboortedatum = $3, lichaamsgewicht = $4 WHERE id = $5'
  const params = [req.body.naam, req.body.geslacht, req.body.geboortedatum, +req.body.lichaamsgewicht, req.params.id]

  client.query(sql, params)
    .then((data) => {
      if (data.rowCount === 0) {
        result.errors.push({ id: 422, title: 'unprocessable entity' })
        res.status(422).render('error', result)
        return
      } else {
        // if (req.file) {
        //   fs.rename(req.file.path, 'static/images/' + data.rows[0].id + '.jpg')
        // }
        // console.log(data)
        res.redirect('/' + req.params.id)
      }
    })
    .catch((error) => {
      result.errors.push({ id: 400, title: 'bad request' })
      res.status(400).render('error', result)
      return
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
