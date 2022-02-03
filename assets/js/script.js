var API_KEY = 'd61824ced86a8c06bbc1a701c59c52f4' //serpstackAPI KEY
var searchList = "";
var searchListUrl = "";
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
  $('#saveSearch').on('click', function (e) {
    e.preventDefault()
    let foodType = ["hibachi", "italian", "seafood", "pizza", "sushi", "burger", "steak", "mexican", "indian"]; //choices for retaurant
    var query = $("#searchQuery").find(":selected").attr("id")  //Grabs value from searchQuery ID in HTML
    // let activities = "+" + "activities"; // " " + latitude+ " " +longitude; //Adds "activities" to the search
    let queryA = query + activities + '+' + searchCity; //What were actually searching
    let result = ''
    let x = "";
    if (query === "Restaurant") { //restaurant is selected we give it a descriptor
      x = Math.floor(Math.random() * 9)
      console.log(x)
      queryA = foodType[x] + "+" + query + "+" + searchCity
      var url = 'http://api.serpstack.com/search?access_key=' + API_KEY + "&type=web&num=1&google_domain=google.ca" + "&query=" + queryA
      console.log(url);
      displayLoading()
      $.get(url, function (data) {
        $("#result").html('')
        console.log(data)
        console.log(queryA)
        console.log(data.local_results[0].title)
        searchList = data.local_results[0].title
        searchListUrl = `https://www.google.ca/search?q=${searchList}`
      //What will be displayed
          result = `
        <h3>${data.local_results[0].title}</h3><br><a target="_blank" href="https://www.google.com/search?q=${data.local_results[0].title}">Search ${data.local_results[0].title} on Google</a>
        <p>${data.local_results[0].address}</p>
          `
          $("#result").append(result)
        
                  //Appends to #result in HTML
                  hideLoading()
                  updateSearch(searchList, searchListUrl)
                  console.log(result)
      });
    } else {
      var url = 'http://api.serpstack.com/search?access_key=' + API_KEY + "&type=web&num=1&google_domain=google.ca" + "&query=" + queryA
      console.log(url);
      displayLoading()
      $.get(url, function (data) {
        $("#result").html('')
        console.log(data)
        console.log(queryA)
        console.log(data.organic_results[0].title)
        searchList = data.organic_results[0].title
        searchListUrl = data.organic_results[0].url
        // searchListUrl = data.organic_results.url
        data.organic_results.forEach(res => {
          //What will be displayed
          result = `
          <h3>${res.title}</h3><br><a target="_blank" href="${res.url}">${res.url}</a>
          <p>${res.snippet}</p>
          `;
          //Appends to #result in HTML
          hideLoading()
          updateSearch(searchList)
          $("#result").append(result)
          
        });
      });
    }
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
  displayLoading()
  $.get(url, function(data){
      $("#result").html('')
      console.log(resultRandom)
      console.log(data.organic_results[0].url)
      dataOrg = data.organic_results;
      searchListUrl = data.organic_results[0].url
      console.log(searchListUrl)
      description = data.knowledge_graph
      searchList = data.organic_results
      data.organic_results.forEach(res => {
        //What will be displayed
          result =`
          <h3>${resultRandom}</h3><br><a target="_blank" href="${res.url}">${res.url}</a>
          <p>${res.title}</p>
          `
          //Appends to #result in HTML
          hideLoading()
          updateSearch(resultRandom, searchListUrl)
          $("#result").append(result)
          
      });
  });
}
//Mapquest api to fetch location based off geoLocation, only works if user clicks allow. 
const fetchLocationName =  (position) => {
  
    
    
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
        searchCity = responseJson.results[0].locations[0].adminArea5 + "+" + responseJson.results[0].locations[0].adminArea3
        
      );
      searchQuery(searchCity)
    });
};
// Runs this function on page load
// fetchLocationName()
//DIsplays while api loads data
const loader = document.querySelector("#loading");
const loaderText = document.querySelector("#load-text");
//Display Loading
function displayLoading() {
  loader.classList.add("display");
  loaderText.classList.add("display");
  //Stops loader after 5 seconds
  setTimeout(() => {
      loader.classList.remove("display");
      loaderText.classList.remove("display");
  }, 10000);
}
//Hiding Loading 
function hideLoading() {
  loader.classList.remove("display");
  loaderText.classList.remove("display");
}
// Geolocation denied
navigator.geolocation.getCurrentPosition(function(position) {
  console.log("allowed");
  fetchLocationName(position)
},
function(error) {
  if (error.code == error.PERMISSION_DENIED)
    console.log("denied");
     //What will be displayed
     result =`
     <h3>For Off The Couch to work, please allow location.</h3>
     `
     //Appends to #denied in HTML
     $("#denied").append(result)
});
var searchListSave = [];
var searchListUrlSave = [];
function updateSearch(searchList) {  //saves search to localstorage
  searchListSave.unshift(searchList)
  searchListUrlSave.unshift(searchListUrl)
  if (searchListSave.length && searchListUrlSave.length > 5) {
    searchListSave.pop(); // removes the first element from an array 
}
  console.log(searchList)
  console.log(searchListSave)
  console.log(searchListUrlSave)
  localStorage.setItem("searchListSave", JSON.stringify(searchListSave)); //saves searchList
  localStorage.setItem("searchListUrlSave", JSON.stringify(searchListUrlSave)); //saves searchList
  console.log(searchList + searchListUrl)
  return showSearchList(searchList, searchListUrl);
}
function init() {  //function to load the text from memory
  searchListSave = JSON.parse(localStorage.getItem("searchListSave"));
  searchListUrlSave = JSON.parse(localStorage.getItem("searchListUrlSave"));
  console.log(searchListSave)
  console.log(searchListUrlSave)
  if (!searchListSave || !searchListUrlSave ) {  //check to see if the variable exists
    console.log("- No saved information"); //prints error message in console
    searchListSave = [];
    searchListUrlSave = [];
    return searchListSave;
  }
    return showSearchList();
    
  }
  let cityListEl = document.getElementById("cityListGroup");
  function showSearchList() {  //displays the list of cities chosen in the past
    var varText = "";
    cityListEl.innerHTML = "";
    for (var i = 0; i < searchListSave.length; i++) {
 
      var li = document.createElement('a');
      var linkText = document.createTextNode(searchListSave[i]);
      li.appendChild(linkText);
      li.setAttribute("class", "oldCity")
      li.title = "";
      li.href = searchListUrlSave[i];
      $("#cityListGroup").append(li);
    }
      
  }
init()
