var API_KEY = '2b8d450902150d2d261c0e097158851e' //serpstackAPI KEY

//Date and time
var datetimeP1 = null,
        date = null;
var datetimeP2 = null,
    date = null;

//Date formats, first is day/month/year
var update = function () {
    date = moment(new Date())
    datetimeP1.html(date.format('dddd, MMM Do, YY'));
    //current time
    datetimeP2.html(date.format('h:mm a'));
};
//Time updater, updates every 1sec
$(document).ready(function(){
    datetimeP1 = $('#datetime-p1')
    datetimeP2 = $('#datetime-p2')
    update();
    setInterval(update, 1000);
});


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
//use res. "console.log ID"
//Grabbing from organic_results
//Search Button on click
function searchQuery(searchCity) {
  $('#saveSearch').on('click', function(e){
  e.preventDefault()

  var query = $("#searchQuery").val()  //Grabs value from searchQuery ID in HTML
  let activities = "+" + "activities"; // " " + latitude+ " " +longitude; //Adds "activities" to the search
  let queryA = query + activities + '+' + searchCity; //What were actually searching

  let result=''

  var url = 'http://api.serpstack.com/search?access_key='  + API_KEY+"&type=web&num=1&google_domain=google.ca"+"&query=" +queryA
  console.log(url);
  $.get(url, function(data){
      $("#result").html('')
      console.log(data)
      console.log(queryA)
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
}



// Random activity using BoredAPI
// use data."console.log ID"
let boredUrl = "https://www.boredapi.com/api/activity/"

//Random button on click
$('#randomQ').on('click', function(e){
  e.preventDefault()
  searchQuery(searchCity)
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
      resultRandom = data.activity
      var randomQuery = resultRandom +"+"+ searchCity
      searchRandom(resultRandom, randomQuery)

});
});


//Grabs activity from bored api, grabs location from mapquest api, then searches using serpstack api
function searchRandom(resultRandom, randomQuery) {
  var url = 'http://api.serpstack.com/search?access_key='  + API_KEY+"&type=web&num=1&google_domain=google.ca"+"&query=" +randomQuery
  console.log(url);
  $.get(url, function(data){
      $("#result").html('')
      console.log(resultRandom)
      console.log(data)
      description = data.knowledge_graph
      data.organic_results.forEach(res => {
        //What will be displayed
          result =`
          <h3>${resultRandom}</h3><br><a target="_blank" href="${res.url}">${res.url}</a>
          <p>${res.title}</p>
          `
          //Appends to #result in HTML
          $("#result").append(result)
      });
  });

}

//Mapquest api to fetch location based off geoLocation, only works if user clicks allow. 
const fetchLocationName =  (lat,lng) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat  = position.coords.latitude;
    const lng = position.coords.longitude;
    console.log(lat)
    console.log(lng)
 
   fetch(
    'https://www.mapquestapi.com/geocoding/v1/reverse?key=PRZUpttP0TCp8zsRVAIyHZz7mpmjIupR&location='+lat+'%2C'+lng+'&outFormat=json&thumbMaps=false',
  )
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      console.log(responseJson.results[0].locations[0])
      console.log(responseJson.results[0].locations[0].adminArea5)
      console.log(
        'ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson),
        searchCity = responseJson.results[0].locations[0].adminArea5
        
        
      );
      searchQuery(searchCity)
    });
  });
};

// Runs this function on page load
fetchLocationName()