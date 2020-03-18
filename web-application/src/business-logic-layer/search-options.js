
const searchOptions = {
    shouldSort: true,
    threshold: 0.5,
    location: 0,
    distande: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "title",
        "dateCreated",
        "category",
        "author"
    ]
}

module.exports = searchOptions
