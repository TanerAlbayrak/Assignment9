var ScrabbleTiles = [];
ScrabbleTiles["A"] = {"value": 1, "original": 9, "remaining": 9};
ScrabbleTiles["B"] = {"value": 3, "original": 2, "remaining": 2};
ScrabbleTiles["C"] = {"value": 3, "original": 2, "remaining": 2};
ScrabbleTiles["D"] = {"value": 2, "original": 4, "remaining": 4};
ScrabbleTiles["E"] = {"value": 1, "original": 12, "remaining": 12};
ScrabbleTiles["F"] = {"value": 4, "original": 2, "remaining": 2};
ScrabbleTiles["G"] = {"value": 2, "original": 3, "remaining": 3};
ScrabbleTiles["H"] = {"value": 4, "original": 2, "remaining": 2};
ScrabbleTiles["I"] = {"value": 1, "original": 9, "remaining": 9};
ScrabbleTiles["J"] = {"value": 8, "original": 1, "remaining": 1};
ScrabbleTiles["K"] = {"value": 5, "original": 1, "remaining": 1};
ScrabbleTiles["L"] = {"value": 1, "original": 4, "remaining": 4};
ScrabbleTiles["M"] = {"value": 3, "original": 2, "remaining": 2};
ScrabbleTiles["N"] = {"value": 1, "original": 6, "remaining": 6};
ScrabbleTiles["O"] = {"value": 1, "original": 8, "remaining": 8};
ScrabbleTiles["P"] = {"value": 3, "original": 2, "remaining": 2};
ScrabbleTiles["Q"] = {"value": 10, "original": 1, "remaining": 1};
ScrabbleTiles["R"] = {"value": 1, "original": 6, "remaining": 6};
ScrabbleTiles["S"] = {"value": 1, "original": 4, "remaining": 4};
ScrabbleTiles["T"] = {"value": 1, "original": 6, "remaining": 6};
ScrabbleTiles["U"] = {"value": 1, "original": 4, "remaining": 4};
ScrabbleTiles["V"] = {"value": 4, "original": 2, "remaining": 2};
ScrabbleTiles["W"] = {"value": 4, "original": 2, "remaining": 2};
ScrabbleTiles["X"] = {"value": 8, "original": 1, "remaining": 1};
ScrabbleTiles["Y"] = {"value": 4, "original": 2, "remaining": 2};
ScrabbleTiles["Z"] = {"value": 10, "original": 1, "remaining": 1};
ScrabbleTiles["["] = {"value": 0, "original": 2, "remaining": 2};

var theRack = [];
var tableKeys = Object.keys(ScrabbleTiles).length;
var rackKeys = Object.keys(theRack).length;
var theScore = 0;
var tileLeft = [false, false, false, false, false, false, false, false, false, false];

//Function to randomize tiles
function tileRand() {
    return Math.floor((Math.random() * 27));
}

//Function to check if there are any tiles remaining
function remainingTiles() {

    var tileLeft = false;
    var offSet = 0;

    while (offSet < 27) {

        if (ScrabbleTiles[ String.fromCharCode(65 + offSet) ][ "remaining" ] !== 0) {
            tileLeft = true;
        }
        offSet++;
    }

    return tileLeft;

}

//Function to display tiles
function displayTiles() {
    for (k = 0; k < tableKeys; k++) {
        console.log(String.fromCharCode(65 + k) + " : " + ScrabbleTiles[ String.fromCharCode(65 + k) ][ "value" ]
                + " : " + ScrabbleTiles[ String.fromCharCode(65 + k) ][ "original" ]
                + " : " + ScrabbleTiles[ String.fromCharCode(65 + k) ][ "remaining"]);
    }
}



//Function to set the rack up, and refresh the rack when Generate New Rack button is clicked
function makeRack() {
    var MAX_TILES = 7;
    var rackCount = 1;
    var src;
    var id;
    var title;
    var tileClass = "scrabbleTile";

    $('#rackDiv div').empty();

    for (var i = 0; rackCount <= MAX_TILES; i++) {

        var randTile = tileRand();

        if (ScrabbleTiles[ String.fromCharCode(65 + randTile) ][ "remaining"] !== 0 && remainingTiles()) {
            theRack[rackCount] = {"letter": String.fromCharCode(65 + randTile), "value": ScrabbleTiles[ String.fromCharCode(65 + randTile) ][ "value" ]};
            ScrabbleTiles[ String.fromCharCode(65 + randTile) ][ "remaining"]--;
            rackKeys = Object.keys(theRack).length;
            console.log("theRack: Tile: " + (rackCount) + " Letter: " + theRack[rackCount][ "letter" ] + " Value: " + theRack[rackCount][ "value" ]);
            id = "tile" + rackCount;
            title = theRack[rackCount][ "letter" ];
            src = "img/Scrabble_Tile_" + theRack[rackCount][ "letter" ] + ".jpg";
            $('#theRack').prepend($('<img>', {id: id, src: src, class: tileClass, title: title}));
            rackCount++;
        }
        if (remainingTiles() === false) {
            $('#tileButtonDiv').append("<p>No Tiles Left</p>");
            $("#newTileButton").prop("disabled", true);
            return;
        }
        $("#" + id).draggable({snap: ".lineTile", snapMode: "inner"});
    }


}


//Function to detect where the tile was dropped(i.e double, triple, blank)
function tileDropped(event, ui) {
    if (tileLeft[$(this).attr("id") - 1] === false && $(this).attr("title") === 'doubleLetter') {
        theScore += (ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ] * 2);
    }
    else if (tileLeft[$(this).attr("id") - 1] === false && $(this).attr("title") === 'tripleLetter') {
        theScore += (ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ] * 3);
    }
    else if (tileLeft[$(this).attr("id") - 1] === false && $(this).attr("title") === 'blank') {
        theScore += (ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ]);
    }
    else if (tileLeft[$(this).attr("id") - 1] === false && $(this).attr("title") === 'doubleWord') {

        theScore = ((theScore + ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ]) * 2);
    }

    tileLeft[$(this).attr("id") - 1 ] = true;

    updateScore();
}

//Function to place the new score into #scoreHere
function updateScore() {
    $('#scoreHere').text(theScore);
}

//Function to detect where the tile was removed from
function tileRemoved(event, ui) {
    if (tileLeft[$(this).attr("id") - 1] === true && $(this).attr("title") === 'doubleLetter') {
        theScore -= (ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ] * 2);
    }
    else if (tileLeft[$(this).attr("id") - 1] === true && $(this).attr("title") === 'tripleLetter') {
        theScore -= (ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ] * 3);
    }
    else if (tileLeft[$(this).attr("id") - 1] === true && $(this).attr("title") === 'blank') {
        theScore -= (ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ]);
    }
    else if (tileLeft[$(this).attr("id") - 1] === true && $(this).attr("title") === 'doubleWord') {
        theScore = ((theScore / 2) - (ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ]));
    }

    tileLeft[$(this).attr("id") - 1 ] = false;

    updateScore();
}

$(document).ready(function () {
    makeRack();
    $(".lineTile").droppable({drop: tileDropped, out: tileRemoved});

});
