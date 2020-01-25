

$(document).ready(function () {

  //sets local storage
  let emptyArray = [];
  if(localStorage.getItem('saved-docs') == undefined) {
    localStorage.setItem('saved-docs', JSON.stringify(emptyArray));
  }
  //creates an array of favorite doctors from local storage
  let favDocs = JSON.parse(localStorage.getItem('saved-docs'));

  //api key for better doctor
  let apiKey = "a078e4d5730633652f2fb1b76ce96dca";

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
    //Replacing the white spaces with '-'  for Speciality input entered by the user and changing the input to lowercase
    let specialtyInput =$("#specialty-input").val().trim().replace(/ /g, "-").toLowerCase();
    let cityInput = searchLat + "," + searchLon + ",10";
    let queryURL = `https://api.betterdoctor.com/2016-03-01/doctors?specialty_uid=${specialtyInput}&location=${cityInput}&skip=2&sort=distance-asc&limit=10&user_key=${apiKey}`;
    let t=0;

    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {


        //alert user if no results are found
        if(response.data.length == 0) {
          $('.home-page').show();
          $('.doctor-results').css('display', 'none');
          $('#no-results').text('No results found, please try again');
        }

        for (let i = 0; i < response.data.length; i++) {
          let results = response.data[i];
          let newDocName = $('<h3 class="row header" id="docHeader">').text(`${results.profile["first_name"]} ${results.profile["last_name"]}, MD`);
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
          
          let docSpec = $('<p class="doc-info">').html('<b>Specialty: </b>' + results.specialties[0].uid);
          let docClinic = $('<p class="doc-info">').html('<b>Clinic: </b>' + results.practices[t].name);
          let docLat = results.practices[t].lat;
          let docLon = results.practices[t].lon;
          let docCity = results.practices[t].visit_address.city;
          let docStreet = results.practices[t].visit_address.street;
          let docState = results.practices[t].visit_address.state;
          let docZip = results.practices[t].visit_address.zip;
          let docAddress = $('<p class="doc-info">').html(`<b>Address:</b> ${docStreet}, ${docCity} ${docState} ${docZip}`);
          let docNum = $('<p class="doc-info">').html(`<b>Phone number: </b>${results.practices[t].phones[0].number}`);
          let docDescription = $('<p class="doc-info">').html(`<b>Description: </b>${results.profile.bio}`);
          let saveBtn = $('<button class="btn waves-effect waves-light">').text('Save to favorites');
          saveBtn.attr('id', 'save-doc');
          saveBtn.attr('class', 'align-center');
          saveBtn.attr('data-name', `${results.profile["first_name"]} ${results.profile["last_name"]}`);
          $(saveBtn).on('click', function() {
            favDocs.push([saveBtn.attr('data-name'), results.practices[0].phones[0].number, results.practices[0].name]);
            localStorage.setItem('saved-docs', JSON.stringify(favDocs));
            console.log(favDocs);
          })
          
          let mapID = 'map' + i;
          let mapDiv = $("<div>").css({ 'width': '100%', 'height': '25rem', 'display': 'none' }).attr('id', mapID);
          let mapBtn = $('<button type="submit" id = "map-btn" class="center-align">').data({ 'latitude': docLat, 'longitude': docLon, 'map-id': mapID }).text('Show Map');
          mapBtn.on('click', openGoogleMap);
          let docContainer = $('<div class = "resultDiv">').attr("id", "div"+i);
          $('.doctor-results').append(newDocName,docContainer);
          $('#div'+i).append(docSpec, docDescription, docClinic, docAddress, docNum, mapBtn, saveBtn, mapDiv);

        }
        // function to open Google map for the latitude and longitude from API response. 
        openGoogleMap(docLon, docLat);
      });

  }

  function removeAndReplaceWhiteSpaces(specialityInput)
  {
    var newStr = specialityInput.replace(/ /g, "-");

  }

  //initialize() creates map and marker objects and returns them.
  function initialize(latitude, longitude, map_id) {
    var myLatLang = { lat: latitude, lng: longitude };
    var _map = new google.maps.Map(document.querySelector(map_id), { zoom: 15, center: myLatLang });


    var marker = new google.maps.Marker({ position: myLatLang, map: _map });
    return marker;
  }

  //fuction openGoogleMap() takes longitude and latitude as its parameters and creates map and markers by calling initialize() method.
  function openGoogleMap(event) {
    event.preventDefault();
    var map_id = "#" + $(this).data("map-id");
    if ($(map_id).css("display") === "none") {
      $(map_id).css("display", "block");
      var lat = $(this).data("latitude");
      var lon = $(this).data("longitude");
      var map = initialize(lat, lon, map_id);
      google.maps.event.trigger(map, "resize");
      $(this).text("Hide Map");
    }
    else {
      $(map_id).css("display", "none");
      $(this).text("Show Map");
    }
  }

  $(submitBtn).on("click", geocode);
  var isDown=true;
  $('.doctor-results').on("click","h3", function(e) {
      if(isDown){
        $(this).next().slideUp(1000);
        isDown=false;
      }else
      {
        $(this).next().slideDown(1000);
        isDown=true;
      }
  
  });
});