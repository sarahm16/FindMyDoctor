for(let i=0; i<response.data.length; i++) {
    let docName = $('<h3>').text(response.data[i].profile["first_name"]);
    let docPicURL = response.data[i].profile["image_url"];
    let docPic = $('<img>').attr('src', docPicURL);
    let docSpec = $('<p>').text('Specialty: ' + response.data[i].specialties[0].uid);
    let docClinic = $('<p>').text('Clinic: ' + response.data[i].practices[0].name);
    let docLat = response.data[i].practices[0].lat;
    let docLon = response.data[i].practices[0].lon;
    let docCity = response.data[i].practices[0].visit_address.city;
    let docNum = $('<p>').text('Phone number: ' + response.data[0].practices[0].phones[0].number)
}