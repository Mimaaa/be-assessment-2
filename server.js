'use strict'

const express = require('express')
const dotenv = require('dotenv').config();

const app = express()
  .set('view engine', 'ejs')
  .set('views', 'view')
  .listen(process.env.PORT || 1902)
