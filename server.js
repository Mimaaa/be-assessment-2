'use strict'

const express = require('express')
const Client = require('pg').Client
const dotenv = require('dotenv').config();

const app = express()
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', home)
  .listen(process.env.PORT || 1902)


function home(req, res) {
  res.render('home')
}
