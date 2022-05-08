const Passport = require('passport')
const User = require('./user')

const Steam = require('passport-steam')
const Discord = require('passport-discord')


//? Steam Auth
Passport.use(new Steam(
    {
        apiKey: process.env.api.steam.key,
        realm: process.env.api.steam.realm,
        returnURL: process.env.api.steam.callback_uri
    }, async (identifier, profile, done) => {
        const Token = await User.Login(profile.id, profile)
        return done(null, Token)
    }
))


//? Discord Auth
Passport.use(new Discord(
    {
        clientID: process.env.api.discord.id,
        clientSecret: process.env.api.discord.secret,
        callbackURL: process.env.api.discord.callback_uri,
        scope: ['identify']
    }, async (accessToken, refreshToken, profile, done) => {
        return done(null, profile)
    }
))