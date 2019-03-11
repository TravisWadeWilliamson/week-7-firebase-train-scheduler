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
  const kst = moment().tz('Asia/Seoul').format("DD  MMM  HH:mm:ss");
  dateTime.text(`KST: ${kst}`);
}, 1000);



// Initialize Firebase
var config = {
  apiKey: "AIzaSyCU9Dz4cZg_dGXsPpoHMnj8cNL6C9YQMv0",
  authDomain: "spaceport-time-table.firebaseapp.com",
  databaseURL: "https://spaceport-time-table.firebaseio.com",
  projectId: "spaceport-time-table",
  storageBucket: "spaceport-time-table.appspot.com",
  messagingSenderId: "544439307817"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding buses
$("#add-bus-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var  busNum= $("#bus-number-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstBus = moment($("#first-bus-input").val().trim(), "HH:mm").format("X");
  var frequency = $("#frequency-input").val().trim();
  
  // Creates local "temporary" object for holding bus info
  var newBus = {
    bus: busNum,
    dest: destination,
    start: firstBus,
    rate: frequency
  };

  // Uploads employee data to the database
  database.ref().push(newBus);

  // Logs everything to console
  console.log(newBus.bus);
  console.log(newBus.destination);
  console.log(newBus.firstBus);
  console.log(newBus.frequency);

  alert("Bus successfully added");

  // Clears all of the text-boxes
  $("#employee-name-input").val("");
  $("#role-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var empName = childSnapshot.val().name;
  var empRole = childSnapshot.val().role;
  var empStart = childSnapshot.val().start;
  var empRate = childSnapshot.val().rate;

  // Employee Info
  console.log(empName);
  console.log(empRole);
  console.log(empStart);
  console.log(empRate);

  // Prettify the employee start
  var empStartPretty = moment.unix(empStart).format("MM/DD/YYYY");

  // Calculate the months worked using hardcore math
  // To calculate the months worked
  var empMonths = moment().diff(moment(empStart, "X"), "months");
  console.log(empMonths);

  // Calculate the total billed rate
  var empBilled = empMonths * empRate;
  console.log(empBilled);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(empName),
    $("<td>").text(empRole),
    $("<td>").text(empStartPretty),
    $("<td>").text(empMonths),
    $("<td>").text(empRate),
    $("<td>").text(empBilled)
  );

  // Append the new row to the table
  $("#employee-table > tbody").append(newRow);
});

  // Example Time Math
  // -----------------------------------------------------------------------------
  // Assume Employee start date of January 1, 2015
  // Assume current date is March 1, 2016

  // We know that this is 15 months.
  // Now we will create code in moment.js to confirm that any attempt we use meets this test case
