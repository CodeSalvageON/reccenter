// Script for the Pool

$("#pool-form").submit(function () {
  event.preventDefault();

  var pool_message = document.getElementById("text-pool").value;

  if (pool_message === null || pool_message === undefined || pool_message === '') {
    return false;
  } 

  const pool_data = {
    message : pool_message
  }

  fetch('https://reccenter.codesalvageon.repl.co/push_shit', {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(pool_data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  });

  document.getElementById("text-pool").value = "";
  location.href = "";
});

$("#refresh-pool").click(function () {
  location.href = "";
});