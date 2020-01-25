

$(document).ready(function () {

  //$(".doctor-results").hide();

  let apiKey = "6563c971fde154633b460f1d293994c2";
  let submitBtn = $("#submit-input");

  function geocode() {
    let cityInput = $("#city-input").val().trim();
    let geocodeURL = `https://us1.locationiq.com/v1/search.php?key=ccf3e521e0553a&q=${cityInput}&format=json`
    $.ajax({
      url: geocodeURL,
      method: "GET"
    })
    .then(function (response) {
      console.log(response);
      let searchLatString = response[0].lat;
      let searchLonString = response[0].lon;
      let searchLat = parseFloat(searchLatString).toFixed(3);
      let searchLon = parseFloat(searchLonString).toFixed(3);
      
      
      doctorSearch(searchLat, searchLon);
      console.log(searchLat + "," + searchLon);
    })
    
  }
  
  
  
  
  function doctorSearch(searchLat, searchLon) {
    /******Madhavi's changes start */

    //display : none for home-page to show doctor's info on button click
    $(".home-page").css("display", "none");
    $(".doctor-results").show();

    /******Madhavi's changes end */
    let specialtyInput = $("#specialty-input").val().trim();

    let cityInput = searchLat + "," + searchLon + ",10";
    let queryURL = `https://api.betterdoctor.com/2016-03-01/doctors?specialty_uid=${specialtyInput}&location=${cityInput}&skip=2&sort=distance-asc&limit=10&user_key=${apiKey}`;
    let t=0;

    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {

        //if no results are found
        if(response.data.length == 0) {
          $('.home-page').show();
          $('.doctor-results').css('display', 'none');
          $('#no-results').text('No results found, please try again');
        }

        for(let i=0; i<response.data.length; i++) {
          let results = response.data[i];
          console.log(results);
          for (let i=0; i<results.practices.length; i++) {
            console.log(results.practices[i].visit_address.zip);
            if (results.practices[i].within_search_area== true) {
              t= i;
              console.log(t);
              break;
            }
            else {
              t=0;
            }
          }
          let newDocName = $('<h3 class="row header">').text(results.profile["first_name"] + ' ' + results.profile["last_name"]);
          let docSpec = $('<p class="doc-info">').text('Specialty: ' + results.specialties[0].uid);
          let docClinic = $('<p class="doc-info">').text('Clinic: ' + results.practices[t].name);
          let docLat = results.practices[t].lat;
          let docLon = results.practices[t].lon;
          let docCity = results.practices[t].visit_address.city;
          let docStreet = results.practices[t].visit_address.street;
          let docState = results.practices[t].visit_address.state;
          let docZip = results.practices[t].visit_address.zip;
          let docAddress = $('<p class="doc-info">').text(`Address: ${docStreet}, ${docCity} ${docState} ${docZip}`);
          let docNum = $('<p class="doc-info">').text(`Phone number: ${results.practices[t].phones[0].number}`);
          let docDescription = $('<p class="doc-info">').text(`Description: ${results.profile.bio}`);
          $('.doctor-results').append(newDocName, docSpec, docDescription, docClinic, docAddress, docNum);
        }

        // function to open Google map for the latitude and longitude from API response. 
        openGoogleMap(docLon, docLat);
      });

  }

  //initialize() creates map and marker objects and returns them.
  function initialize(latitude, longitude) {

    console.log("type of latitude " + latitude);
    console.log("type of latitude " + longitude);

    var myLatLang = { lat: latitude, lng: longitude };
    var _map = new google.maps.Map(document.getElementById("show-map"), { zoom: 15, center: myLatLang });

    var marker = new google.maps.Marker({ position: myLatLang, map: _map });

    return marker;
  }

  //fuction openGoogleMap() takes longitude and latitude as its parameters and creates map and markers by calling initialize() method.
  function openGoogleMap(loc_longitude, loc_latitude) {
    // event.preventDefault();
    $("#show-map").css("display", "block");
    var map = initialize(loc_latitude, loc_longitude);
    google.maps.event.trigger(map, "resize");
  }


  $(submitBtn).on("click", geocode);
});