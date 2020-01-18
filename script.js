
//GLOBAL VARIABLES:

$(document).ready(function() {
 
   $(".doctor-results").hide();

let apiKey = "236ad2959b8fdc4ea0843819d69ef3ab";
let submitBtn = $("#submit-input");




function doctorSearch() {
  /******Madhavi's changes start */

  //display : none for home-page to show doctor's info on button click
  
  
  $(".home-page").css("display","none");
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
    .then(function(response) {
      console.log(response);

      let docName = response.data[0].profile["first_name"];
      console.log("Name: " + docName);
      let docSpec = response.data[0].specialties[0].uid;
      console.log("Specialty: " + docSpec);
      let docClinic = response.data[0].practices[0].name;
      console.log("Clinic: " + docClinic);
      let docLat = response.data[0].practices[0].lat
      console.log("Lat: " + docLat)
      let docLon = response.data[0].practices[0].lon
      console.log("lon :" + docLon);
      let docNum = response.data[0].practices[0].phones[0].number
      console.log("Number: " + docNum);
      let docCity = response.data[0].practices[0].visit_address.city
      console.log("City: " + docCity);
      


    })

}

$(submitBtn).on("click", doctorSearch);

});