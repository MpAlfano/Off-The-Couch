// Opens Modal on click of "search topic" button
$(document).ready(function(){
    $("#modBtn").click(function(){
      $("#searchAct").modal();
    });
  });
  
  
  // Closes modal on click of "search" button
  $('#saveSearch').click(function(e) {
    e.preventDefault();
    $('#searchAct').modal('toggle');
    return false;
  });





//Selected Activity using serpstackAPI(uses google search)
  $('#saveSearch').on('click', function(e){
  e.preventDefault()
  var query = $("#searchQuery").val()
  let nearMe = "activities";
  let queryA = query + nearMe;
  var API_KEY = '93b9743008322f7aa1476f093145a2fb'
  let result=''
  var url = 'http://api.serpstack.com/search?access_key='  + API_KEY + "&type=web&num=1&query=" +queryA
  console.log(url);
  $.get(url, function(data){
      $("#result").html('')
      console.log(data)
      data.organic_results.forEach(res => {
          result =`
          <h1>${res.title}</h1><br><a target="_blank" href="${res.url}">${res.url}</a>
          <p>${res.snippet}</p>
          `
          $("#result").append(result)
      });
  });
});



// Random activity using BoredAPI
let boredUrl = "https://www.boredapi.com/api/activity/"

$('#randomQ').on('click', function(e){
  e.preventDefault()
  fetch(boredUrl)
    .then(function (response) {
      console.log(response);
      if (!response.ok) {
        throw response.json();
      }
      console.log(response.json);
      return response.json();

    })
    .then(function (data) {
      console.log(data);
      resultRandom = `<p>${data.activity}</p><p><a target="_blank" href="${data.link}">${data.link}</a></p>`
      document.getElementById("result").innerHTML = resultRandom;
      
});
});
