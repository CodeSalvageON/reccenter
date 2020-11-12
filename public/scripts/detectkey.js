// Detect Keypresses and execute functions from other scripts, namely script.js

$(this).keypress(function (event) {
  if (screen === 1) {
    console.log(event.keyCode);

    if (event.keyCode === 99) {
      returnToMainScreen();
    }
  }

  else if (screen === 3) {
    if (event.keyCode === 109) {
      returnToMainRoom();

      screen = 2;
    }
  }

  else if (screen === 4) {
    if (event.keyCode === 109) {
      returnToMainRoom();

      screen = 2;
    }
  }

  else if (screen === 5) {
    if (event.keyCode === 109) {
      returnToFirstFloorHallway();

      screen = 4;
    }
  }

  else if (screen === 6) {
    if (event.keyCode === 109) {
      returnToStairWell();

      screen = 5;
    }
  }

  else if (screen === 7) {
    if (event.keyCode === 109) {
      returnToSecondFloorHallway();

      screen = 6;
    }
  }

  else {
    return false;
  }
});