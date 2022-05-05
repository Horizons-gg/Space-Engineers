//!
//! Modules
//!

process.env = require('./config.json')

const fs = require('fs')



//!
//! MongoDb
//!

const MongoClient = require('mongodb').MongoClient
MongoClient.connect(`mongodb://${process.env.db.host}:${process.env.db.port}`, async function (err, db) {
    if (err) throw err;
    console.log('Connected to the database.')
    process.db = db.db(process.env.db.database)
})



//!
//! Discord
//!

// const { Client, Intents } = require('discord.js')
// var selectedIntents = []
// for (intent in Intents.FLAGS) { selectedIntents.push(Intents.FLAGS[intent]) }
// const client = new Client({ intents: selectedIntents })
// client.login(process.env.api.discord.token)
// client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`))
// process.client = client



//!
//! Express
//!

const express = require('express')
const app = express()

app.listen(process.env.port, () => console.log(`Listening on port ${process.env.port}!`))

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.use(bodyParser.json({ extended: true }))
app.use(cookieParser())

app.set('trust proxy', 'loopback')
app.set('view engine', 'ejs')

app.use(express.static('public'))



//!
//! Passport
//!



//!
//! Middleware
//!



//!
//! Routes
//!

app.get('/', (req, res) => {
    res.render('index')
})