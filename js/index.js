(function () {
  "use strict";

  var game = {
    initializeNewGame: function () {
      this.activeGame = false;
      $(".redMessageBox").text("New");
      setTimeout(function () {
        this.activeGame = true;
        this.humanTurn = false;
        this.humanPattern = [];
        this.compPattern = [];
        this.displayLevel();
        this.generateNewCompMove();
      }.bind(game), 1500);
    },
    displayLevel: function () {
      $(".redMessageBox").text(game.humanPattern.length);
      if (game.humanPattern.length < 10) {
        $(".redMessageBox").prepend("0");
      }
    },
    generateNewCompMove: function () {
      game.compPattern.push(Math.floor(Math.random() * 4));
      game.performCompPattern();
    },
    performCompPattern: function () {
      this.humanTurn = false;
      var i = 0;
      var performance = setInterval(function () {
        ui.display.displayPattern(this.compPattern[i]);
        if (i < this.compPattern.length - 1 && this.activeGame) {
          i++;
        } else {
          clearInterval(performance);
          this.humanPattern = [];
          this.humanTurn = true;
        }
      }.bind(game), 500);
    },
    compareToCompPattern: function () {
      var loseEvent;
      for (var i = 0; i < this.humanPattern.length; i++) {
        if (this.humanPattern[i] !== this.compPattern[i]) {
          loseEvent = true;
          break;
        }
      }
      if (loseEvent) {
        this.humanTurn = false;
        $(".redMessageBox").text("!!");
        if (this.strictMode) {
          setTimeout(() => $(".redMessageBox").text("You"), 1000);
          setTimeout(() => $(".redMessageBox").text("Lost"), 2000);
          setTimeout(game.initializeNewGame, 3000);
        } else {
          setTimeout(() => $(".redMessageBox").text("Try"), 1000);
          setTimeout(() => $(".redMessageBox").text("Again"), 2000);
          setTimeout(function () {
            $(".redMessageBox").text("--");
            game.performCompPattern();
          }, 3000);
        }
      } else if (this.humanPattern.length === this.compPattern.length) {
        this.displayLevel();
        if (this.humanPattern.length < 20) {
          setTimeout(game.generateNewCompMove, 500);
        } else {
          setTimeout(() => $(".redMessageBox").text("You"), 1000);
          setTimeout(() => $(".redMessageBox").text("Win!"), 2000);
          setTimeout(game.initializeNewGame, 5000);
        }
      }
    }
  };

  
  var ui = {
    buttons: {
      setupOnOffButton: (function () {
        $(".onOffButton").mousedown(function () {
          if (!$(".switch input").prop("checked")) {
            ui.buttons.setupStartButton();
            ui.buttons.setupStrictModeButton();
            ui.buttons.setupColorButtons();
            $(".redMessageBox").css("color", "#cd1520");
          } else if ($(".switch input").prop("checked")) {
            game.activeGame = false;
            $(".startBtn").off().addClass("disabled").text("START");
            $(".strictModeEnable input").off().addClass("disabled").prop("checked", false);
            $(".button").off();
            $(".redMessageBox").css("color", "#880505").text("00");
          }
        });
      })(),
      setupStartButton: function () {
        $(".startBtn").removeClass("disabled");
        $(".startBtn").mouseup(function () {
          game.initializeNewGame();
          if (!game.activeGame) {
            $(this).text("RESTART");
          }
        });
      },
      setupStrictModeButton: function () {
        $(".strictModeEnable input").removeClass("disabled").prop("checked", false);
        $(".strictModeEnable input").click(function () {
          if ($(this).prop("checked")) {
            game.strictMode = true;
          } else {
            game.strictMode = false;
          }
        });
      },
      setupColorButtons: function () {
        $(".button").mousedown(function () {
          if (game.humanTurn) {
            var selectedButtonPosition = $(this).index() - 1;
            game.humanPattern.push(selectedButtonPosition);
            ui.display.displayPattern(selectedButtonPosition);
          }
        });
        $(".button").mouseup(function () {
          if (game.humanTurn) {
            $(this).css("background-image", "");
            game.compareToCompPattern();
          }
        });
      }
    },
    display: {
      displayPattern: function (selectedButtonPosition) {
        if (game.activeGame) {
          ui.audio.playSample(selectedButtonPosition);
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
      }
    },
    audio: {
      preLoadAudioSamples: (function () {
        $(document).ready(function () {
          var engine = new jWebAudio.SoundEngine();
          ui.audio.audioSource = engine.addSoundSource({
            'url': [
              "https://raw.githubusercontent.com/VitaC123/Simon-the-game/master/audio/simonSound0.mp3",
              "https://raw.githubusercontent.com/VitaC123/Simon-the-game/master/audio/simonSound1.mp3",
              "https://raw.githubusercontent.com/VitaC123/Simon-the-game/master/audio/simonSound2.mp3",
              "https://raw.githubusercontent.com/VitaC123/Simon-the-game/master/audio/simonSound3.mp3"
            ],
            'multishot': true,
            'preLoad': true
          });
        });
      })(),
      playSample: function (selectedButtonPosition) {
        ui.audio.audioSource[selectedButtonPosition].sound.play();
      }
    }
  };
})();