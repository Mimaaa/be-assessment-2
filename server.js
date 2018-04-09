'use strict';

const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const {Client} = require('pg');
const multer = require('multer');
const bodyParser = require('body-parser');
require('dotenv').config();

const upload = multer({
  dest: 'static/images'
});

const client = new Client();
client.connect();
console.log('Connected with DB');

express()
  .use(helmet())
  .use(express.static('static'))
  .use(bodyParser.json())
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', home)
  .get('/add', addForm)
  .get('/signup', signupForm)
  .get('/login', loginForm)
  .get('/:id', get)
  .get('/edit/:id', editForm)
  .post('/', upload.single('image'), add)
  .post('/:id', remove)
  .post('/edit/:id', upload.single('image'), edit)
  .listen(process.env.PORT || 1902);

function home(req, res) {
  const result = {errors: [], data: undefined};
  const sql = 'SELECT * FROM lifters ORDER BY id';

  client.query(sql)
    .then(data => {
      if (data.rowCount === 0) {
        result.errors.push({id: 404, title: 'not found'});
        res.status(404).render('error', result);
      } else {
        result.data = data.rows;
        res.format({
          json: () => {
            return res.json(result);
          },
          html: () => {
            return res.render('home', result);
          }
        });
      }
    })
    .catch(error => {
      console.log(error);
      result.errors.push({id: 400, title: 'bad request'});
      res.status(400).render('error', result);
    });
}

function get(req, res) {
  const result = {errors: [], data: undefined};
  const sql = 'SELECT * FROM lifters WHERE id = $1';
  const params = [req.params.id];

  client.query(sql, params)
    .then(data => {
      if (data.rowCount === 0) {
        result.errors.push({id: 404, title: 'not found'});
        res.status(404).render('error', result);
      } else {
        result.data = data.rows[0];
        res.format({
          json: () => {
            return res.json(result);
          },
          html: () => {
            return res.render('detail', result);
          }
        });
      }
    })
    .catch(error => {
      console.log(error);
      result.errors.push({id: 400, title: 'bad request'});
      res.status(400).render('error', result);
    });
}

function addForm(req, res) {
  res.render('add');
}

function add(req, res) {
  const result = {errors: [], data: undefined};

  // Const findLastId = 'SELECT MAX(id) FROM lifters'
  // let lastId

  // client.query(findLastId)
  //   .then((data) => {
  //     lastId = data.rows[0]
  //   })

  const sql = `INSERT INTO lifters (naam, geslacht, geboortedatum, lichaamsgewicht) VALUES ($1, $2, $3, $4) RETURNING id`;
  const params = [req.body.naam, req.body.geslacht, req.body.geboortedatum, Number(req.body.lichaamsgewicht)];

  client.query(sql, params)
    .then(data => {
      if (data.rowCount === 0) {
        result.errors.push({id: 422, title: 'unprocessable entity'});
        res.status(422).render('error', result);
      } else {
        if (req.file) {
          fs.rename(req.file.path, 'static/images/' + data.rows[0].id + '.jpg');
        }
        res.redirect('/' + data.rows[0].id);
      }
    })
    .catch(error => {
      console.log(error);
      result.errors.push({id: 400, title: 'bad request'});
      res.status(400).render('error', result);
    });
}

function remove(req, res) {
  const result = {errors: [], data: undefined};
  const sql = 'DELETE FROM lifters WHERE id = $1';
  const params = [req.params.id];

  client.query(sql, params)
    .then(data => {
      if (data.rowCount === 0) {
        result.errors.push({id: 404, title: 'not found'});
        res.status(404).render('error', result);
      } else {
        res.redirect('/');
      }
    })
    .catch(error => {
      console.log(error);
      result.errors.push({id: 400, title: 'bad request'});
      res.status(400).render('error', result);
    });
}

function editForm(req, res) {
  const result = {errors: [], data: undefined};
  const sql = 'SELECT * FROM lifters WHERE id = $1';
  const params = [req.params.id];

  client.query(sql, params)
    .then(data => {
      if (data.rowCount === 0) {
        result.errors.push({id: 404, title: 'not found'});
        res.status(404).render('error', result);
      } else {
        result.data = data.rows[0];
        res.format({
          json: () => {
            return res.json(result);
          },
          html: () => {
            return res.render('edit', result);
          }
        });
      }
    })
    .catch(error => {
      console.log(error);
      result.errors.push({id: 400, title: 'bad request'});
      res.status(400).render('error', result);
    });
}

function edit(req, res) {
  const result = {errors: [], data: undefined};
  const sql = 'UPDATE lifters SET naam = $1, geslacht = $2, geboortedatum = $3, lichaamsgewicht = $4 WHERE id = $5';
  const params = [req.body.naam, req.body.geslacht, req.body.geboortedatum, Number(req.body.lichaamsgewicht), req.params.id];

  client.query(sql, params)
    .then(data => {
      if (data.rowCount === 0) {
        result.errors.push({id: 422, title: 'unprocessable entity'});
        res.status(422).render('error', result);
      } else {
        if (req.file) {
          fs.rename(req.file.path, 'static/images/' + req.params.id + '.jpg');
        }
        res.redirect('/' + req.params.id);
      }
    })
    .catch(error => {
      console.log(error);
      result.errors.push({id: 400, title: 'bad request'});
      res.status(400).render('error', result);
    });
}

function signupForm(req, res) {
  res.render('signup');
}

function loginForm(req, res) {
  res.render('login');
}
