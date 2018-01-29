//is there already a token?
const baseURL = "http://wilsonseverywhere.ddns.net";


if (loggedIn()) {
    // we have a ttoken, so try and get the data
    chessAjax("GET", "/everything", setUpBoards);
}


let gameData = {};

function loggedIn() {
    return Cookies.get("token") !== undefined;
}

function displayLoginError(message) {
    $("#login-error")
    .text(`Error: ${message}`)
    .css("display", "inherit");
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
        $(".username-greeting").text(Cookies.get("username"));
    }

    else { //not logged in
        $(".logged-in").css("display","none"); //don't show the logged in stuff
        $(".not-logged-in").css("display","unset"); //go back to whatever it was
        $(".username-greeting").text("Guest");
        clearBoard();
    }
}

function addGameChoices () {
    $.getJSON(baseURL + "/simuchess/player", user, function (data) {
        data.games.forEach(function (gameID) {
            $("#game-choice").prepend(`<option>${gameID}</option>`);
        });
    });
}

const tryLogOut = function () { 
    chessAjax("DELETE","/token",successfulLogOut);
}

function successfulLogOut (data, status, jqXHR) {
    Cookies.remove("token");
    Cookies.remove("username");
    clearBoard();
    $("#game-choice").children().remove();    // wipe games list
    updatePageWithLoginStatus();
}

$("#logout").click(tryLogOut);

function basicAuthHeader (username, password) {
    let header = {};
    header.Authorization = `Basic ${btoa(username + ':' + password)}`;
    return header;
}

$("#login-submit").click(tryLogin);
    

function tryLogin () {
    clearLoginError();

    const username = $("#username-field").val();
    const password = $("#password-field").val();
    $.ajax(
    {
        url : baseURL + '/simuchess/token',
        headers : basicAuthHeader(username, password),
        statusCode : {
            401 : function () {displayLoginError("Problem with your credentials")},
            500 : function () {displayLoginError("Problem with the Simuchess game server")},
            502 : function () {displayLoginError("Problem with the Simuchess Gateway")}
        },
        success : successfulLogin,
    });
}

function chessAjax(method, endpoint, callback, data) {
    $.ajax(
        {
            
            url: baseURL + "/simuchess" + endpoint,
            headers: {
                authorization: Cookies.get("token")
            },
            statusCode : {
                401: function () {
                    flashMessage("There was a problem with your login token. We've logged you out. Please try and log in again.");
                    Cookies.remove("token");
                    Cookies.remove("username");
                    updatePageWithLoginStatus();
                },
                500 : function () {displayLoginError("Problem with the Simuchess game server")},
                502 : function () {displayLoginError("Problem with the Simuchess Gateway")}
            },  
            success: callback,
            data: data,
            method: method
        }
    );
}

function successfulLogin (data) { //this doesn't use chessAjax() because it uses basic auth instead of token
    Cookies.set("token", data.token);
    Cookies.set("username", data.username);
    updatePageWithLoginStatus();
    $.ajax(
        {
            url: baseURL + '/simuchess/everything',
            headers : {
                authorization: Cookies.get("token"),
            },
            success : setUpBoards, //TODO What happens if token is rejected (which it shouldn't be as we just got it)
        }
    )
}

function selectedGameID() {
    return Number($("#game-choice option:selected").val())
}

function setUpBoards (data) {
    gameData = data;
    gameData.games.forEach(function (game) {
        $("#game-choice").append(`<option value="${game.id}">${game.name}: ${game.black} vs ${game.white}</option>`);
    });
    drawBoard();
}

function drawBoard () {
    clearBoard();
    const id = selectedGameID();
    const pieces = gameData.games.filter(x => (x.id === id))[0].pieces;
    pieces.forEach(piece => addPiece(piece.square, piece.colour, piece.piece_type));

}

function flashMessage(text) {
    return $('body').prepend('<div class="flash-message">'+text+'</div>')
    .children().first()
    .append('<button type="button" class="flash-button">Ok</button>')
    .children().last()
    .on('click',function () {$(this).parent().remove();});
}

updatePageWithLoginStatus();
$("#game-choice").change(drawBoard);