

$(document).ready(function () {
 $('.sidenav').sidenav(); //to initialize the side navbar fro small screens
  $("#city-input").prop('required', true);
  $('.favorites-div').hide();
  let pageFlag = "home";
  let emptyArray = [];

  //set local storage to empty array if local storage is not set yet
  if(localStorage.getItem('saved-docs') == undefined) {
    localStorage.setItem('saved-docs', JSON.stringify(emptyArray));
  }
  //creates an array of favorite doctors from local storage
  let favDocs = JSON.parse(localStorage.getItem('saved-docs'));

  //api key for better doctor
  let apiKey = "4836f1a91cac93b26276e955530879b9";

function start(event){
  if($("#city-input").val() !== ""){
  event.preventDefault();
  geocode();
}}

  function geocode() {
    let cityInput = $("#city-input").val().trim();
    let geocodeURL = `https://us1.locationiq.com/v1/search.php?key=pk.8677e62e98d340a2e38665f0dea32f41&q=${cityInput}&format=json`
    $.ajax({
      url: geocodeURL,
      method: "GET"
    })
      .then(function (response) {
        let searchLatString = response[0].lat;
        let searchLonString = response[0].lon;
        let searchLat = parseFloat(searchLatString).toFixed(3);
        let searchLon = parseFloat(searchLonString).toFixed(3);

        doctorSearch(searchLat, searchLon);

        console.log(response);
      })

  }

  function doctorSearch(searchLat, searchLon) {
    $(".home-page").css("display", "none");
    $('#nav-bar').show();
    $(".doctor-results").show();
    pageFlag = "results";

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
          $('#nav-bar').hide();
        }

        for (let i = 0; i < response.data.length; i++) {
          let results = response.data[i];
          let newDocName = $('<h3 class="row header" id="docHeader">').text(`${results.profile["first_name"]} ${results.profile["last_name"]}, MD`);
          
          //check if doctor's practice is within desired search area
          for (let i=0; i<results.practices.length; i++) {
            console.log(results.practices[i].visit_address.zip);
            if (results.practices[i].within_search_area== true) {
              t= i;
              break;
            }
            else {
              t=0;
            }
          }
          
          //retrieves desired information from JSON object for each doctor
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
          let docDescription = $('<p class="doc-info">')
          if(results.profile.bio != '') {
            docDescription.html(`<b>Description: </b>${results.profile.bio}`);
          }
          let saveBtn = $('<button class="btn waves-effect waves-light">').text('Save to favorites');
          saveBtn.attr('id', 'save-doc');
          saveBtn.attr('class', 'align-center');
          saveBtn.attr('data-name', `${results.profile["first_name"]} ${results.profile["last_name"]}`);

          //save provider information to favDocs array if provider hasn't already been saved
          //set local storage to favDocs array
          $(saveBtn).on('click', function() {
            let favDocs_string = JSON.stringify(favDocs);
            let entry = [saveBtn.attr('data-name'), results.practices[0].phones[0].number, results.specialties[0].uid];
            entry = JSON.stringify(entry);
            let check = favDocs_string.indexOf(entry);
            if (check == -1) {
              favDocs.push([saveBtn.attr('data-name'), results.practices[0].phones[0].number, results.specialties[0].uid]);
              localStorage.setItem('saved-docs', JSON.stringify(favDocs));
            }
            
          });
          
          let mapID = 'map' + i;
          let mapDiv = $("<div>").css({ 'width': '100%', 'height': '25rem', 'display': 'none' }).attr('id', mapID);
          let mapBtn = $('<button type="submit" id = "map-btn" class="center-align">').data({ 'latitude': docLat, 'longitude': docLon, 'map-id': mapID }).text('Show Map');
          mapBtn.on('click', openGoogleMap);
          let docContainer = $('<div class = "resultDiv">').attr("id", "div"+i);
          $('.doctor-results').append(newDocName,docContainer);
          $('#div'+i).append(docSpec, docDescription, docClinic, docAddress, docNum, mapBtn, saveBtn, mapDiv);
        }
      });
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

  //display list of user's favorite providers
  function displayFavorites() {
    let favDiv = $('.favorites-div');
    let collapsible = $('.collapsible');
    collapsible.empty();
    if (pageFlag === 'home') {
      $('.home-page').css('display', 'none');
    }
    else {

      $('.doctor-results').css('display', 'none');
    }
    $('#nav-bar').show();
    favDiv.show();

    //creates list of favorite doctors and their information
    for (let i = 0; i < favDocs.length; i++) {
      let name = favDocs[i][0];
      let specialty = favDocs[i][2];
      let phoneNumber = favDocs[i][1];
      let favDocDiv = $('<div>');
      let eachDoc = $('<li>');
      let docName = $('<div class="collapsible-header">').html(`<h5 class="center-align"><b>${name}</b></h5>`).css('background-color','rgb(189, 189, 245)');
      let docDetails = $('<div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>').html('<b>Specialty: </b>' + specialty + '</br>' + '<b>Contact: </b>' + phoneNumber).css('background-color','rgb(230, 230, 230)');
      eachDoc.append(docName, docDetails);
      collapsible.append(eachDoc);
      collapsible.collapsible();
      favDocDiv.append(collapsible);
      favDiv.append(favDocDiv);
    }
  }

  //take user to home page
  $('.home').on('click',function(){location.reload(true)});
  $("#submit-input").on("click", start);
  var isDown=true;
  $('.doctor-results').on("click","h3", function(e) {
      if(isDown){
        $(this).next().slideUp(500);
        isDown=false;
      }else
      {
        $(this).next().slideDown(500);
        isDown=true;
      }
  
  });

  //display favorites
  $('.favorites').on('click', function() {
    displayFavorites();
  })
});