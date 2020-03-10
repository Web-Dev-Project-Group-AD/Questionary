// TODO: Don't write all JS code in the same file.
document.addEventListener("DOMContentLoaded", function () {
    console.log("addEventListener")
    changeToPage(location.pathname)

    if (localStorage.accessToken) {
        login(localStorage.accessToken)
        console.log("localStorage.accessToken", localStorage.accessToken)
    } else {
        logout()
    }

    document.body.addEventListener("click", function (event) {
        if (event.target.tagName == "A") {
            event.preventDefault()
            const url = event.target.getAttribute("href")
            goToPage(url)
        }
    })

    // TODO: Avoid using this long lines of code.
    document.querySelector("#sign-up-page form").addEventListener("submit", function (event) {
        event.preventDefault()

        const name = document.querySelector("#sign-up-page .name").value

        const { username, email, password, passwordRepeated } = request.body
        const account = { username, email, password, passwordRepeated }

        // TODO: Build an SDK (e.g. a separate JS file)
        // handling the communication with the backend.
        fetch(
            "http://localhost:8080/api/accounts/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": "Bearer " + localStorage.accessToken
            },
            body: JSON.stringify(account)
        }
        ).then(function (response) {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            // TODO: Update the view somehow.
            console.log("response_signUp: ", response)
        }).catch(function (error) {
            // TODO: Update the view and display error.
            console.log("error_signUp:", error)
        })

    })

    /*document.querySelector("#sign-in-page form").addEventListener("submit", function (event) {
        event.preventDefault()

        const username = document.querySelector("#sign-in-page .username").value
        const password = document.querySelector("#sign-in-page .password").value

        fetch(
            "http://localhost:8080/api/accounts/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
            body: "grant_type=password&username=" + username + "&password=" + password
        }
        ).then(function (response) {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            return response.json()
        }).then(function (body) {
            // TODO: Read out information about the user account from the id_token.
            login(body.access_token)
            console.log(accessToken)
        }).catch(function (error) {
            console.log(error)
        })

    })*/

})

window.addEventListener("popstate", function (event) {
    const url = location.pathname
    changeToPage(url)
})

function goToPage(url) {

    changeToPage(url)
    history.pushState({}, "", url)

}

function changeToPage(url) {

    const currentPageDiv = document.getElementsByClassName("current-page")[0]
    if (currentPageDiv) {
        currentPageDiv.classList.remove("current-page")
    }

    // TODO: Optimally this information can be put in an array instead of having a long list of if-else if statements.
    // TODO: Factor out common code in all branches.
    if (url == "/api") {
        document.getElementById("home-page").classList.add("current-page")
    } else if (url == "/api/accounts") {
        document.getElementById("accounts-page").classList.add("current-page")
        fetchAllAccounts()
    } else if (url == "/api/sign-in") {
        document.getElementById("sign-in-page").classList.add("current-page")
    } else if (new RegExp("^/api/accounts/[0-9]+$").test(url)) {
        document.getElementById("user-page").classList.add("current-page")
        const id = url.split("/")[2]
        fetchUser(id)
    } else if (url == "/api/sign-up") {
        document.getElementById("sign-up-page").classList.add("current-page")
    } else {
        document.getElementById("error-page").classList.add("current-page")
    }

}

function fetchAllAccounts() {

    fetch(
        "http://localhost:8080/api/accounts"
    ).then(function (response) {
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        return response.json()
    }).then(function (accounts) {
        const ul = document.querySelector("#accounts-page ul")
        ul.innerText = ""
        for (const account of accounts) {
            const li = document.createElement("li")
            const anchor = document.createElement("a")
            anchor.innerText = account.name
            anchor.setAttribute("href", '/api/accounts/' + account.id)
            li.appendChild(anchor)
            ul.append(li)
        }
    }).catch(function (error) {
        console.log(error)
    })

}

function fetchUser(id) {

    fetch(
        "http://localhost:8080/api/accounts/" + id
    ).then(function (response) {
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        return response.json()
    }).then(function (account) {
        const nameSpan = document.querySelector("#user-page .name")
        const idSpan = document.querySelector("#user-page .id")
        nameSpan.innerText = account.name
        idSpan.innerText = account.id
    }).catch(function (error) {
        console.log(error)
    })

}

function login(accessToken) {
    console.log("accessToken", accessToken)
    localStorage.accessToken = accessToken
    document.body.classList.remove("isLoggedOut")
    document.body.classList.add("isLoggedIn")
    console.log("login function navigation-handler.js")
}

function logout() {
    console.log("logout")
    localStorage.accessToken = ""
    document.body.classList.remove("isLoggedIn")
    document.body.classList.add("isLoggedOut")
    console.log("logout function navigation-handler.js")
}