
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



    })

}

$(submitBtn).on("click", doctorSearch);

