// Script for debuging the scroller issue

$(document).ready(function () {
  let pool_iframe = $("#pool-iframe");
  let bathroom_iframe = $("#bathroom-iframe");

  let pool_refresh_button = pool_iframe.contents().find('#refresh-pool');
  let bathroom_refresh_button = bathroom_iframe.contents().find('#refresh-pool');

  document.getElementById('pool-iframe').contentWindow.location.reload();
  document.getElementById('bathroom-iframe').contentWindow.location.reload();

  pool_refresh_button.trigger("click");
  bathroom_refresh_button.trigger("click");

  console.log("Debug in progress");
});