let API_KEY = 'c9aaaf57c53375e190a23dba011625bc' //serpstackAPI KEY
let searchList = "";
let searchListUrl = "";
//Date and time
let date = null;
let datetimeP1 = null;
let datetimeP2 = null;


//Date formats, first is day/month/year
let update = function () {
  date = moment(new Date())
  datetimeP1.html(date.format('dddd, MMM Do, YY'));
  //current time
  datetimeP2.html(date.format('h:mm a'));
};

//Time updater, updates every 1sec
$(document).ready(function () {
  datetimeP1 = $('#datetime-p1')
  datetimeP2 = $('#datetime-p2')
  update();
  setInterval(update, 1000);
});

// Opens Modal on click of "search topic" button
$(document).ready(function () {
  $("#modBtn").click(function () {
    $("#searchAct").modal();
  });
});

// Closes modal on click of "search" button
$('#saveSearch').click(function (e) {
  e.preventDefault();
  $('#searchAct').modal('toggle');
  return false;
});

//Restaurant search Button on click
$('#restaurantSearch').on('click', function (e) {
  e.preventDefault()
  e.stopImmediatePropagation()
  searchQuery(searchCity)
  //choices for retaurant
  let foodType = ["hibachi", "italian", "seafood", "pizza", "sushi", "burger", "steak", "indian", "thai", "greek", "mediterranean", "jamaican", "bbq"];
  let result = ''

  x = Math.floor(Math.random() * 12)
  y = Math.floor(Math.random() * 3)
  console.log(x)
  queryA = foodType[x] + "+" + "retaurant" + "+" + searchCity
  let url = 'https://cors-anywhere.herokuapp.com/http://api.serpstack.com/search?access_key=' + API_KEY + "&type=web&num=1&google_domain=google.ca" + "&query=" + queryA
  console.log(url);
  displayLoading()
  $.get(url, function (data) {
    $("#result").html('')
    console.log(data)
    console.log(data.local_results[y].title)
    searchList = data.local_results[y].title
    searchListUrl = `https://www.google.ca/search?q=${searchList}`

    //What will be hideed
    result = `
        <h3>${data.local_results[y].title}</h3><br><a target="_blank" href="https://www.google.com/search?q=${data.local_results[y].title}">Search ${data.local_results[y].title} on Google</a>
        <p>${data.local_results[y].address}</p>
          `
    $("#result").append(result)

    //Appends to #result in HTML
    hideLoading()
    updateSearch(searchList, searchListUrl)
  });
  return;
});

//search function for drop down option selected
function searchQuery(searchCity) {

  $('#saveSearch').on('click', function (e) {
    e.preventDefault()
    e.stopImmediatePropagation()
    let query = $("#searchQuery").find(":selected").attr("id")  //Grabs value from searchQuery ID in HTML
    let queryA = query + '+' + searchCity; //What were actually searching
    let result = ''

    let url = 'https://cors-anywhere.herokuapp.com/http://api.serpstack.com/search?access_key=' + API_KEY + "&type=web&num=1&google_domain=google.ca" + "&query=" + queryA
    console.log(url);
    displayLoading()
    $.get(url, function (data) {
      $("#result").html('')
      console.log(data)
      console.log(queryA)
      console.log(data.organic_results[0])
      hideLoading()
      //If no organic results then take local result
      if (data.organic_results[0] == undefined) {
        searchList = data.local_results[0].title
        searchListUrl = `https://www.google.ca/search?q=${searchList}`
        console.log(searchListUrl)
        result = `
        <h3>${data.local_results[0].title}</h3><br><a target="_blank" href="https://www.google.com/search?q=${data.local_results[0].title}">Search ${data.local_results[0].title} on Google</a>
        <p>${data.local_results[0].address}</p>
          `
        $("#result").append(result)
        updateSearch(searchList, searchListUrl)
        console.log(result)
      } else {
        searchList = data.organic_results[0].title
        searchListUrl = data.organic_results[0].url
        data.organic_results.forEach(res => {
          //What will be hideed
          result = `
            <h3>${res.title}</h3><br><a target="_blank" href="${res.url}">${res.url}</a>
            <p>${res.snippet}</p>
            `;
          //Appends to #result in HTML
          hideLoading()
          updateSearch(searchList)
          $("#result").append(result)
        });
      }
    });
  });
}
// Random activity using BoredAPI
let boredUrl = "https://www.boredapi.com/api/activity/"
//Random button on click
$('#randomQ').on('click', function (e) {
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
      //What will be hideed
      resultRandom = data.activity
      let randomQuery = resultRandom + "+" + searchCity
      searchRandom(resultRandom, randomQuery)
    });
});

