const baseURL = "http://wilsonseverywhere.ddns.net";

let user = {}

const clearUserData = function () {
    user.username = user.password = user.token = undefined;
}

clearUserData();
updatePageWithLoginStatus();

function loggedIn() {
    return user.token !== undefined;
}

function displayLoginError(message) {
    $("#login-error")
    .text(`Error: ${message}`)
    .css("display", "unset");
}

function clearLoginError() {
    $("#login-error")
    .text("")
    .css("display", "none");
}

function addPiece (square, colour, piece) {
    $("#"+square).prepend(`<img class="piece" src="images/${colour}_${piece}.svg" alt="${colour} ${piece}">`);
}

function clearSquare (square) {
    $("#"+square+" img").remove();
}

function clearBoard () {
    $(".piece").remove();
}

function updatePageWithLoginStatus () {

    if (loggedIn()) {
        $(".logged-in").css("display","unset");
        $(".not-logged-in").css("display","none");
        $(".username-greeting").text(user.username);
    }

    else { //not logged in
        $(".logged-in").css("display","none"); //don't show the logged in stuff
        $(".not-logged-in").css("display","unset"); //go back to whatever it was
        $(".username-greeting").text("Guest");
    }
}

function addGameChoices () {
    $.getJSON(baseURL + "/simuchess/player", user, function (data) {
        data.games.forEach(function (gameID) {
            $("#game-choice").prepend(`<option>${gameID}</option>`);
        });
    });
}

const logOut = function () {
    $.ajax({
        url: baseURL + "/simuchess/token",
        type: 'DELETE',
        data: {token:user.token},
        success: function(request) {console.log("YO");}
    });

    clearBoard();
    $("#game-choice").children().remove();    // wipe games list
    clearUserData();// reset user object to undefined
    updatePageWithLoginStatus();
}

$("#logout").click(logOut);

function basicAuthHeader (username, password) {
    let header = {};
    header.Authorization = `Basic ${btoa(username + ':' + password)}`;
    return header;
}




$("#login-submit").click(tryLogin);
    

function tryLogin () {
    clearLoginError();

    user.username = $("#username-field").val();
    user.password = $("#password-field").val();

    $.ajax(
    {
        url : baseURL + '/simuchess/token',
        headers : basicAuthHeader(user.username, user.password),
        statusCode : {
            401 : function () {displayLoginError("Problem with your credentials")},
            500 : function () {displayLoginError("Problem with the Simuchess game server")},
            502 : function () {displayLoginError("Problem with the Simuchess Gateway")}
        },
        success : successfulLogin,
    });
}

function successfulLogin (data, status, jqXHR) {
    user.token = data.token;
    updatePageWithLoginStatus();
}

addPiece("c6","black","pawn");