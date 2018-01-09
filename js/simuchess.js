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
    $.getJSON("/simuchess/token",user,function(data) {
        user.token = data.token;
        user.passsword = undefined;
        $(".username-greeting").text(user.username);
        console.log(user);


    });


});



addPiece("c6","black","pawn");