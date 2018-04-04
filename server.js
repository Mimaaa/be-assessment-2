'use strict'

const express = require('express')
const dotenv = require('dotenv').config();

const app = express()
  .listen(process.env.PORT)
