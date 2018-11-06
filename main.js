var pageData = {
    username: null,
    playerOneName: null,
    playerOneScore: 0,
    playerTwoName: null,
    playerTwoScore: 0,
    token: null,
    users: null
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
    signUpListen();
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
                alert("This user already exists");
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
        welcomeUserMessage: `Welcome ${pageData.username} !`,
        buttonMessage: "Score New Game",
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
    showGamePlay();
    document
        .querySelector(".setUpContainer")
        .addEventListener("input", userValidation);
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
        plusButtonText: "+1",
        minusButtonText: "- 1",
        playerTwo: `${pageData.playerTwoName}`,
        playerTwoScore: `${pageData.playerTwoScore}`
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    listenForPlus();
    listenForGameOver();
}

function showGamePlay() {
    var newGameButton = document.getElementById("startGameButton");
    newGameButton.addEventListener("click", function() {
        setPlayerNames();
        showScoreGame();
    });
}

function listenForPlus() {
    var buttonOne = document.querySelector("#playerOnePlus");
    var buttonTwo = document.querySelector("#playerTwoPlus");
    buttonOne.addEventListener("click", function() {
        pageData.playerOneScore = pageData.playerOneScore + 1;
        showScoreGame();
    });
    buttonTwo.addEventListener("click", function() {
        pageData.playerTwoScore = pageData.playerTwoScore + 1;
        showScoreGame();
    });
}

function signUpListen() {
    document
        .querySelector(".signupContainer")
        .addEventListener("input", signUpCheck);
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
        .addEventListener("input", loginCheck);
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
    getUsers().then(function() {
        usernameList = [];
        for (var user of pageData.users) {
            usernameList.push(user.username);
        }
        verifyUsers(usernameList);
    });
}

function verifyUsers(usernameList) {
    var startButton = document.querySelector("#startGameButton");
    var inputOne = document.querySelector("#playerOneSelect").value;
    var inputTwo = document.querySelector("#playerTwoSelect").value;
    if (usernameList.includes(inputOne) && usernameList.includes(inputTwo)) {
        if (inputOne != inputTwo) {
            if (
                inputOne != pageData.username &&
                inputTwo != pageData.username
            ) {
                startButton.removeAttribute("disabled");
            }
        }
    } else {
        startButton.setAttribute("disabled", "disabled");
    }
}

function listenForGameOver() {
    if (pageData.playerOneScore >= 10 || pageData.playerTwoScore >= 10) {
        showFinishedModal();
        listenForGameChoice();
    }
}

function showFinishedModal() {
    var finishedModal = document.querySelector("#gameFinishedModal");
    var NameOneContainer = finishedModal.querySelector("#playerOneName");
    var NameTwoContainer = finishedModal.querySelector("#playerTwoName");
    var ScoreOneContainer = finishedModal.querySelector("#playerOneScore");
    var ScoreTwoContainer = finishedModal.querySelector("#playerTwoScore");
    finishedModal.style.display = "block";
    NameOneContainer.innerText = pageData.playerOneName;
    NameTwoContainer.innerText = pageData.playerTwoName;
    ScoreOneContainer.innerText = pageData.playerOneScore;
    ScoreTwoContainer.innerText = pageData.playerTwoScore;
}

function hideModal() {
    var finishedModal = document.querySelector("#gameFinishedModal");
    finishedModal.style.display = "none";
}

function listenForGameChoice() {
    var submitButton = document.querySelector("#submitScore");
    var cancelButton = document.querySelector("#cancelScore");
    submitButton.addEventListener("click", function() {
        hideModal();
        showHome();
    });
    cancelButton.addEventListener("click", function() {
        hideModal();
        showHome();
    });
}

showScoreGame();
