// Hallway

// Render the World
var first_floor_hallway = document.getElementById("first-floor-hallway");
var first_floor_hallway_render = first_floor_hallway.getContext('2d');

var hallway_one_x = first_floor_hallway.width;
var hallway_one_y = first_floor_hallway.height;

var door_frame_hallway_1_x = 70;
var door_frame_hallway_1_y = 165;

var door_frame_hallway_2_x = 350;
var door_frame_hallway_2_y = 165;

var door_frame_hallway_3_x = 630;
var door_frame_hallway_3_y = 165;

console.log(hallway_one_x);
console.log(hallway_one_y);

function simulateKeyPress(character) {
  jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
}

simulateKeyPress("d");

var hallway_one_floor_x = 0;
var hallway_one_floor_y = 520;

var hallway_one_floor = new Image();
hallway_one_floor.onload = function () {
  first_floor_hallway_render.drawImage(hallway_one_floor, 0, 520);

  console.log(hallway_one_floor.width);
  console.log(hallway_one_floor.height);
}
hallway_one_floor.src = "https://images-ext-2.discordapp.net/external/G31R1VK2EDKX1lBtK0kdfUDRQSTOesNOPaGooWnbpc8/https/www.cogic.org/wp-content/uploads/2015/03/brown-bar.png?width=1025&height=86";

var door_frame_hallway_1 = new Image();
door_frame_hallway_1.onload = function () {
  first_floor_hallway_render.drawImage(door_frame_hallway_1, 70, 165);

  console.log(door_frame_hallway_1.width);
  console.log(door_frame_hallway_1.height);
}
door_frame_hallway_1.src = "https://media.discordapp.net/attachments/772064957793435678/773521938039046174/dfeec75e1338bf8ee459c222e34455c5.png";

var door_frame_hallway_2 = new Image();
door_frame_hallway_2.onload = function () {
  first_floor_hallway_render.drawImage(door_frame_hallway_2, 350, 165);

  console.log(door_frame_hallway_2.width);
  console.log(door_frame_hallway_2.height);
}
door_frame_hallway_2.src = "https://media.discordapp.net/attachments/772064957793435678/773521938039046174/dfeec75e1338bf8ee459c222e34455c5.png";

var door_frame_hallway_3 = new Image();
door_frame_hallway_3.onload = function () {
  first_floor_hallway_render.drawImage(door_frame_hallway_3, 630, 165);

  console.log(door_frame_hallway_3.width);
  console.log(door_frame_hallway_3.height);
}
door_frame_hallway_3.src = "https://media.discordapp.net/attachments/772064957793435678/773521938039046174/dfeec75e1338bf8ee459c222e34455c5.png";

// Movement Controls and Camera Fix
function hallWayLeft () {
  console.log("LEFT");
  
  first_floor_hallway_render.clearRect(0, 0, first_floor_hallway.width, first_floor_hallway.height);

  door_frame_hallway_1_x = door_frame_hallway_1_x + 5.5;
  door_frame_hallway_2_x = door_frame_hallway_2_x + 5.5;
  door_frame_hallway_3_x = door_frame_hallway_3_x + 5.5;

  first_floor_hallway_render.drawImage(hallway_one_floor, 0, 520);

  console.log(door_frame_hallway_1_x);
  console.log(door_frame_hallway_2_x);
  console.log(door_frame_hallway_3_x);

  first_floor_hallway_render.drawImage(door_frame_hallway_1, door_frame_hallway_1_x, door_frame_hallway_1_y);

  first_floor_hallway_render.drawImage(door_frame_hallway_2, door_frame_hallway_2_x, door_frame_hallway_2_y);

  first_floor_hallway_render.drawImage(door_frame_hallway_3, door_frame_hallway_3_x, door_frame_hallway_3_y);

  if (door_frame_hallway_1_x > 900) {
    door_frame_hallway_1_x = -800;
  }

  if (door_frame_hallway_2_x > 900) {
    door_frame_hallway_2_x = -800;
  }

  if (door_frame_hallway_3_x > 900) {
    door_frame_hallway_3_x = -800;
  }
}

function hallWayRight () {
  console.log("RIGHT");
  
  first_floor_hallway_render.clearRect(0, 0, first_floor_hallway.width, first_floor_hallway.height);

  door_frame_hallway_1_x = door_frame_hallway_1_x - 5.5;
  door_frame_hallway_2_x = door_frame_hallway_2_x - 5.5;
  door_frame_hallway_3_x = door_frame_hallway_3_x - 5.5;

  first_floor_hallway_render.drawImage(hallway_one_floor, 0, 520);

  console.log(door_frame_hallway_1_x);
  console.log(door_frame_hallway_2_x);
  console.log(door_frame_hallway_3_x);

  first_floor_hallway_render.drawImage(door_frame_hallway_1, door_frame_hallway_1_x, door_frame_hallway_1_y);

  first_floor_hallway_render.drawImage(door_frame_hallway_2, door_frame_hallway_2_x, door_frame_hallway_2_y);

  first_floor_hallway_render.drawImage(door_frame_hallway_3, door_frame_hallway_3_x, door_frame_hallway_3_y);

  if (door_frame_hallway_1_x < -900) {
    door_frame_hallway_1_x = 800;
  }

  if (door_frame_hallway_2_x < -900) {
    door_frame_hallway_2_x = 800;
  }

  if (door_frame_hallway_3_x < -900) {
    door_frame_hallway_3_x = 800;
  }
}

// Detect Keypresses
$(this).keypress(function (event) {
  if (screen === 4) {
    if (event.keyCode === 100) {
      hallWayRight();
    }

    else if (event.keyCode === 97) {
      hallWayLeft();
    }
  }
});

// Detect mouseclicks
first_floor_hallway.addEventListener('click', event => {
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
    x: event.clientX - first_floor_hallway.offsetLeft,
    y: event.clientY - first_floor_hallway.offsetTop
  };

  if (mousePos.x > door_frame_hallway_1_x && mousePos.x < door_frame_hallway_1.width + door_frame_hallway_1_x && mousePos.y > door_frame_hallway_1_y && mousePos.y < door_frame_hallway_1.height + door_frame_hallway_1_y) {
    console.log("Clicked on the first door");

    $("#door-1").slideUp();

    $("#pool").slideDown();
    screen = 5;
  };

  if (mousePos.x > door_frame_hallway_2_x && mousePos.x < door_frame_hallway_2.width + door_frame_hallway_2_x && mousePos.y > door_frame_hallway_2_y && mousePos.y < door_frame_hallway_2.height + door_frame_hallway_2_y) {
    console.log("Clicked on the second door");
  }

  if (mousePos.x > door_frame_hallway_3_x && mousePos.x < door_frame_hallway_3.width + door_frame_hallway_3_x && mousePos.y > door_frame_hallway_3_y && mousePos.y < door_frame_hallway_3.height + door_frame_hallway_3_y) {
    console.log("Clicked on the third door");
  }
});