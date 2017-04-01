/** var colors = [
"rgb(255, 0, 0)",
"rgb(255, 255, 0)",
"rgb(255, 0, 255)",
"rgb(0, 255, 0)",
"rgb(0, 0, 255)",
"rgb(0, 255, 255)",
"rgb(0, 0, 0)",
"rgb(128, 128, 128)",
"rgb(255, 255, 255)"
]; **/


/**
#How Scoring Works:

There are 2 difficulty settings. They are: 1) "Tiles" 2) "Colors" 
Easy, Medium, Hard are the 3 levels for each difficulty Setting. 
You score points every time you choose the correct color on your FIRST try.
You receive 1,2, or 4 points with respect to the difficulty of the "Tiles" setting.
You receive 1,2, or 3 points with respect to the difficulty of the "Colors" setting.
e.g. on the easiest settings you would receive 2 points for each correct play,
and on the hardest settings you would receive 7 points for each correct play.
**/

var points = 0;
var pointsFlag;

var gameOver; // set each round in PopulateColors()
var strikeCount = 2;
var strikes; // set each round in PopulateColors()

var difficulty_settings = {
	quantity: {
		easySquare: 4,
		medSquare: 9,
		hardSquare: 16,
		points: [1,4,16]
	},
	acuity: {
		easySquare: [8, 32],
		medSquare: [16, 16],
		hardSquare: [32, 8],
		points: [1,2,3]
	}
};

// Used to map to Difficulty Settings & CSS Class
var mapIdxToDiff = {
	0: "easySquare",
	1: "medSquare",
	2: "hardSquare"
};

// Select Points
var pointsDisplay = document.querySelector("#points");
// Select Difficulty Buttons Logic //
var quantSetting = 0;
var acuSetting = 0;

// Select Mode A Buttons
var tileSettingsA = document.querySelectorAll(".settingsA");
tileSettingsA.forEach(function(btn, idx) {
	btn.addEventListener("click", function() {
		selectButtonA(idx);
		quantSetting = idx;
		//populateColorSquares(); // repopulate game board with new settings
	});
});

var squares = document.querySelectorAll(".square");

// generate random colors and pick the target color
var colors;
var goalColor;

var goalDisplay = document.querySelector("#targetRGB");
var feedbackDisplay = document.querySelector("#feedback");

var h1Disp= document.querySelector("h1");
var hudDisplay = document.querySelector("#HUD");

var playerNameDisplay = document.querySelector("#playerName");
var playerName = "unknown";

var squareContainerDisplay = document.querySelector("#container");
var newColorsBtn = document.querySelector("#newGame");
newColorsBtn.addEventListener("click", function() {
	// generate new random colors and pick a new target colo
	h1Disp.style.background = "#006080";
	populateColorSquares();
});

// Select Mode B Buttons
var tileSettingsB = document.querySelectorAll(".settingsB");
tileSettingsB.forEach(function(btn, idx) {
	btn.addEventListener("click", function() {
		selectButtonB(idx);
		acuSetting = idx;
		//populateColorSquares(); // repopulate game board with new settings
	});
});

var submittedScore = false;


function selectButtonA(idx) {
	tileSettingsA[idx].classList.add("selected");
	// Unselect other Buttons
	for (var i = 0; i < tileSettingsA.length; i++) {
			if(i !== idx) {
				tileSettingsA[i].classList.remove("selected");
			}
		}
}
function selectButtonB(idx) {
	tileSettingsB[idx].classList.add("selected");
	// Unselect other Buttons
	for (var i = 0; i < tileSettingsB.length; i++) {
			if(i !== idx) {
				tileSettingsB[i].classList.remove("selected");
			}
		}
}

function styleSquares(i, quantIdx) {

	// Add appropriate squares class
	squares[i].classList.add(mapIdxToDiff[quantIdx]);
	if ( quantIdx != 0) {
		squares[i].classList.remove(mapIdxToDiff[0]);
	}
	if ( quantIdx != 1) {
		squares[i].classList.remove(mapIdxToDiff[1]);
	}
	if ( quantIdx != 2) {
		squares[i].classList.remove(mapIdxToDiff[2]);
	}

}


function populateColorSquares() {
	// Set up game
	colors = generateRandomColors(difficulty_settings["quantity"][mapIdxToDiff[quantSetting]]);
	goalColor = pickRandomColor();
	goalDisplay.textContent = goalColor;
	newColorsBtn.textContent = "New Game";
	feedbackDisplay.textContent = "Pick the correct color!";
	pointsDisplay.textContent = points;

	//canvasDisplay.style.display="none"; // Hide Canvas Display
	//squareContainerDisplay.style.display="block";
	document.body.style.backgroundColor="#232323";
	//hudDisplay.style.background = "#232323";
	//feedbackDisplay.style.background = "#232323";

	strikes = 0;
	submittedScore = false;
	gameOver = false;
	stopAnimation = true;

	// Iterate through Squares
	for(var i = 0; i < squares.length; i++) {
		// add initial colors to squares
		if (colors[i]) {
			squares[i].style.display = "block"; // unhide blocks that were previously hidden
			squares[i].style.background = colors[i];
			// Style Squares
			styleSquares(i, quantSetting);
		} else {
			squares[i].style.display = "none"; // hide un used blocks
		}

		// add click listeners to squares
		squares[i].addEventListener("click", squareGameListener);
  }
  // Enable Points again
  pointsFlag = true;

  if (playerName === "unknown") {
  	playerName = prompt("Please enter your name to save your score", "");
  	if (playerName == '' || null){
  		playerNameDisplay.textContent = "Anonymous";
  		playerName ="Anonymous"; // need for later form submission
  	} else {
		playerNameDisplay.textContent = playerName;
		}
  }

}

