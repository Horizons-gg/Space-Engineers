//!
//! Modules
//!

process.env = require('./config.json')

const fs = require('fs')

const Patreon = require('./lib/patreon')



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

const Passport = require('passport')
Passport.serializeUser((user, done) => done(null, user))
Passport.deserializeUser((user, done) => done(null, user))

const Passports = require('./lib/passports')



//!
//! Middleware
//!

app.use(async (req, res, next) => {

    if (req.cookies.token) {
        const User = await process.db.collection('users').findOne({ token: req.cookies.token })
        if (User) res.locals.user = User
        else res.cookie('token', null, { maxAge: 0 })
    }

    next()

})



//!
//! Routes
//!

//? Main
app.get('/', (req, res) => {
    res.render('index')
})


//? Authentication
app.get('/auth/steam', Passport.authenticate('steam'))
app.get('/auth/steam/callback', Passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => {
    res.cookie('token', req.user, { httpOnly: true, secure: process.env.secure, maxAge: 1000 * 60 * 60 * 24 * 14 }).redirect('/')
})

app.get('/auth/discord', Passport.authenticate('discord'))
app.get('/auth/discord/callback', Passport.authenticate('discord', { failureRedirect: '/' }), async (req, res) => {
    if (!res.locals.user) return res.redirect('/auth/steam')

    await process.db.collection('users').updateOne({ _id: res.locals.user._id }, { $set: { discord: req.user } })
    res.redirect('/')
})

app.get('/auth/patreon', (req, res) => res.redirect(`https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.api.patreon.client_id}&redirect_uri=${process.env.api.patreon.callback_uri}&scope=users%20pledges-to-me`))
app.get('/auth/patreon/callback', Patreon.Authorize)

app.get('/auth/delete', async (req, res) => {
    if (!res.locals.user) return res.send('You need to be logged in to delete your account!')

    await process.db.collection('users').deleteOne({ _id: res.locals.user._id })
    res.redirect('/')
})