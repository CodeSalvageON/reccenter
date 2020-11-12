// Second Floor Hallway

// Render the World
var second_floor_hallway = document.getElementById("hallway2");
var second_floor_hallway_render = second_floor_hallway.getContext('2d');

function simulateKeyPress(character) {
  jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
}

simulateKeyPress("d");

var hallway_two_floor_x = 0;
var hallway_two_floor_y = 520;

var portal_x = 350;
var portal_y = 0;

var bathroom_door_x = 70;
var bathroom_door_y = 200;

var radio_x = 900;
var radio_y = 420;

var tv_x = 1000;
var tv_y = 165;

var hallway_two_floor = new Image();
hallway_two_floor.onload = function () {
  second_floor_hallway_render.drawImage(hallway_two_floor, 0, 520);

  console.log(hallway_two_floor.width);
  console.log(hallway_two_floor.height);
}
hallway_two_floor.src = "https://images-ext-2.discordapp.net/external/G31R1VK2EDKX1lBtK0kdfUDRQSTOesNOPaGooWnbpc8/https/www.cogic.org/wp-content/uploads/2015/03/brown-bar.png?width=1025&height=86";

var bathroom_door = new Image();
bathroom_door.onload = function () {
  second_floor_hallway_render.drawImage(bathroom_door, 70, 200);

  console.log(bathroom_door.width);
  console.log(bathroom_door.height);
}
bathroom_door.src = "https://media.discordapp.net/attachments/772064957793435678/776267105539719178/craig-metal-bathroom-door-TYP07.png";

var portal = new Image();
portal.onload = function () {
  second_floor_hallway_render.drawImage(portal, 350, 0);

  console.log(portal.width);
  console.log(portal.height);
}
portal.src = "https://images-ext-1.discordapp.net/external/SIonWBHIkKkgWG-_Dbt63tI5DdZly7D59RFz6kS6TqQ/%3Fu%3Dhttps%253A%252F%252Fmedia.giphy.com%252Fmedia%252F3o7aD2d7hy9ktXNDP2%252Fgiphy.gif%26f%3D1%26nofb%3D1/https/external-content.duckduckgo.com/iu/";

var radio = new Image();
radio.onload = function () {
  second_floor_hallway_render.drawImage(radio, radio_x, radio_y, 94, 168);

  console.log(radio.width);
  console.log(radio.height);
}
radio.src = "https://media.discordapp.net/attachments/772064957793435678/776440042494099496/74666993c808a8dfaeac625d00c81f90.png?width=376&height=672";

var tv = new Image();
tv.onload = function () {
  second_floor_hallway_render.drawImage(tv, tv_x, tv_y);

  console.log(tv.width);
  console.log(tv.height);
}
tv.src = "https://media.discordapp.net/attachments/772064957793435678/776442739223035944/XQBbs7ZNN-hBBLvefxjumaNnCVhx7jGF5bLxsTEib4XWVtmoBqDzOlzw-7sJKC6IrhTt8Ee5LPGaKbf4p4o_1Tzn8uAeY9fNYsvp.png";

// Movement Controls and Camera Fix
function secondHallwayLeft () {
  console.log("LEFT");

  second_floor_hallway_render.clearRect(0, 0, second_floor_hallway.width, second_floor_hallway.height);

  bathroom_door_x = bathroom_door_x + 5.5;
  portal_x = portal_x + 5.5;
  radio_x = radio_x + 5.5;
  tv_x = tv_x + 5.5;

  second_floor_hallway_render.drawImage(hallway_two_floor, 0, 520);

  console.log(bathroom_door_x);
  console.log(portal_x);

  second_floor_hallway_render.drawImage(bathroom_door, bathroom_door_x, bathroom_door_y);

  second_floor_hallway_render.drawImage(portal, portal_x, portal_y);

  second_floor_hallway_render.drawImage(radio, radio_x, radio_y, 94, 168);

  second_floor_hallway_render.drawImage(tv, tv_x, tv_y);

  if (bathroom_door_x > 900) {
    bathroom_door_x = -800;
  }
  
  if (portal_x > 900) {
    portal_x = -800;
  }

  if (radio_x > 900) {
    radio_x = -800;
  }

  if (tv_x > 900) {
    tv_x = -800;
  }
}

function secondHallwayRight () {
  console.log("RIGHT");

  second_floor_hallway_render.clearRect(0, 0, second_floor_hallway.width, second_floor_hallway.height);

  bathroom_door_x = bathroom_door_x - 5.5;
  portal_x = portal_x - 5.5;
  radio_x = radio_x - 5.5;
  tv_x = tv_x - 5.5;

  second_floor_hallway_render.drawImage(hallway_two_floor, 0, 520);

  console.log(bathroom_door_x);
  console.log(portal_x);
  console.log(radio_x);

  second_floor_hallway_render.drawImage(bathroom_door, bathroom_door_x, bathroom_door_y);

  second_floor_hallway_render.drawImage(portal, portal_x, portal_y);

  second_floor_hallway_render.drawImage(radio, radio_x, radio_y, 94, 168);

  second_floor_hallway_render.drawImage(tv, tv_x, tv_y);

  if (bathroom_door_x < -900) {
    bathroom_door_x = 800;
  }
  
  if (portal_x < -900) {
    portal_x = 800;
  }

  if (radio_x < -900) {
    radio_x = 800;
  }

  if (tv_x < -900) {
    tv_x = 800;
  }
}

// Detect Keypresses
$(this).keypress(function (event) {
  if (screen === 6) {
    if (event.keyCode === 100) {
      secondHallwayRight();
    }

    else if (event.keyCode === 97) {
      secondHallwayLeft();
    }
  }
});