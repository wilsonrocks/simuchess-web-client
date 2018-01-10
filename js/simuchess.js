const baseURL = "http://wilsonseverywhere.ddns.net";

let user = {username: undefined,
            password: undefined,
            token: undefined};

updatePageWithLoginStatus();

function addPiece (square, colour, piece) {
    $("#"+square).prepend(`<img class="piece" src="images/${colour}_${piece}.svg" alt="${colour} ${piece}">`);
}

function clearSquare (square) {
    $("#"+square+" img").remove();
}

function updatePageWithLoginStatus () {
    if (user.token === undefined) { //not logged in
        $(".logged-in").css("display","none"); //don't show the logged in stuff
        $(".not-logged-in").css("display","unset"); //go back to whatever it was
    }
    else {
        $(".logged-in").css("display","unset");
        $(".not-logged-in").css("display","none");
    }
    
}

function addGameChoices () {
    $.getJSON(baseURL + "/simuchess/player", user, function (data) {
        data.games.forEach(function (gameID) {
            $("#game-choice").prepend(`<option>${gameID}</option>`);
        });
    });
}

$("#login-submit").click(function () {
    user.username = $("#username-field").val();
    user.password = $("#password-field").val();
    $.getJSON(baseURL + "/simuchess/token", user, function(data) {//On Success
        user.token = data.token; //manage the user object
        user.password = undefined;
        $("#password-field").text("");
        
        $(".username-greeting").text(user.username);
        $("#login-error").text("").css("display","none");
        console.log(user);       
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