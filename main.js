var pageData = {
    username: null,
    playerOneName: null,
    playerOneScore: 0,
    playerTwoName: null,
    playerTwoScore: 0,
    token: null,
    users: null,
    usernames: null
};

function listenForSignUp() {
    var signUpLink = document.querySelector("#SignUpLink");
    signUpLink.addEventListener("click", function() {
        showSignUpPage(pageData);
    });
}
listenForSignUp();

function showSignUpPage() {
    var source = document.getElementById("showSignUp").innerHTML;
    var template = Handlebars.compile(source);
    var content = template({
        username: "Username:",
        password: "Password:",
        passwordConfirm: "Password Confirmation:",
        buttonMessage: "Sign Up"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    var button = document.querySelector("#signupButton");
    singUpListen();
    button.addEventListener("click", function(event) {
        event.preventDefault();
        onSignIn();
    });
}

function listenForLogin() {
    var loginLink = document.querySelector("#LoginLink");
    loginLink.addEventListener("click", function() {
        showLoginPage();
    });
}
listenForLogin();

function showLoginPage() {
    var source = document.getElementById("showLogin").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        username: "Username:",
        password: "Password",
        buttonMessage: "Login"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    button = document.querySelector("#loginButton");
    loginListen();
    button.addEventListener("click", function(event) {
        event.preventDefault();
        onLogin();
    });
}

function onSignIn() {
    username = document.querySelector("#inputUsername").value;
    password = document.querySelector("#inputPassword").value;
    passwordRepeat = document.querySelector("#inputPasswordRepeat").value;
    fetch(`http://bcca-pingpong.herokuapp.com/api/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf8"
        },
        body: JSON.stringify({
            username: username,
            password: password,
            password_repeat: passwordRepeat
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(newJson) {
            if (newJson.token) {
                pageData.username = username;
                pageData.token = newJson.token;
                showHome();
            } else {
                alert("Please check your inputs");
            }
        });
}

function onLogin() {
    username = document.querySelector("#existingUsername").value;
    password = document.querySelector("#existingPassword").value;
    fetch(`http://bcca-pingpong.herokuapp.com/api/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf8"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(newJson) {
            if (newJson.token) {
                pageData.username = username;
                pageData.token = newJson.token;
                showHome();
            } else {
                alert("Please check your inputs");
            }
        });
}

function showHome() {
    var source = document.getElementById("showHome").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        welcomeUserMessage: `Welcome ${pageData.username}!`,
        buttonMessage: "Start A New Game",
        leaderBoardPlacement: "This is where the leaderboard goes!"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    showGameStart();
}

function showSetGame() {
    var source = document.getElementById("showGameSet").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        setGameMessage: "Set up New Game",
        ref: `${pageData.username}`,
        playerOne: "Player 1:",
        playerTwo: "Player 2:",
        buttonMessage: "Start Game"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    // playerInputListen();
    showGamePlay();
    document
        .querySelector(".setUpContainer")
        .addEventListener("mouseover", userValidation);
}

function showGameStart() {
    var newGameButton = document.getElementById("startNewGame");
    newGameButton.addEventListener("click", showSetGame);
}

function showScoreGame() {
    var source = document.getElementById("showScoreGame").innerHTML;
    var template = Handlebars.compile(source);
    var content = template({
        setScoreGame: "Score Game",
        ref: `${pageData.username}`,
        scoreMessage: "Score:",
        playerOne: `${pageData.playerOneName}`,
        playerOneScore: `${pageData.playerOneScore}`,
        scoreButtonText: "+1",
        playerTwo: `${pageData.playerTwoName}`,
        playerTwoScore: `${pageData.playerTwoScore}`,
        scoreButtonText2: "+1"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    listenForPoint();
}

function showGamePlay() {
    var newGameButton = document.getElementById("startGameButton");
    newGameButton.addEventListener("click", function() {
        setPlayerNames();
        showScoreGame();
    });
}

function listenForPoint() {
    var buttonOne = document.querySelector("#playerOneButton");
    var buttonTwo = document.querySelector("#playerTwoButton");
    buttonOne.addEventListener("click", function() {
        pageData.playerOneScore = pageData.playerOneScore + 1;
        showScoreGame();
    });
    buttonTwo.addEventListener("click", function() {
        pageData.playerTwoScore = pageData.playerTwoScore + 1;
        showScoreGame();
    });
}

function playerInputListen() {
    document.addEventListener("mouseover", playerInputCheck);
}

function playerInputCheck() {
    var playerOneInput = document.querySelector("#playerOneSelect").value;
    var playerTwoInput = document.querySelector("#playerTwoSelect").value;
    if (playerOneInput !== "" && playerTwoInput !== "") {
        document.querySelector("#startGameButton").removeAttribute("disabled");
    } else {
        document
            .querySelector("#startGameButton")
            .setAttribute("disabled", "disabled");
    }
}

function singUpListen() {
    document
        .querySelector(".signupContainer")
        .addEventListener("mouseover", signUpCheck);
}

function signUpCheck() {
    var username = document.querySelector("#inputUsername");
    var password = document.querySelector("#inputPassword");
    var passwordRepeat = document.querySelector("#inputPasswordRepeat");
    var submitButton = document.querySelector("#signupButton");
    if (
        username.value != "" &&
        password.value != "" &&
        passwordRepeat.value != ""
    ) {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled", "disabled");
    }
}

function loginListen() {
    document
        .querySelector(".loginContainer")
        .addEventListener("mouseover", loginCheck);
}

function loginCheck() {
    var username = document.querySelector("#existingUsername");
    var password = document.querySelector("#existingPassword");
    var submitButton = document.querySelector("#loginButton");
    if (username.value != "" && password.value != "") {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled", "disabled");
    }
}

function setPlayerNames() {
    pageData.playerOneName = document.querySelector("#playerOneSelect").value;
    pageData.playerTwoName = document.querySelector("#playerTwoSelect").value;
}

function getUsers() {
    return fetch("https://bcca-pingpong.herokuapp.com/api/users/", {
        method: "GET",
        headers: {
            Authorization: `Token ${pageData.token}`
        }
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(obj) {
            return (pageData.users = obj);
        });
}

function userValidation() {
    var startButton = document.querySelector("#startGameButton");
    var inputOne = document.querySelector("#playerOneSelect").value;
    var inputTwo = document.querySelector("#playerTwoSelect").value;
    getUsers().then(function() {
        usernameList = [];
        for (var user of pageData.users) {
            usernameList.push(user.username);
        }
        if (inputOne in usernameList && inputTwo in usernameList) {
            startButton.removeAttribute("disabled");
        } else {
            startButton.setAttribute("disabled", "disabled");
        }
    });
}
