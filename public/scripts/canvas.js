// Script for Canvas

// Render the World
var world = document.getElementById("world");
var world_render = world.getContext('2d');

var $world = $("#world");

var worldOffset = $world.offset();
var offsetX = worldOffset.left;
var offsetY = worldOffset.top;

var arcade_cabinet1_tolerance = 5;

var x = world.width;
var y = world.height;

var arcade_cabinet1_x = 200;
var arcade_cabinet1_y = 165;

console.log(x);
console.log(y);

var arcade_cabinet1 = new Image();
arcade_cabinet1.onload = function () {
  world_render.drawImage(arcade_cabinet1, 200, 165);

  console.log(arcade_cabinet1.width);
  console.log(arcade_cabinet1.height);
}
arcade_cabinet1.src = "https://media.discordapp.net/attachments/772064957793435678/772634119212892190/game-machine.png?width=405&height=447";

// Control Commands
function goLeft () {
  console.log("RIGHT");
  console.log(arcade_cabinet1_x);

  world_render.clearRect(0, 0, world.width, world.height);

  arcade_cabinet1_x = arcade_cabinet1_x - 5.5;

  world_render.drawImage(arcade_cabinet1, arcade_cabinet1_x, arcade_cabinet1_y);

  if (arcade_cabinet1_x < -900) {
    console.log(arcade_cabinet1_x);

    arcade_cabinet1_x = 900;
  }
}

function goRight () {
  console.log("LEFT");
  console.log(arcade_cabinet1_x);

  world_render.clearRect(0, 0, world.width, world.height);

  arcade_cabinet1_x = arcade_cabinet1_x + 5.5;

  world_render.drawImage(arcade_cabinet1, arcade_cabinet1_x, arcade_cabinet1_y);

  if (arcade_cabinet1_x > 900) {
    console.log(arcade_cabinet1_x);

    arcade_cabinet1_x = -900;
  }
}

// Detect Keypresses
$(this).keypress(function (event) {
  if (event.keyCode === 100) {
    goLeft();
  }

  else if (event.keyCode === 97) {
    goRight();
  }
});

// Detect clicks
function hitImg () {
  return (this.startX > arcade_cabinet1.imageX && this.startX < arcade_cabinet1.imageX + arcade_cabinet1.imageWidth + arcade_cabinet1_x && this.startY > arcade_cabinet1.imageY && this.startY < arcade_cabinet1.imageY + arcade_cabinet1.imageHeight + arcade_cabinet1_y);
}

world.addEventListener('click', event => {
  var mouseX, mouseY;

  if(event.offsetX) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  }
  
  else if(event.layerX) {
    mouseX = event.layerX;
    mouseY = event.layerY;
  }

  console.log(mouseX);
  console.log(mouseY);

  const mousePos = {
    x: event.clientX - world.offsetLeft,
    y: event.clientY - world.offsetTop
  };

  if (mousePos.x > arcade_cabinet1_x && mousePos.x < arcade_cabinet1.width + arcade_cabinet1_x && mousePos.y > arcade_cabinet1_y && mousePos.y < arcade_cabinet1.height + arcade_cabinet1_y) {
    alert("lol");
  };
});