/*********************************
 HW Instructions
 *When adding trains, administrators should be able to submit the following:
    
    * Train Name
    
    * Destination 
    
    * First Train Time -- in military time

    * Frequency -- in minutes
  
  * Code this app to calculate when the next train will arrive; this should be relative to the current time.
  
  * Users from many different machines must be able to view same train times.
  
//  */

//create a function to dynamically display local KST
const dateTime = $('#datetime');

// add the Asia/Seoul timezone to the moment
moment.tz.add("Asia/Seoul|LMT KST JST KST KDT KDT|-8r.Q -8u -90 -90 -9u -a0|0123141414141414135353|-2um8r.Q 97XV.Q 1m1zu kKo0 2I0u OL0 1FB0 Rb0 1qN0 TX0 1tB0 TX0 1tB0 TX0 1tB0 TX0 2ap0 12FBu 11A0 1o00 11A0|23e6")

// function to render clock
setInterval(() => {
  // Adding timezone KST to moment and formatting
  const kst = moment().tz('Asia/Seoul').format("DD MMM  HH:mm:ss");
  dateTime.text(`KST: ${kst}`);
}, 1000);

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCU9Dz4cZg_dGXsPpoHMnj8cNL6C9YQMv0",
  authDomain: "spaceport-time-table.firebaseapp.com",
  databaseURL: "https://spaceport-time-table.firebaseio.com",
  projectId: "spaceport-time-table",
  storageBucket: "spaceport-time-table.appspot.com",
  messagingSenderId: "544439307817"
};
firebase.initializeApp(config);

const database = firebase.database();

// 2. Button for adding buses
$("#add-bus-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  const busNum = $("#bus-number-input").val().trim();
  const destination = $("#destination-input").val().trim();
  const firstBus = $("#first-bus-input").val().trim();
  const frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding bus info
  const newBus = {
    bus: busNum,
    dest: destination,
    start: firstBus,
    rate: frequency
  };

  // Uploads employee data to the database
  database.ref().push(newBus);

  // Clears all of the text-boxes
  $("#bus-number-input").val("");
  $("#destination-input").val("");
  $("#first-bus-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding bus to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a constiable.
  const busNum = childSnapshot.val().bus;
  const destination = childSnapshot.val().dest;
  const firstBus = childSnapshot.val().start;
  const frequency = childSnapshot.val().rate;



  //Current time KST
  const kST = moment().tz('Asia/Seoul').format("HH:mm");
  console.log(kST);

  // First Time (pushed back 1 year to make sure it comes before current time)
  const firstTimeConverted = moment.tz(firstBus, "HH:mm", 'Asia/Seoul').subtract(1, "years");
  

  // Difference between the times
  var diffTime = moment.tz('Asia/Seoul').diff(moment(firstTimeConverted), "minutes");
 

// Time apart (remainder)
var tRemainder = diffTime % frequency;


// Minutes til next bus
var tMinutesTillBus = frequency - tRemainder;


// Next bus arrival time
var nextBus = moment.tz('Asia/Seoul').add(tMinutesTillBus, "minutes");


  // Create the new row
  const newRow = $("<tr>").append(
    $("<td>").text(busNum),
    $("<td>").text(destination),
    $("<td>").text(firstBus),
    $("<td>").text(frequency),
    $("<td>").text(moment(nextBus).format("HH:mm")),
    $("<td>").text(tMinutesTillBus)
  );

  // Append the new row to the table
  $("#bus-table > tbody").append(newRow);
});
