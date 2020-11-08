// Script for Canvas

// Render the World
var world = document.getElementById("world");
var world_render = world.getContext('2d');

var $world = $("#world");

var worldOffset = $world.offset();
var offsetX = worldOffset.left;
var offsetY = worldOffset.top;

var arcade_cabinet1_tolerance = 5;

function simulateKeyPress(character) {
  jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
}

var x = world.width;
var y = world.height;

var arcade_cabinet1_x = 200;
var arcade_cabinet1_y = 165;

var door_frame_1_x = 700;
var door_frame_1_y = 165;

var reception_desk_x = 1000;
var reception_desk_y = 285;

console.log(x);
console.log(y);

var floor = new Image();
floor.onload = function () {
  world_render.drawImage(floor, 0, 520);

  console.log(floor.width);
  console.log(floor.height);
}
floor.src = "https://images-ext-2.discordapp.net/external/G31R1VK2EDKX1lBtK0kdfUDRQSTOesNOPaGooWnbpc8/https/www.cogic.org/wp-content/uploads/2015/03/brown-bar.png?width=1025&height=86";

var arcade_cabinet1 = new Image();
arcade_cabinet1.onload = function () {
  world_render.drawImage(arcade_cabinet1, 200, 165);

  console.log(arcade_cabinet1.width);
  console.log(arcade_cabinet1.height);
}
arcade_cabinet1.src = "https://media.discordapp.net/attachments/772064957793435678/772634119212892190/game-machine.png?width=405&height=447";

var door_frame_1 = new Image();
door_frame_1.onload = function () {
  world_render.drawImage(door_frame_1, 700, 165);

  console.log(door_frame_1.width);
  console.log(door_frame_1.height);
}
door_frame_1.src = "https://media.discordapp.net/attachments/772064957793435678/773521938039046174/dfeec75e1338bf8ee459c222e34455c5.png";

var reception_desk = new Image();
reception_desk.onload = function () {
  world_render.drawImage(reception_desk, 1000, 285);

  console.log(reception_desk.width);
  console.log(reception_desk.height);
}
reception_desk.src = "https://media.discordapp.net/attachments/772064957793435678/773529342902272040/unknown-removebg-preview.png";

simulateKeyPress("d");

// Control Commands
function goLeft () {
  console.log("RIGHT");
  console.log(arcade_cabinet1_x);

  world_render.clearRect(0, 0, world.width, world.height);

  arcade_cabinet1_x = arcade_cabinet1_x - 5.5;
  door_frame_1_x = door_frame_1_x - 5.5;
  reception_desk_x = reception_desk_x - 5.5;

  world_render.drawImage(floor, 0, 520);

  world_render.drawImage(arcade_cabinet1, arcade_cabinet1_x, arcade_cabinet1_y);

  world_render.drawImage(door_frame_1, door_frame_1_x, door_frame_1_y);

  world_render.drawImage(reception_desk, reception_desk_x, reception_desk_y);

  if (arcade_cabinet1_x < -900) {
    console.log("arcade_cabinet1_x: " + arcade_cabinet1_x);

    arcade_cabinet1_x = 800;
  }

  if (door_frame_1_x < -900) {
    console.log("door_frame_1_x: " + door_frame_1_x);

    door_frame_1_x = 800;
  }

  if (reception_desk_x < -900) {
    console.log("reception_desk_x: " + reception_desk_x);

    reception_desk_x = 800;
  }
}

function goRight () {
  console.log("LEFT");
  console.log(arcade_cabinet1_x);

  world_render.clearRect(0, 0, world.width, world.height);

  arcade_cabinet1_x = arcade_cabinet1_x + 5.5;
  door_frame_1_x = door_frame_1_x + 5.5;
  reception_desk_x = reception_desk_x + 5.5;

  world_render.drawImage(floor, 0, 520);

  world_render.drawImage(arcade_cabinet1, arcade_cabinet1_x, arcade_cabinet1_y);

  world_render.drawImage(door_frame_1, door_frame_1_x, door_frame_1_y);

  world_render.drawImage(reception_desk, reception_desk_x, reception_desk_y);

  if (arcade_cabinet1_x > 900) {
    console.log("arcade_cabinet1_x: " + arcade_cabinet1_x);

    arcade_cabinet1_x = -800;
  }

  if (door_frame_1_x > 900) {
    console.log("door_frame_1_x: " + door_frame_1_x);

    door_frame_1_x = -800;
  }

  if (reception_desk_x > 900) {
    console.log("reception_desk_x: " + reception_desk_x);

    reception_desk_x = -800
  }
}

// Detect Keypresses
$(this).keypress(function (event) {
  if (screen === 2) {
    if (event.keyCode === 100) {
      goLeft();
    }

    else if (event.keyCode === 97) {
      goRight();
    }
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
    $("#main").slideUp();

    $("#games").slideDown();
    screen = 3;
  };

  if (mousePos.x > reception_desk_x && mousePos.x < reception_desk.width + reception_desk_x && mousePos.y > reception_desk_y && mousePos.y < reception_desk.height + reception_desk_y) {
    $("#main").slideUp();

    $("#plory").slideDown();
    screen = 3;
  }

  if (mousePos.x > door_frame_1_x && mousePos.x < door_frame_1.width + door_frame_1_x && mousePos.y > door_frame_1_y && mousePos.y < door_frame_1.height + door_frame_1_y) {
    $("#main").slideUp();

    $("#door-1").slideDown();
    screen = 4;
  }
});