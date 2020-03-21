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

        const username = document.querySelector("#sign-up-page #username").value
        const email = document.querySelector("#sign-up-page #email").value
        const password = document.querySelector("#sign-up-page #password1").value
        const passwordRepeated = document.querySelector("#sign-up-page #password2").value

        const account = { username, email, password, passwordRepeated }

        fetch(
            urlApi + "accounts/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(account)
        }).then((response) => {
            if (!response.ok) {
                response.json().then(function (body) {
                    hideLoader()
                    throw new Error(body)
                })
            } else {
                hideLoader()
                goToPage("/api/accounts/sign-in")
                return response.blob()
            }

        }).then((account) => {
            hideLoader()
            console.log('Success:', account)
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
                "Authorization": "Bearer " + localStorage.accessToken
            },
            body: JSON.stringify(question)

        }).then((response) => {

            //console.log("body_here:", body)
            return response.json(400)


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
        }).then((body) => {
            console.log('Success1:', body)
            return
        }).then((question) => {
            console.log('Success:', question)
            return

        }).catch((error) => {
            //console.log(JSON.stringify(error))
            // TODO: Update the view and display error.
            console.log("Error_here:", error)
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
    } else if (url == "/api/questions/new-post") {
        document.getElementById("new-question-page").classList.add("current-page")
    } else if (url == "/api/accounts/sign-out") {
        //document.getElementById("sign-out-page").classList.add("current-page")
        logout()
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
        }*/
/*console.log("all users shown_getAllAccounts_end")
}).catch(function (error) {
console.log("error here iam: ", error)
return error
})

} */

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

/*function viewQuestionsForUser(questionId) {
    console.log("viewQuestionsForUser_start")

    const noQuestions = document.getElementById("noQuestionsForUser")

    fetch(
        route + '/questions/by-id/' + questionId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.access_token
        },
    }
    ).then(function (response) {
        console.log(response)

        noQuestions.style.display = "none"

        if (!response.ok) {
            response.json().then(function (body) {
                console.log("body_viewQuestionsById: ", body)

                if (response.status == 401) {
                    localStorage.clear()
                    goToPage("/")
                    return
                }

                console.log("error_body:", body.message)
            })
        } else {
            response.json().then(function (body) {
                console.log("body_else: ", body)

                document.getElementById("question-user-page").classList.add("current-page")

                const questions = body.questions

                const questionsDiv = document.getElementById("questionsUser")
                questionsDiv.innerHTML = ""

                if (!questions || questions.length == 0) {
                    noQuestions.style.display = "block"
                } else {
                    for (var question of questions) {
                        const questionDiv = document.createElement('div')
                        questionDiv.classList.add("box")

                        questionDiv.innerHTML = `

                        <article>
                            <div>
                                <div class="content">
                                    <p>
                                        <strong>${question.title}</strong>

                                        ${question.description}
                                        <br>${question.author}
                                    </p>
                                </div>
                                <div>
                                    <a href="/questions/by-id/${question.id}">More</a>
                                </div>
                            </div>

                        </article>

                    `
                        questionsDiv.appendChild(questionDiv)
                    }
                }
            })
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error))

        //hideSpinner()
        console.log("Error connecting")
    })

}*/

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