var pageData = { playerOneScore: 0, playerTwoScore: 0 };

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
    content = template({
        username: "Username:",
        password: "Password:",
        passwordConfirm: "Password Confirmation:",
        buttonMessage: "Sign Up"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    button = document.querySelector("#signupButton");
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
            pageData.username = username;
            pageData.token = newJson.token;
            getUsers();
            showHome();
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
            pageData.username = username;
            pageData.token = newJson.token;
            getUsers();
            showHome();
        });
}

function getUsers() {
    fetch("https://bcca-pingpong.herokuapp.com/api/users/", {
        method: "GET",
        headers: {
            Authorization: `Token ${pageData.token}`
        }
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(newJson) {
            console.log(newJson);
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
    playerInputListen();
    showGamePlay();
}

function showGameStart() {
    var newGameButton = document.getElementById("startNewGame");
    newGameButton.addEventListener("click", showSetGame);
}

function showScoreGame() {
    var source = document.getElementById("showScoreGame").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        setScoreGame: "Score Game",
        ref: `${pageData.username}`,
        scoreMessage: "Score:",
        playerOne: "Player 1 Name",
        playerOneScore: `${pageData.playerOneScore}`,
        scoreButtonText: "+1",
        playerTwo: "Player 2 Name",
        playerTwoScore: `${pageData.playerTwoScore}`,
        scoreButtonText2: "+1"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    listenForPoint();
}

function showGamePlay() {
    var newGameButton = document.getElementById("startGameButton");
    newGameButton.addEventListener("click", showScoreGame);
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
    console.log(playerOneInput, playerTwoInput);
    if (playerOneInput !== "" && playerTwoInput !== "") {
        document
            .querySelector("#startGameButton")
            .removeAttribute("disabled", "disabled");
    } else {
        document
            .querySelector("#startGameButton")
            .setAttribute("disabled", "disabled");
    }
}

function singUpListen() {
    document.addEventListener("mouseover", signUpCheck);
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
        submitButton.removeAttribute("disabled", "disabled");
    } else {
        submitButton.setAttribute("disabled", "disabled");
    }
}

function loginListen() {
    document.addEventListener("mouseover", loginCheck);
}

function loginCheck() {
    var username = document.querySelector("#existingUsername");
    var password = document.querySelector("#existingPassword");
    var submitButton = document.querySelector("#loginButton");
    if (username.value != "" && password.value != "") {
        submitButton.removeAttribute("disabled", "disabled");
    } else {
        submitButton.setAttribute("disabled", "disabled");
    }
}
