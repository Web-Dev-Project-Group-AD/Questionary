// TODO: Don't write all JS code in the same file.

// Docker Machine IP address, must be changed to own IP
const urlApi = "http://localhost:8080/api/"

document.addEventListener("DOMContentLoaded", function () {
    console.log("nginx_spa_here we are")

    changeToPage(location.pathname)

    if (localStorage.accessToken) {
        console.log("localStorage.accessToken", localStorage.accessToken)
        login(localStorage.accessToken)
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

    document.querySelector("#sign-up-page form").addEventListener("submit", function (event) {
        event.preventDefault()

        showLoader()

        //const username = document.getElementById('username').value
        console.log("username1")
        const username = document.querySelector("#sign-up-page #username").value
        console.log("username2:", username)
        const email = document.querySelector("#sign-up-page #email").value
        console.log("email:", email)
        const password = document.querySelector("#sign-up-page #password1").value
        console.log("password:", password)
        const passwordRepeated = document.querySelector("#sign-up-page #password2").value
        console.log("passwordRepeated:", passwordRepeated)

        const account = JSON.stringify({
            "username": username,
            "email": email,
            "password": password,
            "passwordRepeated": passwordRepeated
        })

        function validatingJSON(json) {

            var checkedjson

            try {
                console.log("json", json)
                checkedjson = JSON.parse(json)
                console.log("checked json", checkedjson)

            } catch (e) {
                console.log("e", e)
            }

            return checkedjson
        }

        fetch(
            urlApi + "accounts/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: account
        }).then((response) => {
            console.log("response_before_if:", response)
            if (!response.ok) {
                console.log("if_response")
                //validatingJSON(account)
                //console.log("account:", account)
                //validatingJSON(response)
                //console.log("response2:", response)
                response.json()
                    .then((body) => {
                        console.log("working_body:", body)
                        hideLoader()
                        console.log("Error_if: ", error)
                        //throw new Error(account)
                    })
            } else {
                console.log("else_response")
                //console.log("account2:", body)
                response.json().then((body) => {
                    //validatingJSON(body)
                    console.log("else_working:", body)
                    //validatingJSON(response)
                    //console.log("response3:", response)
                    hideLoader()
                    document.getElementById("signUpForm").reset()
                    goToPage("/api/accounts/sign-in")
                    //return response.blob()
                })

            }

        }).catch((error) => {
            hideLoader()
            console.log("Error:", error)
        })

    })

    document.querySelector("#sign-in-page form").addEventListener("submit", function (event) {
        event.preventDefault()

        showLoader()

        const email = document.querySelector("#sign-in-page .email").value
        const password = document.querySelector("#sign-in-page .password").value

        fetch(
            urlApi + "accounts/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + localStorage.accessToken
            },
            body: "grant_type=password&email=" + email + "&password=" + password
        }).then(function (response) {
            hideLoader()
            return response.json(400)
        }).then(function (body) {
            console.log("body.accessToken:", body.access_token)
            hideLoader()
            login(body.access_token)
            return
        }).catch(function (error) {
            hideLoader()
            console.log("Error: ", error)
            return

        })

    })

    document.querySelector("#new-question-page form").addEventListener("submit", (event) => {
        event.preventDefault()
        console.log("navigation-handler_newQuestion")

        console.log("accessToken: ", localStorage.accessToken)
        const payload = parseJwt(localStorage.accessToken)
        const id = payload.sub
        const author = payload.username
        console.log("id and author: ", id, author)



        const questionTitle = document.querySelector("#new-question-page #questionTitle").value
        const questionDescription = document.querySelector("#new-question-page #questionDescription").value
        const customCategory = document.querySelector("#new-question-page #customCategory").value

        //console.log("body in questions", body)

        const question = {
            author: author,
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
                "Authorization": "Bearer " + localStorage.accessToken
            },
            body: JSON.stringify(question)

        }).then((response) => {
            console.log("response_q:", response)
            if (!response.ok) {
                response.json().then(function (body) {
                    console.log("body_question", body)
                    hideLoader()
                    //throw new Error(body)
                    console.log("Error3: ", error)
                })
            } else {
                response.json().then((body) => {
                    //validatingJSON(body)
                    console.log("else_working:", body)
                    //validatingJSON(response)
                    //console.log("response3:", response)
                    hideLoader()
                    //document.getElementById("signUpForm").reset()
                    goToPage("/api/questions/unanswered/")

                    //return response.blob()
                })
            }


            //console.log("body_here:", body)
            //return response.json(400)


            /* questionTitle.innerText = body.question.title
             customCategory.innerText = body.question.customCategory
             questionDescription.innerText = body.question.description
             author.innerText = body.question.author

 */
            /*
             } else {
                 response.json() {
                     console.log("else_body: ", body)

                     const id = body.question.id
                     goToPage("/questions/by-id/" + id)
                     document.getElementById("createQuestionForm").reset()
                 }
             }*/
            /*}).then((body) => {
                console.log('Success1:', body)
                return*/

        }).catch((error) => {
            //console.log(JSON.stringify(error))
            // TODO: Update the view and display error.
            hideLoader()
            console.log("Error2: ", error)
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
        console.log("response_getAllAccounts_body: ", response.body)
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        return response.json()
    }).then(function (accounts) {
        console.log("accounts_fetchAllAcc: ", accounts)
        const ul = document.querySelector("#accounts-page ul")
        ul.innerText = ""
        const account = ""
        const li = document.createElement("li")
        li.innerText = "hier bin ich hoffentlich bald"
        ul.append(li)

        console.log("ul_accounts: ", ul)
        console.log("accounts123: ", [accounts])
        //console.log("accounts123456: ", [response.body])
        for (account of accounts) {
            console.log("account: ", accounts.id)
            const li = document.createElement("li")
            //const anchor = document.createElement("a")
            li.innerText = account.username
            //anchor.setAttribute("href", '/pets/'+pet.id)
            //li.appendChild(anchor)
            ul.appendChild(li)
            console.log("forschleife_here")
        }
        console.log("hello whatsup")
        /*for (const account of accounts) {
            console.log("account: ", account.id)
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
        console.log("all users shown_getAllAccounts_end")*/
    }).catch(function (error) {
        console.log("error here iam: ", error)
        return error
    })

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
        console.log("new_question_page")
        const id = url.split("/")[2]
        console.log("id", id)
        viewQuestionsForUser(id)
        console.log("question_done")
    } else if (url == "/api/accounts/sign-up") {
        document.getElementById("sign-up-page").classList.add("current-page")
    } else if (url == "/api/questions/new-post") {
        document.getElementById("new-question-page").classList.add("current-page")
    } else if (url == "/api/questions/unanswered/") {
        document.getElementById("answer-page").classList.add("current-page")
        viewUnansweredQuestions()
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

function viewUnansweredQuestions() {
    console.log("viewUnansweredQuestions_start")

    const noQuestions = document.getElementById("noUnansweredQuestions")

    fetch(
        urlApi + '/questions/unanswered/', {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.accessToken
        },
    }
    ).then((response) => {
        console.log("response_viewUnansweredQuestions", response)
        console.log("here")
        noQuestions.style.display = "none"

        if (!response.ok) {

            console.log("if_body: ", body)
            response.json().then((body) => {
                console.log("if_viewunansweredQuestions")
                console.log("if_body_viewunansweredQuestions: ", body)

                hideLoader()

                console.log("Errors4:", error)
            })
        } else {
            // hideLoader()
            // goToPage("/api/accounts/sign-in")
            // return response.blob()
            console.log("body_else: ")

            response.json().then((body) => {
                console.log("else_working:", body)

                hideLoader()
                const answerpage = document.getElementById("answer-page")

                answerpage.classList.add("current-page")
                console.log("answerpage:", answerpage)

                const questions = body.questions
                console.log("questions:", questions)

                const questionsDiv = document.getElementById("question")
                questionsDiv.innerHTML = ""

                if (!questions || questions.length == 0) {
                    console.log("if_questionshow")
                    noQuestions.style.display = "block"
                } else {
                    console.log("else_questionshow")
                    for (var question of questions) {
                        const questionDiv = document.createElement('div')
                        questionDiv.classList.add("box")

                        questionDiv.innerHTML = `

                        <div id="question-page">
                            <div class="content">
                                <h1>Questions1</h1>
                            </div>

                            <div id="questionTitle">${question.title}</div>

                            <div id="questionDescription">${question.description}</div>
                            <div id="questionAuthor">${question.author}</div>

                        </div>
 
                    `
                        questionsDiv.appendChild(questionDiv)
                        answerpage.appendChild(questionDiv)
                        console.log("here we are :)")
                    }
                }
            })
        }
    }).catch((error) => {
        //console.log(JSON.stringify(error))
        hideLoader()
        console.log("Error connecting: ", error)
    })

}

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
        logout()
        return null
    }
}

function login(accessToken) {
    showLoader()
    console.log("accessToken", accessToken)
    localStorage.accessToken = accessToken
    document.body.classList.remove("isLoggedOut")
    document.body.classList.add("isLoggedIn")
    hideLoader()
    goToPage("/")
    console.log("login")
}

function logout() {
    showLoader()
    localStorage.accessToken = ""
    document.body.classList.remove("isLoggedIn")
    document.body.classList.add("isLoggedOut")
    hideLoader()
    goToPage("/")
    console.log("logout")
}

function showLoader() {
    document.getElementById("loader").classList.add('show')
    document.getElementById("loader").classList.remove('hide')
}

function hideLoader() {
    document.getElementById("loader").classList.add('hide')
    document.getElementById("loader").classList.remove('show')
}