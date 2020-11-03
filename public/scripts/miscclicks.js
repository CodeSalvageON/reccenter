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
});


$("#galaxy-sprint-button").click(function () {
  document.getElementById("galaxy-sprint").innerHTML = '';
});