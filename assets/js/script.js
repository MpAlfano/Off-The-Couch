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

  
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude)
    console.log(longitude)
  });



//Selected Activity using serpstackAPI(uses google search)
//use res. "console.log ID"
//Grabbing from organic_results
//Search Button on click
  $('#saveSearch').on('click', function(e){
  e.preventDefault()
  var query = $("#searchQuery").val()  //Grabs value from searchQuery ID in HTML
  let activities = "activities"; //Adds "activities" to the search
  let queryA = query + activities; //What were actually searching
  var API_KEY = '93b9743008322f7aa1476f093145a2fb' //serpstackAPI KEY
  let result=''
  var url = 'http://api.serpstack.com/search?access_key='  + API_KEY + "&type=web&num=1&query=" +queryA
  console.log(url);
  $.get(url, function(data){
      $("#result").html('')
      console.log(data)
      data.organic_results.forEach(res => {
        //What will be displayed
          result =`
          <h3>${res.title}</h3><br><a target="_blank" href="${res.url}">${res.url}</a>
          <p>${res.snippet}</p>
          `
          //Appends to #result in HTML
          $("#result").append(result)
      });
  });
});



// Random activity using BoredAPI
// use data."console.log ID"
let boredUrl = "https://www.boredapi.com/api/activity/"

//Random button on click
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
      //What will be displayed
      resultRandom = `<h3>${data.activity}</h3><p><a target="_blank" href="${data.link}">${data.link}</a></p>`

      //Displays in #result in HTML
      document.getElementById("result").innerHTML = resultRandom;
      
});
});
