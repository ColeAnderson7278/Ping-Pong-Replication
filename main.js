var pageData = {
    username: null,
    playerOneName: null,
    playerOneScore: 0,
    playerOneId: null,
    playerTwoName: null,
    playerTwoScore: 0,
    playerTwoId: null,
    maxScore: null,
    points: []
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

function showHome() {
    var source = document.getElementById("showHome").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        welcomeUserMessage: `Welcome ${pageData.username} !`,
        scoreButtonMessage: "Score New Game",
        logOutMessage: "Log Out"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    listenForLogOut();
    showGameStart();
}

function showGameStart() {
    var newGameButton = document.getElementById("startNewGame");
    newGameButton.addEventListener("click", showSetGame);
}

function listenForLogOut() {
    var logOutButton = document.querySelector("#logOutButton");
    logOutButton.addEventListener("click", showLogOutMessage);
}

function showLogOutMessage() {
    var choice = confirm("Are you sure you want to log out?");
    if (choice) {
        document.location.reload();
    }
}

function showSetGame() {
    var source = document.getElementById("showGameSet").innerHTML;
    var template = Handlebars.compile(source);
    var content = template({
        setGameMessage: "Set up New Game",
        ref: `${pageData.username}`,
        playerOne: "Player 1:",
        playerTwo: "Player 2:",
        buttonMessage: "Start Game"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    document
        .querySelector(".setUpContainer")
        .addEventListener("input", userValidation);
    showGamePlay();
}

function showGamePlay() {
    var newGameButton = document.getElementById("startGameButton");
    newGameButton.addEventListener("click", function() {
        setMaxScore();
        setPlayerNames();
        showScoreGame();
    });
}

function setMaxScore() {
    var score = document.querySelector("#maxScoreInput").value;
    pageData.maxScore = Number(score);
}

function showScoreGame() {
    var source = document.getElementById("showScoreGame").innerHTML;
    var template = Handlebars.compile(source);
    var content = template({
        playerOne: `${pageData.playerOneName}`,
        playerOneScore: `${pageData.playerOneScore}`,
        plusButtonText: "+1",
        playerTwo: `${pageData.playerTwoName}`,
        playerTwoScore: `${pageData.playerTwoScore}`
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    showScoreBoard();
    getPlayerId(pageData.playerOneName, pageData.playerTwoName);
}

function listenForPlus(idOne, idTwo, gameId) {
    var buttonOne = document.querySelector("#playerOnePlus");
    var buttonTwo = document.querySelector("#playerTwoPlus");
    buttonOne.addEventListener("click", function() {
        listenForGameOver(gameId);
        pageData.playerOneScore = pageData.playerOneScore + 1;
        addToPoints(idOne);
        showScoreBoard();
    });
    buttonTwo.addEventListener("click", function() {
        listenForGameOver(gameId);
        pageData.playerTwoScore = pageData.playerTwoScore + 1;
        addToPoints(idTwo);
        showScoreBoard();
    });
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

function getPlayerId(nameOne, nameTwo) {
    getUsers().then(function() {
        for (var user of pageData.users) {
            if (nameOne == user.username) {
                pageData.playerOneId = user.id;
            } else if (nameTwo == user.username) {
                pageData.playerTwoId = user.id;
            }
        }
        getNewGame(pageData.playerOneId, pageData.playerTwoId);
    });
}

function getNewGame(IdOne, IdTwo) {
    fetch(`http://bcca-pingpong.herokuapp.com/api/new-game/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${pageData.token}`,
            "Content-Type": "application/json; charset=utf8"
        },
        body: JSON.stringify({
            player_1: IdOne,
            player_2: IdTwo
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(obj) {
            listenForPlus(IdOne, IdTwo, obj.id);
        });
}

function finalizeGame(gameId) {
    fetch(`http://bcca-pingpong.herokuapp.com/api/score-game/${gameId}/`, {
        method: "PUT",
        headers: {
            Authorization: `Token ${pageData.token}`,
            "Content-Type": "application/json; charset=utf8"
        },
        body: JSON.stringify({
            points: pageData.points
        })
    }).then(function(response) {
        return response.json();
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
            {
                startButton.removeAttribute("disabled");
            }
        }
    } else {
        startButton.setAttribute("disabled", "disabled");
    }
}

function listenForGameOver(gameId) {
    if (
        pageData.playerOneScore === pageData.maxScore ||
        pageData.playerTwoScore === pageData.maxScore
    ) {
        showFinishedModal();
        listenForGameChoice(gameId);
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

function listenForGameChoice(gameId) {
    var submitButton = document.querySelector("#submitScore");
    var cancelButton = document.querySelector("#cancelScore");
    submitButton.addEventListener("click", function() {
        finalizeGame(gameId);
        hideModal();
        refreshInfo();
        showHome();
    });
    cancelButton.addEventListener("click", function() {
        hideModal();
        refreshInfo();
        showHome();
    });
}

function addToPoints(user) {
    pageData.points.push(user);
}

function refreshInfo() {
    document.querySelector("#score-script").innerHTML = "";
    pageData.playerOneName = null;
    pageData.playerOneScore = 0;
    pageData.playerTwoName = null;
    pageData.playerTwoScore = 0;
    (pageData.maxScore = null), (pageData.points = []);
}

function showScoreBoard() {
    var source = document.getElementById("showScoreBoard").innerHTML;
    var template = Handlebars.compile(source);
    var content = template({
        scoreMessage: "Score Board",
        playerOneName: pageData.playerOneName,
        playerTwoName: pageData.playerTwoName,
        playerOneScore: pageData.playerOneScore,
        playerTwoScore: pageData.playerTwoScore
    });
    var place = document.querySelector("#score-script");
    place.innerHTML = content;
}
