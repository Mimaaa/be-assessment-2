'use strict'

const express = require('express')
const session = require('express-session')
const { Client } = require('pg')
const multer = require('multer')
const fs = require('fs')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();
const argon2 = require('argon2')

const upload = multer({
  dest: 'static/images'
})

const client = new Client()
client.connect()
console.log('Connected with DB');

const app = express()
  .use(express.static('static'))
  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(bodyParser.json())
  .get('/', home)
  .post('/', upload.single('image'), add)
  .get('/add', addForm)
  .get('/signup', signupForm)
  .post('/signup', signup)
  .get('/:id', get)
  .get('/edit/:id', editForm)
  .post('/:id', remove)
  .post('/edit/:id', upload.single('image'), edit)
  // .get('/login', loginForm)
  // .post('/login', login)
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
  // const result = { errors: [], data: undefined }
  // if (req.session.user) {
  //   res.format({
  //     json: () => { return res.json(result) },
  //     html: () => { return res.render('add', result) }
  //   })
  // } else {
  //   result.errors.push({ id: 401, title: 'unauthorized' })
  //   res.status(401).render('error', result)
  //   return
  // }
}

function add(req, res) {
  const result = { errors: [], data: undefined}
  // if (!req.session.user) {
  //   result.errors.push({ id: 401, title: 'unauthorized' })
  //   res.status(401).render('error', result)
  //   return
  // }

  // const findLastId = 'SELECT MAX(id) FROM lifters'
  // let lastId

  // client.query(findLastId)
  //   .then((data) => {
  //     lastId = data.rows[0]
  //   })

  const sql = `INSERT INTO lifters (naam, geslacht, geboortedatum, lichaamsgewicht) VALUES ($1, $2, $3, $4) RETURNING id`
  const params = [req.body.naam, req.body.geslacht, req.body.geboortedatum, +req.body.lichaamsgewicht]

  client.query(sql, params)
    .then((data) => {
      if (data.rowCount === 0) {
        result.errors.push({ id: 422, title: 'unprocessable entity' })
        res.status(422).render('error', result)
        return
      } else {
        if (req.file) {
          fs.rename(req.file.path, 'static/images/'+data.rows[0].id+'.jpg')
        }
        res.redirect('/' + data.rows[0].id)
      }
    })
    .catch((error) => {
      console.log(error)
      result.errors.push({ id: 400, title: 'bad request' })
      res.status(400).render('error', result)
      return
    })
}

function remove(req, res) {
  const result = { errors: [], data: undefined }
  // if (!req.session.user) {
  //   result.errors.push({ id: 401, title: 'unauthorized' })
  //   res.status(401).render('error', result)
  //   return
  // }
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
  const result = { errors: [], data: undefined }
  // if (!req.session.user) {
  //   result.errors.push({ id: 401, title: 'unauthorized' })
  //   res.status(401).render('error', result)
  //   return
  // }
  const id = req.params.id
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
  // if (!req.session.user) {
  //   result.errors.push({ id: 401, title: 'unauthorized' })
  //   res.status(401).render('error', result)
  //   return
  // }

  const sql = 'UPDATE lifters SET naam = $1, geslacht = $2, geboortedatum = $3, lichaamsgewicht = $4 WHERE id = $5'
  const params = [req.body.naam, req.body.geslacht, req.body.geboortedatum, +req.body.lichaamsgewicht, req.params.id]

  client.query(sql, params)
    .then((data) => {
      if (data.rowCount === 0) {
        result.errors.push({ id: 422, title: 'unprocessable entity' })
        res.status(422).render('error', result)
        return
      } else {
        if (req.file) {
          fs.rename(req.file.path, 'static/images/'+req.params.id+'.jpg')
        }
        res.redirect('/' + req.params.id)
      }
    })
    .catch((error) => {
      result.errors.push({ id: 400, title: 'bad request' })
      res.status(400).render('error', result)
      return
    })
}

function signupForm(req, res) {
  res.render('signup')
}

function signup(req, res) {
  // const result = { errors: [], data: undefined }
  const username = req.body.gebruikersnaam
  const password = req.body.wachtwoord

  console.log(req.body.gebruikersnaam)

  // if (!gebruikersnaam || !wachtwoord) {
  //   result.errors.push({ id: 400, title: 'bad request' })
  //   res.status(400).render('error', result)
  //   return
  // }

  // const sql = 'SELECT * FROM lifters WHERE gebruikersnaam = $1'
  // const params = [username]

  // client.query(sql, params)
  //   .then((data) => {
  //     if (data.rowCount === 0) {
  //       argon2.hash(password)
  //       .then(onhash)
  //     } else {
  //       result.errors.push({ id: 409, title: 'conflict' })
  //       res.status(409).render('error', result)
  //       return
  //     }
  //   })
  //   .catch((error) => {
  //     result.errors.push({ id: 400, title: 'bad request' })
  //     res.status(400).render('error', result)
  //     return
  //   })
  
  // function onhash(hash) {
  //   const sql = `INSERT INTO gebruikers (username, password) VALUES ($1, $2)`
  //   const params = [username, hash]

  //   client.query(sql, params)
  //     .then((data) => {
  //       if (data.rowCount === 0) {
  //         result.errors.push({ id: 422, title: 'unprocessable entity' })
  //         res.status(422).render('error', result)
  //         return
  //       } else {
  //         req.session.user = { username: username }
  //         res.redirect('/')
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //       result.errors.push({ id: 400, title: 'bad request' })
  //       res.status(400).render('error', result)
  //       return
  //     })
  // }
}

// function loginForm(req, res) {
//   res.render('login')
// }

// function login(req, res) {
//   const result = { errors: [], data: undefined }
//   const username = req.body.username
//   const password = req.body.password

//   console.log(req.body.username)

//   if (!gebruikersnaam || !wachtwoord) {
//     result.errors.push({ id: 400, title: 'bad request' })
//     res.status(400).render('error', result)
//     return
//   }

//   const sql = 'SELECT * FROM lifters WHERE gebruikersnaam = $1'
//   const params = [username]

//   client.query(sql, params)
//     .then((data) => {
//       const user = data.rows[0]
//       console.log(data)
//       if (data.rowCount === 0) {
//         result.errors.push({ id: 409, title: 'conflict' })
//         res.status(409).render('error', result)
//         return
//       } else if(user) {
//         argon2.verify(user.hash, password)
//           .then(onverify)
//       } else {
//         result.errors.push({ id: 409, title: 'conflict' })
//         res.status(409).render('error', result)
//         return
//       }
//     })
//     .catch((error) => {
//       console.log(error)
//       result.errors.push({ id: 400, title: 'bad request' })
//       res.status(400).render('error', result)
//       return
//     })

//     function onverify(match) {
//       if (match) {
//         req.session.user = { username: user.username };
//         res.redirect('/')
//       } else {
//         res.status(401).send('Password incorrect')
//       }
//     }
// }
