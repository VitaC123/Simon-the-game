
// User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.

// User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.

// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.

// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.


"use strict";

var game;

function createNewGameInstance() {
  return {
    activeGame: false,
    strictMode: false,
    humanTurn: false,
    compPattern: [],
    humanPattern: [],
    activateButtons: function () {
      this.setupStartButton();
      this.setupStrictModeButton();
      this.setupColorButtons();
    },
    setupStartButton: function () {
      $(".startBtn").mouseup(function () {
        if (!game.activeGame) {
          game.activeGame = true;
          $(this).off("mouseup");
          makeCompMove();
        }
      });
    },
    setupStrictModeButton: function () {
      $(".strictModeEnable input").click(function () {
        if (!game.strictMode) {
          game.strictMode = true;
        } else {
          game.strictMode = false;
        }
      });
    },
    setupColorButtons: function () {
      $(".button").mousedown(function (event, compMove) {
        if (game.humanTurn) {
          var selectedButtonPosition = $(this).index() - 1;
          displayPattern(selectedButtonPosition);
          game.humanPattern.push(selectedButtonPosition);
          $(this).mouseup(function () {
            $(this).css("background-image", "");
            compareToCompPattern();
          });
        }
      });
    },

    audio: {
      playSample: function (samplePosition) {
        // Avoids "pop" in audio except by every 10 instances
        if ($(".audioSection").children().length > 10) {
          $(".audioSection").html("");
        }
        var htmlElem = "<audio autoplay><source src='" + game.audio.samples[samplePosition] + "' ></source></audio>";
        $(".audioSection").append(htmlElem);
      },
      samples: [
        "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
        "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
        "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
        "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
      ],
    },

    style: (function () {
      $(".scoreCount").css("color", "#cd1520");
      $(".scoreCount").text("00");
    })()

  }
}


$(".slider").click(function () {
  if (!game) {
    game = createNewGameInstance();
    game.activateButtons();
  } else {
    game = null;
    $(".scoreCount").css("color", "#880505");
  }
});

function makeCompMove() {
  if (!game.humanTurn) {
    console.log("makeCompMove just called");
    game.compPattern.push(Math.floor(Math.random() * 4));
    console.log(game.compPattern);
    var i = 0;
    var performPattern = setInterval(function () {
      displayPattern(game.compPattern[i]);
      if (i < game.compPattern.length - 1) {
        i++;
      } else {
        clearInterval(performPattern);
        cycleActivePlayer();
      }
    }, 500);
  }
}


function displayPattern(selectedButtonPosition) {
  game.audio.playSample(selectedButtonPosition);
  var buttonGradient = "radial-gradient";
  if (selectedButtonPosition === 0) {
    buttonGradient += "(#fbd16b, #f5ecaf, #e9de00)";
  } else if (selectedButtonPosition === 1) {
    buttonGradient += "(#0091f2, #91c8ec, #005e9c)";
  } else if (selectedButtonPosition === 2) {
    buttonGradient += "(#f66e5e, #e4a19e, #db0003)";
  } else if (selectedButtonPosition === 3) {
    buttonGradient += "(#02a300, #69d874, #00ae22)";
  }
  $(".button").eq(selectedButtonPosition).css("background-image", buttonGradient);
  if (!game.humanTurn) {
    setTimeout(() => $(".button").css("background-image", ""), 400);
  }
}


function compareToCompPattern() {
  var messageToPlayer = $(".scoreCount");
  var loseEvent;
  for (var i = 0; i < game.humanPattern.length; i++) {
    if (game.humanPattern[i] !== game.compPattern[i]) {
      loseEvent = true;
      messageToPlayer.text("!!");
      if (game.strictMode) {
        setTimeout(() => messageToPlayer.text("You"), 1000);
        setTimeout(() => messageToPlayer.text("Lost"), 2000);
        game.compPattern = [];
      } else {
        // Allow player to try again without reseting game
        setTimeout(() => messageToPlayer.text("Try"), 1000);
        setTimeout(() => messageToPlayer.text("Again"), 2000);
      }
      break;
    }
  }

  if (!loseEvent && game.humanPattern.length === game.compPattern.length) {
    messageToPlayer.text(game.humanPattern.length);
    if (game.humanPattern.length < 10) {
      messageToPlayer.prepend("0");
    }
    cycleActivePlayer();
  }
}

function cycleActivePlayer() {
  if (game.humanTurn) {
    game.humanTurn = false;
    setTimeout(makeCompMove, 500);
  } else { 
    game.humanTurn = true;
    game.humanPattern = [];
  }
}


// // Duplicating functionality to allow easy mobile UI
// $(".onBtnMobile").click(function () {
//   $(".slider").trigger("click");
// });

// $(".strictBtnMobile").click(function () {
//   $(".strictModeEnable input").trigger("click");
// });