const expressSession = require("express-session")
const RedisStore = require("connect-redis")(expressSession)
const redis = require("redis")
const redisClient = redis.createClient({ host: "redis" })

module.exports = ({ }) => {

    const session = expressSession({
        name: "signIn",
        saveUninitialized: false,
        resave: false,
        secret: "9hTYuxloxt",
        store: new RedisStore({ client: redisClient }),
        cookie: {
            maxAge: 2 * 60 * 60 * 1000, // Set maxAge of sessions to 2 hours.
            sameSite: false,
            secure: false
        }
    })

    return session

}