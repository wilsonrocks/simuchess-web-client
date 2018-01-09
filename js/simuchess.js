const baseURL = "http://wilsonseverywhere.ddns.net";

let user = {username: undefined,
            password: undefined,
            token: undefined};

function addPiece (square, colour, piece) {
    $("#"+square).prepend(`<img class="piece" src="images/${colour}_${piece}.svg" alt="${colour} ${piece}">`);
}

function clearSquare (square) {
    $("#"+square+" img").remove();
}
$("#login-submit").click(function () {
    user.username = $("#username-field").val();
    user.password = $("#password-field").val();
    $.getJSON(baseURL + "/simuchess/token", user, function(data) {//On Success
        user.token = data.token;
        user.passsword = undefined;
        $(".username-greeting").text(user.username);
        $("#login-error").text("").css("display","none");
        })
        .fail(function(data) {//On failure
            console.log(data);
            $("#login-error").text("PROBLEM:" + data.responseJSON.message);
            $("#login-error").css("display","inline");
        });
});



addPiece("c6","black","pawn");