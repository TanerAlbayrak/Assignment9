/* Taner Albayrak
Taner_albayrak@student.uml.edu
12/9/15
GUI I Assignment 9: Scrabble game
*/

//https://teaching.cs.uml.edu/~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse.js
//possible way to store all the tiles, associative array, credit given to Professor Heines.


var tilesLeft = 100;
//this array represents the scrabble board and the positions of each character
var scrabble_slots_array = new Array(15);
//Word Score
var score = 0;
//round score
var tempScore = 0;

var dictionary = {};

//On user submit check word is valid
function submit(event)
{
    console.log("Submit Successful: " + $("#word").text());

    //check if the word is in the dictionary file
    if(!dictionary[$("#word").text().toLowerCase()] == true)
    {
        alert("Word is not in dict");
    }
    else
    {
        var numberTilesRemoved = 0;
        //carry score over from last round
        score += tempScore;

        //clear tiles from board
        for(var i = 0; i < scrabble_slots_array.length; i++)
        {
            if(scrabble_slots_array[i] != undefined && scrabble_slots_array[i].length > 0)
            {
                $("#" + scrabble_slots_array[i]).remove();
                scrabble_slots_array[i] = "";
                //count how many tiles were removed
                numberTilesRemoved++;
            }
        }

        console.log("Adding " + numberTilesRemoved + " tiles");
        //generate enough tiles to bring the count back to seven
        generateTiles(numberTilesRemoved);
        $("#word").text("");
        $(".tile" ).draggable();
    }
}

//Method called after scrabble board changes
//Updates the UI after changes are made to the board
function updateScrabbleWord()
{
    var newText = "";

    //go through all the characters currently on the board and build a new string with them
    for (var i = 0; i < scrabble_slots_array.length; i++)
    {
        if (scrabble_slots_array[i] != undefined && scrabble_slots_array[i].length > 0)
            newText += $("#" + scrabble_slots_array[i]).attr("alt");
    }

    //replace hold string with updated one
    $("#word").text(newText);
}
function updateScore()
{
    //reset score
    tempScore = 0;
    var doubleWord = false;

    //go through each filled slot on the board
    for (i = 0; i < scrabble_slots_array.length; i++)
    {
        if (scrabble_slots_array[i] != undefined && scrabble_slots_array[i].length > 0)
            //for each filled slot find its value and add it to score
            for (x = 0; x < scrabbleTiles.length; x++)
            {
                if (scrabbleTiles[x].char == $("#" + scrabble_slots_array[i]).attr("alt"))
                    //double letter score
                    if(i == 6 || i == 8 || i == 21 || i == 23)
                        tempScore += scrabbleTiles[x].value*2;
                    //double word score
                    else if(i == 2 || i == 12 || i == 17 || i == 27)
                    {
                        tempScore += scrabbleTiles[x].value;
                        doubleWord = true;
                    }
                    else
                        tempScore += scrabbleTiles[x].value;
            }
    }

    if(doubleWord == true)
        tempScore *= 2;

    //update the score
    $("#score").text(tempScore + score);
}
function tileDropped(event, ui)
{
    console.log("tile: " + ui.draggable.attr("id") + " dropped");

    //snap tile into position
    ui.draggable.position(
    {
        my: "center",
        at: "center",
        of: $(this)
    });

    //add tile to board
    scrabble_slots_array[$(this).attr("id")] = ui.draggable.attr("id");

    updateScore();
    updateScrabbleWord();
}

function tileRemoved(event, ui)
{
    console.log("tile: " + ui.helper.attr("id") + " removed");

    //Make sure the tile removed is the tile that was on the slot
    if(ui.draggable.attr("id") == scrabble_slots_array[$(this).attr("id")])
        //remove tile from board
        scrabble_slots_array[$(this).attr("id")] = "";

    updateScore();
    updateScrabbleWord();
}

function generateTiles(numberTiles)
{
    //Generate seven tiles
    for(i = 0; i < numberTiles; i++)
    {
        //randomly choose a tile from the remaining tiles (tiles left)
        var tileNumber = Math.floor((Math.random() * tilesLeft) + 1);
        var tile;

        //convert tile number to an actual tile character
        for (x = 0; x < scrabbleTiles.length; x++)
        {
            //When the tileNumber becomes less then zero scrabbleTiles[x].char is the character chosen
            tileNumber = tileNumber - scrabbleTiles[x].remaining;

            if (tileNumber < 0)
            {
                scrabbleTiles[x].remaining--;
                tilesLeft--;
                tile = "Scrabble_Tile_" + scrabbleTiles[x].char + ".jpg";
                break;
            }
        }

        //parse the filename for just the one letter character
        var char = tile.substring(14, 15);
        $("#tile_rack").append("<img src=images/" + tile + " alt=" + char + " class='tile' id=" + char + tilesLeft +" />");
    }
}

$(document).ready(function ()
{
    (function()
    {
        generateTiles(7);

        // Do a jQuery Ajax request for the text dictionary
        $.get( "download/american-english.txt", function( file )
        {
            // Get an array of all the words
            var dict = file.split( "\n" );

            // And add them as properties to the dictionary lookup
            // This will allow for fast lookups later
            for ( var i = 0; i < dict.length; i++ )
            {
                dictionary[ dict[i].toLowerCase() ] = true;
            }
        });

        $("#submit_button").button().click(submit);
        $(".tile" ).draggable();
        $(".scrabble_slots").droppable({drop: tileDropped, out: tileRemoved});
    })();
});

// how all the letter tiles are stored
var scrabbleTiles = [
    {char:"A", value : 1,  remaining : 9  }
    , {char:"B", value : 3,  remaining : 2  }
    , {char:"C", value : 3,  remaining : 2  }
    , {char:"D", value : 2,  remaining : 4  }
    , {char:"E", value : 1,  remaining : 12 }
    , {char:"F", value : 4,  remaining : 2  }
    , {char:"G", value : 2,  remaining : 3  }
    , {char:"H", value : 4,  remaining : 2  }
    , {char:"I", value : 1,  remaining : 9  }
    , {char:"J", value : 8,  remaining : 1  }
    , {char:"K", value : 5,  remaining : 1  }
    , {char:"L", value : 1,  remaining : 4  }
    , {char:"M", value : 3,  remaining : 2  }
    , {char:"N", value : 1,  remaining : 6  }
    , {char:"O", value : 1,  remaining : 8  }
    , {char:"P", value : 3,  remaining : 2  }
    , {char:"Q", value : 10, remaining : 1  }
    , {char:"R", value : 1,  remaining : 6  }
    , {char:"S", value : 1,  remaining : 4  }
    , {char:"T", value : 1,  remaining : 6  }
    , {char:"U", value : 1,  remaining : 4  }
    , {char:"V", value : 4,  remaining : 2  }
    , {char:"W", value : 4,  remaining : 2  }
    , {char:"X", value : 8,  remaining : 1  }
    , {char:"Y", value : 4,  remaining : 2  }
    , {char:"Z", value : 10, remaining : 1  }
    , {char:"_", value : 0,  remaining : 2  }] ;
