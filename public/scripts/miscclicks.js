// Script for handling clicks outside of buttons.

$("#rec-outside-1").click(function () {
  $("#new-member-page1").hide();

  $("#new-member-page2").show();
});

$("#rec-storyline-1").click(function () {
  $("#new-member-page2").hide();

  $("#new-member-page3").show();
});

$("#rec-storyline-2").click(function () {
  $("#new-member-page3").hide();

  $("#new-member-page4").show();
});

$("#rec-storyline-3").click(function () {
  $("#new-member-page4").hide();

  $("#new-member-page5").show();
});

$("#rec-storyline-4").click(function () {
  $("#new-member-page5").slideUp();

  $("#main").slideDown();
  screen = 2;
});


$("#galaxy-sprint-button").click(function () {
  window.open("https://cdn.i-ready.com/instruction/reward-games/master/49/game-lanerunner/");
});

$("#wizard-pinball-button").click(function () {
  window.open("https://cdn.i-ready.com/instruction/reward-games/master/49/game-bubbles/");
});

$("#dig-site-button").click(function () {
  window.open("https://cdn.i-ready.com/instruction/reward-games/master/49/game-minedigger/");
});

$("#stair-link").click(function () {
  $("#stairwell").slideUp();

  screen = 6;
  $("#second-floor-hallway").slideDown();
});