function squareGameListener() {
			// grab clicked color
			var clickedColor = this.style.background;
	
			// Correct Response
			if(clickedColor === goalColor) { 
				
				// Points Calculation
				var quantPoints = difficulty_settings["quantity"]["points"][quantSetting];
				var acuPoints = difficulty_settings["acuity"]["points"][acuSetting];
				newPoints = quantPoints + acuPoints;
				if (strikes == 1) { // Divide new Points by 2
					newPoints = newPoints/2;
				}
				addPoints(newPoints);

				pointsFlag = false;

				// Update UI
				feedbackDisplay.textContent = "Correct!";
				winningColorsAnimation(clickedColor);
				if (!gameOver) {
				newColorsBtn.textContent = "Continue?";
				}

			} else {
				// Incorrect Response
				this.style.background = "#232323"; // fade out tile
				strikes++;
				if (strikes >= strikeCount)
				{
					gameOverDisplay();
					// submit Score
					if (!submittedScore) {
					submitScore();
					points = 0;
					gameOver = true;
					pointsFlag = false;
					}
				} else {
					feedbackDisplay.textContent = "Try again for 1/2 points";
				}
			}
		}
function addPoints(newpts) {
	if (pointsFlag) {
		points = points + newpts;
	}
		pointsDisplay.textContent = points;
}
function removePoints(newpts) {
	if (pointsFlag) {
		points = points - newpts;
		pointsDisplay.textContent = points;
	}
}

function gameOverDisplay()
{
	// Play Sound
	//var audio = new Audio('Sounds/lose2.wav');
	//audio.play();
	// Style Visual Feedback
	feedbackDisplay.textContent = "Game Over";
}

function winningColorsAnimation(color) {
	// Play Sound
	var audio = new Audio('Sounds/sparkle.mp3');
	audio.play();

	// Play 'Animation'
	//colorFountainAnimation();

	// Update Displays to goalColor
	for(var i = 0; i < colors.length; i++){
		squares[i].style.background = color;
	}
	h1Disp.style.background = color;
}

/** Fountain Animation **/

  

function pickRandomColor() {
	var randNum = Math.floor( Math.random() * colors.length);
	return colors[randNum];
}

function generateRandomColors(num){
	// make array
	var arr = [];
	// add num random colors to array
	for (var i = 0; i<num; i++){
		// create random color and add to array
		arr.push(randomColor());
	}

	// return array
	return arr;
}

function randomColor() {
	var factor1 = difficulty_settings["acuity"][mapIdxToDiff[acuSetting]][0];
	var factor2 = difficulty_settings["acuity"][mapIdxToDiff[acuSetting]][1];
	var r = Math.floor(Math.random() * factor1) * factor2;
	var g = Math.floor(Math.random() * factor1) * factor2;
	var b = Math.floor(Math.random() * factor1) * factor2;
	return "rgb(" + r + ", " + g + ", " + b +")";

}


function submitScore() {
    var dbForm = document.getElementById("database");
    var formName = document.getElementById("dbFormName");
    var formScore = document.getElementById("dbFormScore");
    var submitButton = document.getElementById("submit");

    formName.value = playerName;
    formScore.value = points;
    submittedScore = true;
    //dbForm.submit();
    //dbForm.submit();
    submitButton.click();



}

function myFunction() {
	var name = document.getElementById("dbFormName").value;
	var score = document.getElementById("dbFormScore").value;

	// Returns successful data submission message when the entered information is stored in database.
	var dataString = 'score_name=' + name + '&score_score=' + score;
	if (name == '' || score == '') {
		alert("Please Fill All Fields");
	} else {
		// AJAX code to submit form.
		$.ajax({
			type: "POST",
			url: "save_score_to_database.php",
			data: dataString,
			cache: false,
			success: function(html) {
				//alert(html);
			}
		});
	}
	return false;
}

function populateHighScores() {
	var hsDisplay = document.getElementById("highScoresDisplay");

	$.ajax({    //create an ajax request to load_page.php
        type: "GET",
        url: "highscores.php",             
        dataType: "html",   //expect html to be returned                
        success: function(response){                    
            $("#highScoresDisplay").html(response); 
            //alert(response);
        }
    });
}


/* * * * * * * * * * * * * * * * * * * * * * * *

		Initialize game with default Settings  

* * * * * * * * * * * * * * * * * * * * * * * */

// Show High Scores
populateHighScores();

// Select Default Settings
selectButtonA(quantSetting);
selectButtonB(acuSetting);

// Populate Color Squares to get the game started!
populateColorSquares();
