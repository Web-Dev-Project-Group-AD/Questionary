// TODO: Don't write all JS code in the same file.

// import { REPLServer } from "repl"

//import { jwt } from "../jsonwebtoken"


// const jwt = require("jsonwebtoken")

// change to own IP Adress or localhost
const urlApi = "http://192.168.99.100:8080/api/"

document.addEventListener("DOMContentLoaded", function () {

    changeToPage(location.pathname)

    if (localStorage.getItem("accessToken")) {
        login(localStorage.getItem("accessToken"))
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

        showLoader()

        const username = document.querySelector("#sign-up-page #username").value
        const email = document.querySelector("#sign-up-page #email").value
        const password = document.querySelector("#sign-up-page #password1").value
        const passwordRepeated = document.querySelector("#sign-up-page #password2").value

        const account = { username, email, password, passwordRepeated }
        console.log("signUp_account: ", account)

        fetch(
            urlApi + "accounts/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(account)
        }).then((response) => {
            if (!response.ok) {
                hideLoader()
                throw new Error('Api response was not ok')
            }
            return response.json()
        }).then((body) => {
            console.log("Success:", body)
            hideLoader()
            login(body.access_token)
            return
        }).catch((error) => {
            // TODO: Update the view and display error.
            hideLoader()
            console.log("Error:", error)
        })

    })

    document.querySelector("#sign-in-page form").addEventListener("submit", function (event) {
        event.preventDefault()
        console.log("navigation-handler_sign_in")
        showLoader()
        const email = document.querySelector("#sign-in-page .email").value
        const password = document.querySelector("#sign-in-page .password").value

        console.log("email and password:", email, password)

        fetch(
            urlApi + "accounts/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
            body: "grant_type=password&email=" + email + "&password=" + password
        }).then((response) => {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            if (response.ok) {
                hideLoader()
                return response.json()
            } else {
                hideLoader()
                changeToPage(response.status.toString)
            }
        }).then(function (body) {
            hideLoader()
            // TODO: Read out information about the user account from the id_token.
            console.log("signIn_fetch_body.accessToken:", body)
            console.log("signIn_fetch_body.accessToken:", body.access_token)
            login(body.access_token)
            return
        }).catch(function (error) {
            hideLoader()
            console.log("signIn_fetch_error", error)
            //return

        })

    })


    document.querySelector("#new-question-page form").addEventListener("submit", (event) => {
        event.preventDefault()
        console.log("navigation-handler_newQuestion")

        const questionTitle = document.querySelector("#new-question-page #questionTitle").value
        const questionDescription = document.querySelector("#new-question-page #questionDescription").value
        const customCategory = document.querySelector("#new-question-page #customCategory").value

        //console.log("body in questions", body)

        const question = {
            author: username.value,
            category: customCategory,
            title: questionTitle,
            description: questionDescription
        }


        console.log("newQuestion_question: ", question)

        // TODO: Build an SDK (e.g. a separate JS file)
        // handling the communication with the backend.
        fetch(
            urlApi + "questions/new-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: JSON.stringify(question)

        }).then(response => {
            if (response.ok) {
                console.log(response)
                //console.log("url: ", response.headers.get("Location"))
                //goToPage("/api/" + response.headers.get("Location"))
                goToPage("/api/questions/all")
                //return
            } else {
                throw ("oops")
            }

        }).catch(error => {
            console.log("Error_here:", error)
            return
        })

    })


    document.querySelector("#edit-question-page form").addEventListener("submit", (event) => {
        event.preventDefault()
        showLoader()

        const editQuestionPage = document.querySelector("#edit-question-page")

        const id = editQuestionPage.querySelector("#questionId").value
        const title = editQuestionPage.querySelector("#questionTitle").value
        const description = editQuestionPage.querySelector("#questionDescription").value

        const question = { id, title, description }

        console.log("questionUpdate")

        fetch(
            urlApi + "questions/by-id/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            },
            body: JSON.stringify(question)
        }
        ).then(response => {
            if (response.ok) {
                hideLoader()
                return response.json()
            } else {
                hideLoader()
                changeToPage(response.status.toString)
            }
        }).catch(error => {
            hideLoader()
            console.log("Error_here:", error)
            return
        })
    })
})

function jwtDecode(encodedToken) {
    let token = {};
    token.raw = encodedToken;
    token.header = JSON.parse(window.atob(encodedToken.split('.')[0]));
    token.payload = JSON.parse(window.atob(encodedToken.split('.')[1]));
    return (token)
}

function getLocalUsername() {
    var accessTokenRaw = jwtDecode(localStorage.getItem("accessToken"))
    return accessTokenRaw.payload.username
}

window.addEventListener("popstate", function (event) {
    const url = location.pathname
    changeToPage(url)
})

function goToPage(url) {

    changeToPage(url)
    history.pushState({}, "", url)

}


