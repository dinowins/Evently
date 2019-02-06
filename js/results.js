var page = 0;
var currentKey = '';

function getEvents(keyword) {

  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=5QGCEXAsJowiCI4n1uAwMlCGAcSNAEmG&keyword=" + keyword + "&stateCode=OR&city=portland&size=20&page=" + page,
    async:true,
    dataType: "json",
    success: function(json) {
          getEvents.json = json;
          showEvents(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}

function convertTime(time) {
  let timeSplit = time.split(":");
  timeSplit.pop();
  let convertedTime;
  if(Number(timeSplit[0]) > 12) {
    timeSplit[0] -= 12;
    timeSplit[0].toString();
    convertedTime = timeSplit.join(":") + " PM";
  } else {
    convertedTime =  timeSplit.join(":") + " AM";
  }
  return convertedTime;
}

function checkIfUndefined(elementArr) {
  for(let i = 0; i < elementArr.length; i++){
    if(elementArr[i] === undefined) {
      elementArr[i] = '-';
    }
  }
}

function showEvents(json) {
  let events = json._embedded.events;
  console.log(json);
  $('.results').remove();
  $('.col-xs-8').append('<ul class="results"></ul>');

  events.forEach(function (event){
    let elementsArr = [event.images, event.name, event._embedded.venues, event.dates.start.localDate, event.dates.start.localTime, event.priceRanges];
    checkIfUndefined(elementsArr);
    //dependant
    let images = elementsArr[0];
    let venues = elementsArr[2];
    let priceRange = elementsArr[5];
    //independent
    let eventName = elementsArr[1];
    let eventDate = elementsArr[3];
    let eventTime = elementsArr[4];
    let eventBooking = event.url;
    //console.log(eventBooking);


    let imageURL = (event.images) ? event.images[0].url : 'img/e-logo.png';
    let venueName = (event._embedded.venues) ? event._embedded.venues[0].name :'-';
    let priceMin = (event.priceRanges) ? event.priceRanges[0].min : '-';
    let priceMax = (event.priceRanges) ? event.priceRanges[0].max : '-';

    // add list item
    $('.results').append('<a href="' + eventBooking + '"><li class="result-item hvr-grow"><div class="test img-container"><img class="test-image" src="' + imageURL + '"</img></div> <div class="test test-content"><h2 class="event-title">' + eventName + '</h2><p class="event-description">' + venueName + '</p><p class="event-date">' + eventDate + '</p><p class="event-date">' + convertTime(eventTime) + '</p><p class="price">Prices From: $' + priceMin + ' to $' + priceMax + '</p></div></li></a>');

    pagination(json.page.totalPages);
  });
}

function pagination(pageTotal) {

  let items = "";

  for(let i=1; i<pageTotal+1; ++i) {

    if(i === 1 && page !== 0) {
      items += "<li class='page-num' id='prev'><a href='#'>previous</a></li>";
    }
    else if(i > 9) {
      items += "<li class='page-num' id='dotdot'>...</li>";
      items += "<li class='page-num'><a href='#'>" + pageTotal + "</a></li>";
      items += "<li class='page-num' id='next'><a href='#'>next</a></li>";
      break;
    }
    items += "<li class='page-num'><a href='#'>" + i + "</a></li>";
  }

  $("#page-list").html(items);
}

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function addListeners() {

  $("#page-list").on("click", "li", function() {
    let temp = $(this).text();

    if(temp === "next") {
      ++page;
    }
    else if (temp === "previous") {
      --page;
    }
    else {
      page = $(this).text() - 1;
    }
    getEvents(currentKey);
  });
}



$(document).ready(function () {

  // display search results when navigate to page
  currentKey = localStorage.getItem("key");
  getEvents(currentKey);

  $("#search").click(function() {
    currentKey = $("#bar").val();
    getEvents(currentKey);
  });

  //pagination page request
  addListeners();


});
