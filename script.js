
//GLOBAL VARIABLES:

let apiKey = "236ad2959b8fdc4ea0843819d69ef3ab";
let submitBtn = $("#submit-input");




function doctorSearch() {
    let specialtyInput = $("#specialty-input").val().trim();
    console.log(specialtyInput);
    let symptomInput = $("#symptom-input").val().trim();

    let queryURL = `https://api.betterdoctor.com/2016-03-01/doctors?specialty_uid=${specialtyInput}&query=${symptomInput}&location=37.773,-122.413,100&skip=2&limit=10&user_key=${apiKey}`;
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
      


    })

}

$(submitBtn).on("click", doctorSearch);

