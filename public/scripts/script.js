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

// Handle button clicks
$("#new-member-button").click(function () {
  $("#first-page").hide();

  $("#new-member-page1").show();
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
}

function returnToMainScreen () {
  hideAll();

  $("#first-page").show();
}