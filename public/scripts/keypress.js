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

  else {
    return false;
  }
});