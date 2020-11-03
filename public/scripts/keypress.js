// Detect Keypresses and execute functions from other scripts, namely script.js
$(this).keypress(function (event) {
  if (screen === 1) {
    console.log(event.keyCode);

    if (event.keyCode === 99) {
      returnToMainScreen();
    }
  }

  else {
    return false;
  }
});