
// User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.

// User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.

// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.

// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.


"use strict";

var game = {
  activeGame: false,
  strictMode: false,
  humanTurn: false,
  compPattern: [],
  humanPattern: []
}

$(".slider").click(function () {
  if (!game.activeGame) {
    game.activeGame = true;
    $(".scoreCount").css("color", "#cd1520");
    // enableButtons();
  } else {
    game.activeGame = false;
    $(".scoreCount").css("color", "#880505");
    $(".button").off("mousedown");
  }
  var turnOnSound = document.getElementById("turnOn");
  turnOnSound.volume = 0.2;
  $(".turnOnSound")[0].play();
});

$(".strictModeEnable input").click(function () {
  if (!game.strictMode) {
    game.strictMode = true;
  } else {
    game.strictMode = false;
  }
});

$(".startBtn").mouseup(function () {
  if (game.activeGame === true) {
    makeCompMove();
    $(this).off("mouseup");
  }
});

//function enableButtons() {
$(".button").mousedown(function (event, compMove) {
  var selectedButton = $(this).index();
  if (compMove !== undefined) {
    selectedButton = compMove;
  }

  $("audio").each(function () { // This works, but causes errors in console
    this.pause();
    this.currentTime = 0;
  });

  var buttonGradient;
  switch (selectedButton) {
    case 1:
      buttonGradient = "radial-gradient(#fbd16b, #f5ecaf, #e9de00)";
      $(".yellowButtonSound")[0].play();
      break;
    case 2:
      buttonGradient = "radial-gradient(#0091f2, #91c8ec, #005e9c)"
      $(".blueButtonSound")[0].play();
      break;
    case 3:
      buttonGradient = "radial-gradient(#f66e5e, #e4a19e, #db0003)";
      $(".redButtonSound")[0].play();
      break;
    case 4:
      buttonGradient = "radial-gradient(#02a300, #69d874, #00ae22)";
      $(".greenButtonSound")[0].play();
      break;
  }
  $(".button").eq(selectedButton - 1).css("background-image", buttonGradient);

  if (game.humanTurn) {
    game.humanPattern.push($(this).index());
    compareToCompPattern();
    $(this).mouseup(function () {
      $(this).css("background-image", "");
    });
  }
});
//}



function makeCompMove() {
  console.log("makeCompMove just called!");
  game.humanTurn = false;
  game.compPattern.push(Math.floor(Math.random() * 4 + 1));
  var i = 0;
  var performCompMoves = setInterval(function () {
    $(".button").trigger("mousedown", game.compPattern[i]);
    setTimeout(() => $(".button").css("background-image", ""), 400);
    i++;
    if (i > game.compPattern.length - 1) {
      clearInterval(performCompMoves);
      setTimeout(() => game.humanTurn = true, 400);
      game.humanPattern = [];
      console.log(game.compPattern);
    }
  }, 500);
}

function compareToCompPattern() {
  for (var i = 0; i < game.humanPattern.length; i++) {
    if (game.humanPattern[i] !== game.compPattern[i]) {
      $(".scoreCount").text("Lost!");
      if (game.strictMode) {
        game.compPattern = [];
      } else {
        // Allow player to try again without reseting game
      }
      break;
    }
  }
  if (game.humanPattern.length === game.compPattern.length) {
    $(".scoreCount").text(game.humanPattern.length);
    if (game.humanPattern.length < 10) { 
      $(".scoreCount").prepend("0");
    }
    console.log("About to call makeCompMove");
    setTimeout(makeCompMove, 500);
  }
}


// // Duplicating functionality to allow easy mobile UI
// $(".onBtnMobile").click(function () {
//   $(".slider").trigger("click");
// });

// $(".strictBtnMobile").click(function () {
//   $(".strictModeEnable input").trigger("click");
// });