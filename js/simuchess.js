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

$("#login-submit").click(function () {
    user.username = $("#username-field").val();
    user.password = $("#password-field").val();
    $.getJSON(baseURL + "/simuchess/token", user, function(data) {//On Success
        user.token = data.token; //manage the user object
        user.password = undefined;
        $("#password-field").text("");
        $("#login-error").text("").css("display","none");
        updatePageWithLoginStatus();

        addGameChoices();
        })
        .fail(function(data) {//On failure
            console.log(data);
            $("#login-error")
            .text("PROBLEM:" + data.responseJSON.message)
            .css("display", "unset");
        });
});

addPiece("c6","black","pawn");