

$(document).ready(function () {

  $(".doctor-results").hide();

  let apiKey = "236ad2959b8fdc4ea0843819d69ef3ab";
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
    console.log(specialtyInput);
    let cityInput = searchLat + "," + searchLon + ",100";
    let queryURL = `https://api.betterdoctor.com/2016-03-01/doctors?specialty_uid=${specialtyInput}&location=${cityInput}&skip=2&limit=10&user_key=${apiKey}`;
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {

        console.log(response.data.length);

        if(response.data.length == 0) {
          alert('no results');
        }

        for(let i=0; i<response.data.length; i++) {
          let results = response.data[i];
          console.log(results);
          let newDocName = $('<h3 class="row header">').text(results.profile["first_name"] + ' ' + results.profile["last_name"]);
          let docSpec = $('<p class="doc-info">').text('Specialty: ' + results.specialties[0].uid);
          let docClinic = $('<p class="doc-info">').text('Clinic: ' + results.practices[0].name);
          let docLat = results.practices[0].lat;
          let docLon = results.practices[0].lon;
          let docCity = results.practices[0].visit_address.city;
          let docStreet = results.practices[0].visit_address.street;
          let docState = results.practices[0].visit_address.state;
          let docZip = results.practices[0].visit_address.zip;
          let docAddress = $('<p class="doc-info">').text(`Address: ${docStreet}, ${docCity} ${docState} ${docZip}`);
          let docNum = $('<p class="doc-info">').text(`Phone number: ${results.practices[0].phones[0].number}`);
          let docDescription = $('<p class="doc-info">').text(`Description: ${results.profile.bio}`);
          $('.doctor-results').append(newDocName, docSpec, docDescription, docClinic, docAddress, docNum);
        }
        // console.log(response);
        // console.log(response.data.length);


        // function to open Google map for the latitude and longitude from API response. 
        openGoogleMap(docLon, docLat);
      });

  }

  //initialize() creates map and marker objects and returns them.
  function initialize(latitude, longitude) {

    console.log("type of latitude " + latitude);
    console.log("type of latitude " + longitude);

    var myLatLang = { lat: latitude, lng: longitude };
    var _map = new google.maps.Map(document.getElementById("show-map"), { zoom: 5, center: myLatLang });

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