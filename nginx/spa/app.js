// TODO: Don't write all JS code in the same file.

const urlApi = "http://localhost:8080/api/"

document.addEventListener("DOMContentLoaded", function () {

    console.log("nginx_spa_here we are")

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

        const username = document.querySelector("#sign-up-page #username").value
        const email = document.querySelector("#sign-up-page #email").value
        const password = document.querySelector("#sign-up-page #password1").value
        const passwordRepeated = document.querySelector("#sign-up-page #password2").value

        const account = { username, email, password, passwordRepeated }
        console.log("signUp_account: ", account)

        // TODO: Build an SDK (e.g. a separate JS file)
        // handling the communication with the backend.
        fetch(
            urlApi + "accounts/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"Authorization": localStorage.accessToken
                //"Authorization": "Bearer " + localStorage.accessToken
            },
            body: JSON.stringify(account)
        }
        ).then(function (response) {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            // TODO: Update the view somehow.
            console.log("respons.body: ", response.body, "was successful")
            console.log("response_signUp_header: ", response.headers)
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
            urlApi + "accounts/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + localStorage.accessToken
                //"Authorization": localStorage.accessToken
            }, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
            body: "grant_type=password&email=" + email + "&password=" + password
        }).then(function (response) {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.

            return response.json(400)
        }).then(function (body) {
            // TODO: Read out information about the user account from the id_token.
            console.log("signIn_fetch_body.accessToken:", body)
            console.log("signIn_fetch_body.accessToken:", body.access_token)
            login(body.access_token)
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
    if (url == "/") {
        document.getElementById("home-page").classList.add("current-page")
    } else if (url == "/api/accounts/all") {
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
    console.log("fetchAllAccounts_start")

    fetch(
        urlApi + "accounts/all", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.accessToken
        },
        //body: JSON.stringify(accounts)
    }
    ).then(function (response) {
        console.log("response_getAllAccounts: ", response)
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        return response.json()
    }).then(function (accounts) {
        console.log("accounts_fetchAllAcc: ", accounts)
        const ul = document.querySelector("#accounts-page ul")
        ul.innerText = ""
        console.log("ul_accounts: ", ul)
        console.log("accounts: ", accounts)
        for (const account of accounts) {
            console.log("account: ", account.id)
            const li = document.createElement("li")
            //const anchor = document.createElement("a")
            li.innerText = account.username
            //anchor.innerText = account.username
            console.log(account.username)
            //anchor.setAttribute("href", '/api/accounts/' + account.id)
            //li.appendChild(anchor)
            ul.append(li)
            console.log("ul_after: ", ul)
            console.log("one users shown_getAllAccounts")
            return
        }
        console.log("all users shown_getAllAccounts_end")
    }).catch(function (error) {
        //console.log(error)
        return error
    })

}

function fetchUser(id) {

    fetch(
        urlApi + "accounts/" + id
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