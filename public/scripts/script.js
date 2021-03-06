// Script for handling button clicks and setting defaults

// Screen variable for other scripts
var screen = 1;

// Set default screen viewing
$("#new-member-page1").hide();
$("#new-member-page2").hide();
$("#new-member-page3").hide();
$("#new-member-page4").hide();
$("#new-member-page5").hide();

$("#main").hide();
$("#games").hide();
$("#plory").hide();
$("#door-1").hide();
$("#pool").hide();
$("#stairwell").hide();
$("#jail-cell").hide();
$("#second-floor-hallway").hide();
$("#bathroom").hide();
$("#jukebox").hide();
$("#tv").hide();

// Handle button clicks
$("#new-member-button").click(function () {
  $("#first-page").hide();

  $("#new-member-page1").show();
});

$("#returning-member-button").click(function () {
  $("#first-page").hide();

  screen = 2;

  $("#main").slideDown();
});

// Functions for other scripts 
function hideAll () {
  $("#new-member-page1").hide();
  $("#new-member-page2").hide();
  $("#new-member-page3").hide();
  $("#new-member-page4").hide();
  $("#new-member-page5").hide();

  $("#main").hide();
  $("#games").hide();
  $("#galaxy-sprint").hide();
  $("#wizard-pinball").hide();
  $("#dig-site").hide();
  $("#plory").hide();
  $("#door-1").hide();
  $("#pool").hide();
  $("#stairwell").hide();
  $("#jail-cell").hide();
  $("#second-floor-hallway").hide();
  $("#bathroom").hide();
  $("#jukebox").hide();
  $("#tv").hide();
}

function returnToMainScreen () {
  hideAll();

  $("#first-page").slideDown();
}

function returnToMainRoom () {
  hideAll();

  $("#main").slideDown();
}

function returnToFirstFloorHallway () {
  hideAll();

  $("#door-1").slideDown();
}

function returnToStairWell () {
  hideAll();

  $("#stairwell").slideDown();
}

function returnToSecondFloorHallway () {
  hideAll();

  $("#second-floor-hallway").slideDown();
}