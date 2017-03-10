// User Story: I am presented with a random series of button presses.

// User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.

// User Story: I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.

// User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.

// User Story: I can see how many steps are in the current series of button presses.

// User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.

// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.

// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.

// https://s3.amazonaws.com/freecodecamp/simonSound1.mp3, https://s3.amazonaws.com/freecodecamp/simonSound2.mp3, https://s3.amazonaws.com/freecodecamp/simonSound3.mp3, https://s3.amazonaws.com/freecodecamp/simonSound4.mp3.

"use strict";

var game = {
  activeGame: false,
  strictMode: false
}

$(".slider").click(function () {
  if (!game.activeGame) {
    game.activeGame = true;
    $(".scoreCount").css("color", "#cd1520");
  } else {
    game.activeGame = false;
    $(".scoreCount").css("color", "#880505");
  }
  console.log(game.activeGame);
});

$(".strictModeEnable input").click(function () {
  if (!game.strictMode) {
    game.strictMode = true;
  } else {
    game.strictMode = false;
  }
  console.log("game.strictMode", game.strictMode);
});

// Duplicating functionality to allow easy mobile UI
$(".onBtnMobile").click(function () {
  $(".slider").trigger("click");
});

$(".strictBtnMobile").click(function () {
  $(".strictModeEnable input").trigger("click");
});