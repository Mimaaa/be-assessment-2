'use strict'

const express = require('express')
const dotenv = require('dotenv').config();

const app = express()
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', home)
  .listen(process.env.PORT || 1902)


function home(req, res) {
  res.render('home')
}
