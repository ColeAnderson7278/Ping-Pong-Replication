var pageData = { playerOneScore: 0, playerTwoScore: 0 };

function listenForSignUp(pageData) {
    var signUpLink = document.querySelector("#SignUpLink");
    signUpLink.addEventListener("click", function() {
        showSignUpPage(pageData);
    });
}
listenForSignUp(pageData);

function showSignUpPage(pageData) {
    var source = document.getElementById("showSignUp").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        username: "Username:",
        password: "Password:",
        passwordConfirm: "Password Confirmation:",
        buttonMessage: "Submit"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    button = document.querySelector("#signupButton");
    button.addEventListener("click", function(event) {
        event.preventDefault();
        onSignIn(pageData);
    });
}

function listenForLogin(pageData) {
    var loginLink = document.querySelector("#LoginLink");
    loginLink.addEventListener("click", function() {
        showLoginPage(pageData);
    });
}
listenForLogin(pageData);

function showLoginPage(pageData) {
    var source = document.getElementById("showLogin").innerHTML;
    var template = Handlebars.compile(source);
    content = template({
        username: "Username:",
        password: "Password",
        buttonMessage: "Submit"
    });
    var place = document.querySelector("#script-placement");
    place.innerHTML = content;
    button = document.querySelector("#loginButton");
    button.addEventListener("click", function(event) {
        event.preventDefault();
        onLogin(pageData);
    });
}

function onSignIn(pageData) {
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
            getUsers(pageData);
            showHome(pageData);
        });
}

function onLogin(pageData) {
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
            getUsers(pageData);
            showHome(pageData);
        });
}

function getUsers(pageData) {
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

function showHome(pageData) {
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
    var newGameButton = document.getElementById("startGame");
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
