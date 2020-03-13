// TODO: Don't write all JS code in the same file.
document.addEventListener("DOMContentLoaded", function () {
    console.log("addEventListener")
    changeToPage(location.pathname)

    if (localStorage.accessToken) {
        console.log("localStorage.accessToken", localStorage.accessToken)
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
        console.log("navigation-handler_sign_up")

        //const name = document.querySelector("#sign-up-page .username").value
        //name = reqest.body.username

        const { username, email, password, passwordRepeated } = request.body
        const account = { username, email, password, passwordRepeated }

        // TODO: Build an SDK (e.g. a separate JS file)
        // handling the communication with the backend.
        fetch(
            "http://localhost:8080/api/accounts/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.accessToken
                //"Authorization": "Bearer " + localStorage.accessToken
            },
            body: JSON.stringify(account)
        }
        ).then(function (response) {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            // TODO: Update the view somehow.
            console.log("respons.body: ", response.body)
            console.log("response_signUp_header: ", response.headers)
            console.log("response_signUp_localStorage.accessToken: ", localStorage.accessToken)
        }).catch(function (error) {
            // TODO: Update the view and display error.
            console.log("error_signUp:", error)
        })

    })

    document.querySelector("#sign-in-page form").addEventListener("submit", function (event) {
        event.preventDefault()
        console.log("navigation-handler_sign_in")

        const email = document.querySelector("#sign-in-page .email").value
        const password = document.querySelector("#sign-in-page .password").value

        console.log("email and password:", email, password)

        fetch(
            "http://localhost:8080/api/accounts/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.accessToken
            }, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
            body: "grant_type=password&email=" + email + "&password=" + password
        }).then(function (response) {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            console.log("localStorage_fetch: ", localStorage)
            console.log("localStorage.accessToken_fetch: ", localStorage.accessToken)
            return response.json(400)
        }).then(function (body) {
            // TODO: Read out information about the user account from the id_token.
            console.log("signIn_fetch_body.accessToken:", body)
            console.log("signIn_fetch_body.accessToken:", body.access_token)
            login(body.access_token)
            console.log("signIn_fetch_accessToken:", body.access_token)
            return
        }).catch(function (error) {
            console.log("signIn_fetch_error", error)
            return

        })

    })

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
    } else if (url == "/api/accounts/sign-in") {
        document.getElementById("sign-in-page").classList.add("current-page")
    } else if (new RegExp("^/api/accounts/[0-9]+$").test(url)) {
        document.getElementById("sign-in-page").classList.add("current-page")
        const id = url.split("/")[2]
        fetchUser(id)
    } else if (url == "/api/accounts/sign-up") {
        document.getElementById("sign-up-page").classList.add("current-page")
    } else {
        document.getElementById("error-page").classList.add("current-page")
        console.log("error-page is shown")
    }

}

function fetchAllAccounts() {

    fetch(
        "http://localhost:8080/api/accounts"
    ).then(function (response) {
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        return response.json()
    }).then(function (accounts) {
        console.log("accounts_fetchAllAcc: ", accounts)
        const ul = document.querySelector("#accounts-page ul")
        ul.innerText = ""
        for (const account of accounts) {
            const li = document.createElement("li")
            const anchor = document.createElement("a")
            anchor.innerText = account.name
            console.log(account.id)
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
        console.log("fetchUser_id:", id)
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        return response.json()
    }).then(function (account) {
        console.log("account_fetchAccById: ", account)
        const nameSpan = document.querySelector("#user-page .name")
        const idSpan = document.querySelector("#user-page .id")
        nameSpan.innerText = account.username
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