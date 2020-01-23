
$(document).ready(function () {

  $(".doctor-results").hide();

  let apiKey = "236ad2959b8fdc4ea0843819d69ef3ab";
  let submitBtn = $("#submit-input");

  function doctorSearch() {
    /******Madhavi's changes start */

    //display : none for home-page to show doctor's info on button click


    $(".home-page").css("display", "none");
    $(".doctor-results").show();

    /******Madhavi's changes end */
    let specialtyInput = $("#specialty-input").val().trim();
    console.log(specialtyInput);
    let cityInput = $("#city-input").val().trim();
    let queryURL = `https://api.betterdoctor.com/2016-03-01/doctors?specialty_uid=${specialtyInput}&query=${cityInput}&skip=2&limit=10&user_key=${apiKey}`;
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {
        console.log(response);

        let docFirstName = response.data[0].profile["first_name"];
        
        let docLastName = response.data[0].profile["last_name"];

        let docName = docFirstName + " " + docLastName
        console.log("Name: " + docName);

        let docSpec = response.data[0].specialties[0].uid;
        console.log("Specialty: " + docSpec);


        let docPicURL = response.data[0].profile["image_url"];
        console.log("docPicURL " + docPicURL);

        //alt=""


        let docClinic = response.data[0].practices[0].name;
        console.log("Clinic: " + docClinic);


        let docLat = response.data[0].practices[0].lat
        console.log("Lat: " + docLat)

        let docLon = response.data[0].practices[0].lon
        console.log("lon :" + docLon);

        let docCity = response.data[0].practices[0].visit_address.city
        console.log("City: " + docCity);

        //address details from API response
        let docStreet = response.data[0].practices[0].visit_address.street;
        let docState = response.data[0].practices[0].visit_address.state;
        let docZip = response.data[0].practices[0].visit_address.zip;

        let docAddress = docStreet + ", " + docCity + " " + docState + " " + docZip;


        let docNum = response.data[0].practices[0].phones[0].number
        console.log("Number: " + docNum);


        //updating Doctor details onto the page

        // $("#doctor-name").text(docName); // doctor's name as Heading
        // $("#specialty").text("Specialty: " + docSpec);// Speciality
        // $("#doc-pic").attr("src", docPicURL);// doc's image's URL
        // $("#doc-pic").attr("alt", "Doctor's Pic"); // pic's Alternate ID
        // $("#clinic").text("Clinic: " + docClinic);//Clinic's name
        // $("#address").text("Address: " + docAddress);//address info
        // $("#phone-number").text("Phone: " + docNum);//doc's phone #

        
        $("#doctor-name").text(docName); // doctor's name as Heading
        $("#specialty").html("<b> Specialty: </b>" + docSpec);// Speciality
        $("#doc-pic").attr("src", docPicURL);// doc's image's URL
        $("#doc-pic").attr("alt", "Doctor's Pic"); // pic's Alternate ID
        $("#clinic").html("<b> Clinic: </b>" + docClinic);//Clinic's name
        $("#address").html("<b> Address: </b>" + docAddress);//address info
        $("#phone-number").html("<b> Phone: </b>" + docNum);//doc's phone #


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


  $(submitBtn).on("click", doctorSearch);
});