function fetchUser(id) {
    //TODO look if it works

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


function fetchAllQuestions() {
    fetch(
        urlApi + "questions/all", {
        method: "GET"
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {

        }
    }).then(questions => {


        const questionsPage = document.querySelector("#questions-page")
        const questionsDiv = questionsPage.querySelector("#questions")
        var errorDiv = questionsPage.querySelector("#error")
        console.log("questionsDiv: ", questionsDiv)
        console.log("questionsPage before: ", questionsPage)
        if (questionsDiv) {
            for (var i = 0; i < questionsDiv.childElementCount; i++) {
                var questionDiv = questionsDiv.firstChild
                questionDiv.remove()
            }
        }
        if (errorDiv) {
            errorDiv.remove()
        }

        console.log("questionsPage after: ", questionsPage)

        if (questions.length > 0) {
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].title) {

                    const title = questions[i].title
                    const description = questions[i].description
                    const author = questions[i].author
                    const id = questions[i].id
                    //console.log(title, description, author)

                    //var accessTokenRaw = jwt.decode(localStorage.getItem("accessToken"))
                    var accessTokenRaw = jwtDecode(localStorage.getItem("accessToken"))



                    const username = accessTokenRaw.payload.username

                    var questionDiv = document.createElement("div")
                    questionDiv.innerHTML = `
                    <div class="medium-8 column question content">
                        <div class="question blog-post">
                            <h3 class="textPost">` + title + `</h3>
                            <p class="textPost">` + description + `</p>
                            <div class="callout">
                                <ul class="menu simple">
                                    <li><a href="/accounts/` + author + `">Asked by: ` + author + `</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>           
                        `

                    if (author == username) {
                        var questionOptions = document.createElement("div")
                        questionOptions.innerHTML = `
                            <ul>
                                <li><a href="edit/` + id + `">Edit</a></li>
                                <li><a href="delete/` + id + `">Delete</a></li>
                            </ul>
                            `
                        questionDiv.appendChild(questionOptions)

                    }
                    questionsDiv.appendChild(questionDiv)
                }
            }
        } else {
            errorDiv = document.createElement("div")
            errorDiv.innerText = "No content."
            errorDiv.id = "error"
            questionsPage.appendChild(errorDiv)
        }


    }).catch(function (error) {
        console.log(error)
    })
}

function loadEditQuestionForm(questionId) {
    console.log("loadEditQuestionForm: ", questionId)

    fetch(
        urlApi + "questions/by-id/" + questionId, {
        method: "GET"
    }
    ).then(response => {
        console.log("loadEditForm: ", response)
        if (response.ok) {
            return response.json()
        } else {
            // handle exception            
        }
    }).then(question => {

        console.log("question in loadForm:", question)

        const editQuestionPage = document.querySelector("#edit-question-page")

        var id = editQuestionPage.querySelector("#questionId")
        var title = editQuestionPage.querySelector("#questionTitle")
        var description = editQuestionPage.querySelector("#questionDescription")

        id.value = question[0].id
        title.value = question[0].title
        description.value = question[0].description

        editQuestionPage.classList.add("current-page")

    }).catch(error => {
        // handle error
    })
}

function deleteQuestion(questionId) {
    fetch(
        urlApi + "questions/by-id/" + questionId, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
    }
    ).then(response => {
        if (response.ok) {
            goToPage("/api" + response.headers.get("Location"))
        } else {
            goToPage(response.status.toString)
        }
    }).catch(error => {
        // TODO: handle error
    })
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
    } else if (new RegExp("^/api/questions/by-id/[0-9]+$").test(url)) {
        document.getElementById("new-question-page").classList.add("current-page")
        const id = url.split("/")[2]
        viewQuestionsForUser(id)
    } else if (url.includes("edit")) {
        const id = url.split("/")[1]
        console.log("iD in route:", id)
        loadEditQuestionForm(id)
    } else if (url.includes("delete")) {
        const id = url.split("/")[1]
        deleteQuestion(id)
    } else if (url == "/api/accounts/sign-up") {
        document.getElementById("sign-up-page").classList.add("current-page")
    } else if (url == "/api/questions/new-post") {
        document.getElementById("new-question-page").classList.add("current-page")
    } else if (url == "/api/questions/all") {
        document.getElementById("questions-page").classList.add("current-page")
    } else if (url == "/api/questions/by-user/[0-9]+$") {
        document.getElementById("question-user-page").classList.add("current-page")
    } else if (url == "/api/accounts/sign-out") {
        //document.getElementById("sign-out-page").classList.add("current-page")
        logout()
    } else {
        document.getElementById("error-page").classList.add("current-page")
        console.log("error-page is shown")
    }
}

function login(accessToken) {
    showLoader()
    console.log("accessToken", accessToken)
    localStorage.setItem("accessToken", accessToken)
    document.body.classList.remove("isLoggedOut")
    document.body.classList.add("isLoggedIn")
    hideLoader()
    goToPage("/")
    console.log("login function app.js")
}

function logout() {
    showLoader()
    console.log("logout")
    localStorage.clear()
    document.body.classList.remove("isLoggedIn")
    document.body.classList.add("isLoggedOut")
    hideLoader()
    goToPage("/")
    console.log("logout function app.js")
}

function showLoader() {
    document.getElementById("loader").classList.add('show')
    document.getElementById("loader").classList.remove('hide')
}

function hideLoader() {
    document.getElementById("loader").classList.add('hide')
    document.getElementById("loader").classList.remove('show')
}
