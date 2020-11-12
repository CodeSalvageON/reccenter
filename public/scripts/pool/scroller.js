/* Automatically scroll to the bottom of the messages */

$(document).ready(function () {
  $('html, body').scrollTop($(document).height());
  window.scrollTo(0, document.body.scrollHeight);
  
  var scrollingElement = (document.scrollingElement || document.body);

  scrollingElement.scrollTop = scrollingElement.scrollHeight;
});