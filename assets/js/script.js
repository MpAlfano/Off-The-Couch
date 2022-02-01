let apiKey = "4351effe40295aa6c5165a4f79c80fdd";
var searchVal = document.querySelector('#searchQuery'); //search input
let searchRender = document.querySelector('#saveSearch') // search button in modal
let searchChoice = ""
let resultVal = document.querySelector('#results') // testing result

navigator.geolocation.getCurrentPosition((position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude)
    console.log(longitude)
  });


let searchActivity = function() {
    console.log(searchChoice)
    let apiUrl = "http://api.serpstack.com/search?access_key=" + apiKey + "&query=" + searchChoice

    fetch(apiUrl)

        .then(function (response) {

            if (!response.ok) {
                throw new Error('Network response not OK')
            }
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            console.log(data.organic_results[0].title)
            resultVal.textContent = data.organic_results[0].title
        })

}   // Make a forEach to produce and attach results maybe?



searchRender.addEventListener("click", function (event) {
    event.preventDefault

    $('#searchAct').modal('toggle')
    searchChoice = searchVal.value

    searchActivity()
})