//Grabs activity from bored api, grabs location from mapquest api, then searches using serpstack api
function searchRandom(resultRandom, randomQuery) {
  let url = 'https://cors-anywhere.herokuapp.com/http://api.serpstack.com/search?access_key=' + API_KEY + "&type=web&num=1&google_domain=google.ca" + "&query=" + randomQuery
  console.log(url);

  displayLoading()
  $.get(url, function (data) {
    $("#result").html('')

    //If no organic results then take local result
    if (data.organic_results[0] == undefined) {
      searchList = data.local_results[0].title
      searchListUrl = `https://www.google.ca/search?q=${searchList}`
      console.log(searchListUrl)
      result = `
      <h3>${data.local_results[0].title}</h3><br><a target="_blank" href="https://www.google.com/search?q=${data.local_results[0].title}">Search ${data.local_results[0].title} on Google</a>
      <p>${data.local_results[0].address}</p>
        `
      $("#result").append(result)
      
      updateSearch(searchList, searchListUrl)
      console.log(result)
    } else {
      console.log(resultRandom)
      console.log(data.organic_results[0].url)
      dataOrg = data.organic_results;
      searchListUrl = data.organic_results[0].url
      description = data.knowledge_graph
      searchList = data.organic_results
      data.organic_results.forEach(res => {
        //What will be hideed
        result = `
            <h3>${resultRandom}</h3><br><a target="_blank" href="${res.url}">${res.url}</a>
            <p>${res.title}</p>
            `
        hideLoading()
        updateSearch(resultRandom, searchListUrl)
        $("#result").append(result)
      });
    }
  });
}

//Mapquest api to fetch location based off geoLocation, only works if user clicks allow. 
let fetchLocationName = (position) => {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  console.log(lat)
  console.log(lng)

  fetch(
    'https://www.mapquestapi.com/geocoding/v1/reverse?key=PRZUpttP0TCp8zsRVAIyHZz7mpmjIupR&location=' + lat + '%2C' + lng + '&outFormat=json&thumbMaps=false',
  )
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      console.log(responseJson.results[0].locations[0])
      console.log(responseJson.results[0].locations[0].adminArea5)
      console.log(
        'ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson),
        searchCity = responseJson.results[0].locations[0].adminArea5 + "+" + responseJson.results[0].locations[0].adminArea3 + "+" + responseJson.results[0].locations[0].adminArea1
      );
      searchQuery(searchCity)
    });
};

//hides while api loads data
let loader = document.querySelector("#loading");
let loaderText = document.querySelector("#load-text");

//hide Loading
function displayLoading() {
  loader.classList.add("hide");
  loaderText.classList.add("hide");

  //Stops loader after 5 seconds
  setTimeout(() => {
    loader.classList.remove("hide");
    loaderText.classList.remove("hide");
  }, 10000);
}

//Hiding Loading icon on start
function hideLoading() {
  loader.classList.remove("hide");
  loaderText.classList.remove("hide");
}

// Geolocation denied
navigator.geolocation.getCurrentPosition(function (position) {
  console.log("allowed");
  fetchLocationName(position)
},
  function (error) {
    if (error.code == error.PERMISSION_DENIED)
      console.log("denied");
    result = `
     <h3>For Off The Couch to work, please allow location.</h3>
     `
    //Appends to #denied in HTML
    $("#denied").append(result)
  });

let searchListSave = [];
let searchListUrlSave = [];

function updateSearch(searchList) {  //saves search to localstorage
  searchListSave.unshift(searchList)
  searchListUrlSave.unshift(searchListUrl)
  if (searchListSave.length && searchListUrlSave.length > 5) {
    searchListSave.pop(); // removes the first element from an array 
    searchListUrlSave.pop();
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
  if (!searchListSave || !searchListUrlSave) {  //check to see if the letiable exists
    console.log("- No saved information"); //prints error message in console
    searchListSave = [];
    searchListUrlSave = [];
    return searchListSave;
  }
  return showSearchList();
}

let cityListEl = document.getElementById("cityListGroup");
function showSearchList() {  //hides the list of cities chosen in the past
  cityListEl.innerHTML = "";
  for (let i = 0; i < searchListSave.length; i++) {

    let li = document.createElement('a');
    let linkText = document.createTextNode(searchListSave[i]);
    li.appendChild(linkText);
    li.setAttribute("class", "oldCity")
    li.target = "_blank ";
    li.href = searchListUrlSave[i];
    $("#cityListGroup").append(li);
  }
}
// Runs this function on page load

init();

