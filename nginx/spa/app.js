// TODO: Don't write all JS code in the same file.

// import { REPLServer } from "repl"

//import { jwt } from "../jsonwebtoken"


// const jwt = require("jsonwebtoken")


const urlApi = "http://192.168.99.100:8080/api/"

document.addEventListener("DOMContentLoaded", function () {

    console.log("nginx_spa_here we are")

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
                throw new Error('Api response was not ok')
            }
            return response.json()
        }).then((body) => {
            console.log("Success:", body)
            login(body.access_token)
            return 
        }).catch((error) => {
            // TODO: Update the view and display error.
            console.log("Error:", error)
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
                "Content-Type": "application/x-www-form-urlencoded"
            }, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
            body: "grant_type=password&email=" + email + "&password=" + password
        }).then(function (response) {
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            if (response.ok) {
                return response.json()
            } else {
                changeToPage(response.status.toString)
            }
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

                goToPage("/api" + response.headers.get("Location"))
                return
            } else {

                throw("oops")

            }

            //console.log("body_here:", body)
            

            /* questionTitle.innerText = body.question.title
             customCategory.innerText = body.question.customCategory
             questionDescription.innerText = body.question.description
             author.innerText = body.question.author
 

             } else {
                 response.json() {
                     console.log("else_body: ", body)
     
                     const id = body.question.id
                     goToPage("/questions/by-id/" + id)
                     document.getElementById("createQuestionForm").reset()
                 }
             }*/

        }).catch(error => {
            //console.log(JSON.stringify(error))
            // TODO: Update the view and display error.
            console.log("Error_here:", error)
            return
        })

    })

})

function jwtDecode(t) {
    let token = {};
    token.raw = t;
    token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(t.split('.')[1]));
    return (token)
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
        urlApi + "questions/all"
    ).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            
        }
    }).then(questions => {

       

        const questionsPage = document.querySelector("#questions-page")
        const questionsDiv =  questionsPage.querySelector("#questions")
        var errorDiv =  questionsPage.querySelector("#error")
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
                    const author =  questions[i].author
                    //console.log(title, description, author)
                   
                    //var accessTokenRaw = jwt.decode(localStorage.getItem("accessToken"))
                    var accessTokenRaw = jwtDecode(localStorage.getItem("accessToken"))
                    
                    const username = accessTokenRaw.payload.username
                    console.log("username: ", username)
                   
                    var questionDiv = document.createElement("div")
                    questionDiv.innerHTML = `
                        <div id="questions-page">
                        <div class="content">
                            <h1></h1>
                        </div>
                        <div class="question blog-post">
                            <h3>` + title + `</h3>
                            <p>` + description + `</p>
                            <div>
                                <ul>
                                    <li><a href="/accounts/` + author + `">Asked by: ` + author + `</a></li>
                                </ul>
                            </div>
                        </div>    
                        `
                    if (author == username) {
                        var questionOptions = document.createElement("div") 
                        questionOptions.innerHTML = `
                            <ul>
                                <li><a href="questions/by-id//edit/">Edit</a></li>
                                <li><a href="/delete/">Delete</a></li>
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

function editQuestion(id) {
    fetch(
        urlApi + "questions/" + id
    ).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            changeToPage(response.status.toString)
        }
    }).then(question => {
        
        // Implement edit question

    })
}

function deleteQuestion(id) {
    fetch(
        urlApi + "questions/" + id
    ).then(response => {
        if (response.ok) {
            goToPage("/api" + response.headers.get("Location"))
        } else {
            goToPage(response.status.toString)
        }
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
    } else if (url == "/api/questions/all") {

        document.getElementById("questions-page").classList.add("current-page")
        fetchAllQuestions() 


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
    console.log("accessToken", accessToken)
    localStorage.setItem("accessToken", accessToken)     
    document.body.classList.remove("isLoggedOut")
    document.body.classList.add("isLoggedIn")
    goToPage("/")
    console.log("login function app.js")
}

function logout() {
    console.log("logout")
    localStorage.clear()
    document.body.classList.remove("isLoggedIn")
    document.body.classList.add("isLoggedOut")
    goToPage("/")
    console.log("logout function app.js")
}


/*function viewQuestionsForUser(questionId) {
    console.log("viewQuestionsForUser_start")

    const noQuestions = document.getElementById("noQuestionsForUser")

    fetch(
        route + '/questions/by-id/' + questionId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
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



// function fetchAllAccounts() {
//     console.log("fetchAllAccounts_start")

//     fetch(
//         urlApi + "accounts/all", {
//         method: "GET",
//         headers: {
//             "Authorization": "Bearer " + localStorage.getItem("accessToken")
//         },
//         //body: JSON.stringify(accounts)
//     }
//     ).then(function (response) {
//         console.log("response_getAllAccounts: ", response)
//         console.log("response_getAllAccounts_body: ", response.body)
//         // TODO: Check status code to see if it succeeded. Display errors if it failed.
//         return response.json()
//     }).then(function (accounts) {
//         console.log("accounts_fetchAllAcc: ", accounts)
//         const ul = document.querySelector("#accounts-page ul")
//         ul.innerText = ""
//         const account = ""
//         const li = document.createElement("li")
//         li.innerText = "hier bin ich hoffentlich bald"
//         ul.append(li)

//         console.log("ul_accounts: ", ul)
//         console.log("accounts123: ", [accounts])
//         //console.log("accounts123456: ", [response.body])
//         for (account of accounts) {
//             console.log("account: ", accounts.id)
//             const li = document.createElement("li")
//             //const anchor = document.createElement("a")
//             li.innerText = account.username
//             //anchor.setAttribute("href", '/pets/'+pet.id)
//             //li.appendChild(anchor)
//             ul.appendChild(li)
//             console.log("forschleife_here")
//         }
//         console.log("hello whatsup")
//         for (const account of accounts) {
//             console.log("account: ", account.id)
//             console.log("account: ", account.id)
//             const li = document.createElement("li")
//             //const anchor = document.createElement("a")
//             li.innerText = account.username
//             //anchor.innerText = account.username
//             console.log(account.username)
//             //anchor.setAttribute("href", '/api/accounts/' + account.id)
//             //li.appendChild(anchor)
//             ul.append(li)
//             console.log("ul_after: ", ul)
//             console.log("one users shown_getAllAccounts")
//             return
//         }
//         console.log("all users shown_getAllAccounts_end")
//     }).catch(function (error) {
//         console.log("error here iam: ", error)
//         return error
//     })

// } 
