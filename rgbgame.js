
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

var gameOver = false; // set each round in PopulateColors()
var roundOver = true;
var strikeCount = 2;
var strikes; // set each round in PopulateColors()
var roundNum = 0;

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
	if (!roundOver) { // if the round isn't over and they press new game, end current game immediately
		gameOverDisplay();
	}
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
var playAnimationFlag = false;

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

	// Set up New game if Game is Over
	if (gameOver) 	{ 
		points = 0;
		gameOver = false;
		submittedScore = false;
	}

	// Set up the new round
	strikes = 0;
	roundOver = false;
	colors = generateRandomColors(difficulty_settings["quantity"][mapIdxToDiff[quantSetting]]);
	goalColor = pickRandomColor();
	goalDisplay.textContent = goalColor;
	newColorsBtn.textContent = "New Game";
	newColorsBtn.classList.remove("glowButton");
	feedbackDisplay.textContent = "Pick the correct color!";
	pointsDisplay.textContent = points;

	canvasDisplay.style.display="none"; // Hide Canvas Display
	squareContainerDisplay.style.display="block";
	document.body.style.backgroundColor="#232323";
	//hudDisplay.style.background = "#232323";
	//feedbackDisplay.style.background = "#232323";

	playAnimationFlag = false; // stop animations
	

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

		// add Hover Effects to squares
		squares[i].addEventListener("mouseover", squareMouseOverSound);
  }
  // Enable Points again
  pointsFlag = true;

  if (playerName === "unknown") {
  	playerName = prompt("Enter your player name for the scoreboard", "");
  	if (playerName == '' || playerName == null){
  		playerNameDisplay.textContent = "Anonymous";
  		playerName ="Anonymous"; // need for later form submission
  	} else {
		playerNameDisplay.textContent = playerName;
		}
  }

}

function squareGameListener() {
			// grab clicked color
			var clickedColor = this.style.backgroundColor;
	
			// Correct Response
			if(clickedColor === goalColor) { 
				
				if (!gameOver && !roundOver) {

					// Points Calculation
					var quantPoints = difficulty_settings["quantity"]["points"][quantSetting];
				  var acuPoints = difficulty_settings["acuity"]["points"][acuSetting];
				  newPoints = quantPoints + acuPoints;
				  if (strikes == 1) { // Divide new Points by 2
					  newPoints = newPoints/2;
				  }
				  addPoints(newPoints);
				  pointsFlag = false;

					newColorsBtn.textContent = "Continue";
					roundNum++;

					// Update UI
					feedbackDisplay.textContent = "Correct!";
				} 
				if (gameOver) {
					feedbackDisplay.textContent = "Correct, but Game Over!";
					newColorsBtn.classList.add("glowButton");
				}
	
				winningColorsAnimation(clickedColor);
				roundOver = true;
				newColorsBtn.classList.add("glowButton");
			
			} else {
				// Incorrect Response
				this.style.background = "#232323"; // fade out tile
				strikes++;
				if (strikes >= strikeCount)
				{
					gameOverDisplay();					
				} else {
					feedbackDisplay.textContent = "Try again for 1/2 points";
				}
			}
		}

function squareMouseOverSound() {
	// Play Sound
	var audio = new Audio('Sounds/hover-1.mp3');
	audio.play();
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

	// submit Score
	if (!submittedScore) {
		submitScore();
		pointsFlag = false;
	}

	//Set Flags
	roundOver = true;
	gameOver = true;
	points = 0;
	roundNum = 0;
}

function winningColorsAnimation(color) {
	// Play Sound
	var audio = new Audio('Sounds/sparkle.mp3');
	audio.play();

	// Update Displays to goalColor
	for(var i = 0; i < colors.length; i++){
		squares[i].style.background = color;
	}
	h1Disp.style.background = color;

	// Play 'Animation' if 3 in a row
	if (roundNum%3==0 && roundNum != 0) {
		feedbackDisplay.textContent=roundNum+" in a row!";
		/**
		newColorsBtn.disabled=true;
		setTimeout(function() {
			fountainFunction( goalColor,  1.5+ (roundNum/15) );
			}, 500);
			**/
	}

}

/** Fountain Animation **/
fountainFunction = function(color, sp) {

	// Set Up HTML
	squareContainerDisplay.style.display="none";
	document.body.style.backgroundColor="black";
	document.getElementById('canvasDisplay').style.display="block";

  var DAMPING = 0.9999;
  var GRAVITY = 0.3;
  var DROP_COUNT = 500;
  var DROP_COLOR = color;
  var speed = sp;
  function Particle(x, y) {
    this.x = this.oldX = x;
    this.y = this.oldY = y;
  }
  Particle.prototype.integratez = function() {
    var velocity = this.getVelocity();
    this.oldX = this.x;
    this.oldY = this.y;
    this.x += velocity.x * DAMPING;
    this.y += velocity.y * DAMPING;
  };
  Particle.prototype.getVelocity = function() {
    return {
      x: this.x - this.oldX,
      y: this.y - this.oldY
    };
  };
  Particle.prototype.move = function(x, y) {
    this.x += speed*x;
    this.y += speed*y;
  };
  Particle.prototype.bounce = function() {
    if (this.y > height) {
      var velocity = this.getVelocity();
      this.oldY = height;
      this.y = this.oldY - velocity.y * 0.3;
    }
  };
  Particle.prototype.draw = function() {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.oldX, this.oldY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  };
  var display = document.getElementById('canvasDisplay');
  var ctx = display.getContext('2d');
  var drops = [];
  var width = display.width = window.innerWidth;
  var height = display.height = window.innerHeight;
  ctx.globalCompositeOperation = 'overlay';
  requestAnimationFrame(frame);
  function frame() {
    requestAnimationFrame(frame);
    ctx.clearRect(0, 0, width, height);
    for (var j = 0; j < 5; j++) {
      if (drops.length < DROP_COUNT) {
        var drop = new Particle(width * 0.5, height);
        drop.move(Math.random() * 4 - 2, Math.random() * -2 - 15);
        drops.push(drop);
      }
    }
    newColorsBtn.disabled=false;
    for (var i = 0; i < drops.length; i++) {
      drops[i].move(0, GRAVITY);
      drops[i].integratez();
      drops[i].bounce();
      drops[i].draw();
    }
  }
}

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

function submitScoreToDb() {
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
