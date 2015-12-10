$(document).ready(
        function () {
            Deal();
        });

//Sets up drag and drop interface on pageload
$(document).ready(
        function () {
            DragAndDrop();
        });


//global vairables
var FirstDeal = 0; //is it the first deal? 0=yes, 1=no
var letters = "";  //string to keep track of
var Score = 0;  //score global
var Droppped = 0;

//alphabet array and the corresponding array of values in alphabetical order
var piecesarray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var valuesarray = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10];


//drag and drop stuff
function DragAndDrop() {
    $(".draggable").draggable({
        revert: 'invalid',
        snap: ".droppable",
        snapMode: "inner"
    });
    $(".droppable").droppable({
        accept: ".draggable",
        drop: function (event, ui) {

            //snap to center modified from here:
            /* http://stackoverflow.com/questions/26746823/jquery-ui-drag-and-drop-snap-to-center */

            ui.draggable.position({
                my: "center",
                at: "center",
                of: $(this),
                using: function (pos) {
                    $(this).animate(pos, 200, "linear");
                }});

            //give scoring the current letter we dropped
            Scoring($(ui.draggable).children("img").attr("alt"), $(this).children("img").attr("alt"));

            $(this).droppable('option', 'accept', ui.draggable);
        },
        out: function (event, ui) {
            $(this).droppable('option', 'accept', '.draggable');
            UnScoring($(ui.draggable).children("img").attr("alt"));
        }

    });
}
;


//deals letter tiles to player
function Deal() {

    if (FirstDeal === 1)    //if its not the first deal, empty the rack before adding tiles
        $("#rack").html("");

    //generates 7 random letter tiles for rack
    letters = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    //generate random chracters adapted from:
    //http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript

    for (var i = 0; i < 7; i++)
        letters += alphabet.charAt(Math.floor(Math.random() * alphabet.length));

    //deal letter tiles to the player based on the string generated above
    for (var j = 0; j < 7; j++)
        $("#rack").append("<div class='draggable'>"
                + "<img src='Scrabble_Tiles/Scrabble_Tile_"
                + letters.charAt(j)
                + ".jpg' width=50 height=50 alt='"
                + letters.charAt(j)
                + "'>"
                + "</div>");

    //it is no longer the first deal
    FirstDeal = 1;

    //I dont know why but the drag and drop interface needs to be reimplented entirely after deal
    DragAndDrop();

    //resets score to zero, because we just dealt and there are no words yet
    Score = 0;

    //we have to rewrite the score on the page to zero
    $("#score").html("<p>Score: " + Score + "<p>");
}
;

//score the game
function Scoring(tile, square) {

    var letterscore = 0; //score of our current tile
    

    for (var i = 0; i < 26; i++) {
        if (tile === piecesarray[i]) {
            letterscore = valuesarray[i];
        }
    } //find our tile score

    if (square === "doubleletter")
        letterscore = letterscore * 2;

    Score += letterscore;

    if (square === "tripleword")
        Score = Score * 3;

    //write the score on the page
    $("#score").html("<p>Score: " + Score + "<p>");
}
;


function UnScoring(tile){
    
    var letterscore = 0; //score of our current tile

    for (var i = 0; i < 26; i++) {
        if (tile === piecesarray[i]) {
            letterscore = valuesarray[i];
        }
    }
    
    Score = Score - letterscore ;
    
    $("#score").html("<p>Score: " + Score + "<p>");

}
