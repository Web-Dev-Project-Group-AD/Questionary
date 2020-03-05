const expressHandlebars = require("express-handlebars")
const path = require("path")


module.exports = ({ }) => {


    const handlebars = expressHandlebars.create({
        extname: "hbs",
        defaultLayout: "main",
        layoutsDir: path.join(__dirname, "layouts"),
        helpers: {
            "ifEquals": (argument1, argument2, options) => {
                return (argument1 == argument2) ? options.fn(this) : options.inverse(this)
            },

            "ifNot": (argument1, argument2, options) => {
                return (argument1 != argument2) ? options.fn(this) : options.inverse(this)
            },

            "ifOr": (argument1, argument2, options) => {
                return (argument1 || argument2) ? options.fn(this) : options.inverse(this)
            },

            "ifAnd": (argument1, argument2, options) => {
                return (argument1 && argument2) ? options.fn(this) : options.inverse(this)
            },

            "json": (context) => {
                return JSON.stringify(context)
            }
        }
    })

    return handlebars
}