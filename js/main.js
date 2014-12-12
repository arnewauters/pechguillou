$(function() {
  $('.slowscroll').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top
      }, 1000);
      return false;
    }
  }
  });
});

$('.btn-group button[data-calendar-nav]').each(function() {
  var $this = $(this);
  $this.click(function() {
    calendar.navigate($this.data('calendar-nav'));
  });
});

$('.btn-group button[data-calendar-view]').each(function() {
  var $this = $(this);
  $this.click(function() {
    calendar.view($this.data('calendar-view'));
  });
});

if (document.getElementById("contactForm")) {
  $('#submit').click(function() {
    $("div#name-group").removeClass('has-error');
    $("div#email-group").removeClass('has-error');
    $("div#number-group").removeClass('has-error');
    $("div#from-group").removeClass('has-error');
    $("div#to-group").removeClass('has-error');

    var name = $("input#name").val();
    var email = $("input#email").val();
    var number = $("select#number-of-people").val();
    var from = $("input#from").val();
    var to = $("input#to").val();
    var extra = $("textarea#extra").val();

    var rgx = /(\d{2})\/(\d{2})\/(\d{4})/;

    if (name == "") {
      $("div#name-group").addClass('has-error');
      $("input#name").focus();
      return false;
    }

    if (email == "") {
      $("div#email-group").addClass('has-error');
      $("input#email").focus();
      return false;
    }

    if (number == "") {
      $("div#number-group").addClass('has-error');
      $("input#number").focus();
      return false;
    }

    from_parts = from.match(rgx);
    if (from == "" || !from_parts) {
      $("div#from-group").addClass('has-error');
      $("input#from").focus();
      return false;
    }

    to_parts = to.match(rgx);
    if (to == "" || !to_parts) {
      $("div#to-group").addClass('has-error');
      $("input#to").focus();
      return false;
    }

   toDate = new Date(to_parts[3], to_parts[2], to_parts[1]);
   fromDate = new Date(from_parts[3], from_parts[2], from_parts[1]);

    if (toDate < fromDate) {
      $("div#to-group").addClass('has-error');
      $("input#to").focus();
      return false;
    }

    var dataString = 'name='+ name + '&email=' + email + '&number=' + number
                     + '&from=' + from + '&to=' + to + '&extra=' + extra;
    $.ajax({
      type: "POST",
      url: "http://getsimpleform.com/messages/ajax?form_api_token=1e02b8615467c549d4b89ed9d94998a5",
      data: dataString,
      dataType: 'jsonp',
      success: function() {
        $('#success').fadeTo(1500, 1);
      }
    });

    return false;
  });
}

if (document.getElementById("map_canvas")) {
  $('#directions-container').hide();

  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var map;

  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  $("#calcRoute").click(function() {
    var pech = new google.maps.LatLng(44.276257, 0.834423);
    var end = document.getElementById("end").value;
    var request = { origin:end, destination:pech, travelMode: google.maps.DirectionsTravelMode.DRIVING };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        $('#directions-container').fadeTo(1500, 1);
      }
    });
  });

  var pech = new google.maps.LatLng(44.276257, 0.834423);
  var myOptions = {
    zoom:7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: pech,
    navigationControl: false,
    //scrollwheel: false,
    //scalControl: false,
    draggable: false,
  }

  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  directionsDisplay.setMap(map);

  var marker = new google.maps.Marker({
    position: pech,
      map: map,
      title:"Pech Guillou Dream House!"
  });
}

var fetch_messages = function() {
  $.ajax({
    type: "GET",
    url: "http://getsimpleform.com/messages.js?api_token=2dc76d4d4fc8ff48783cfc993ab4330a",
    dataType: 'jsonp',
    success: function(data) {
      data = data.reverse();
      $('#guestbook_entries').empty();
      $.each(data, function(key, val) {
        htmlstring = "<div class=\"panel\">";
        htmlstring += "<div class=\"panel-heading\">";
        htmlstring += "<h3 class=\"panel-title\">" + val.data.name + "</h3>";
        htmlstring += "<p class=\"text-muted\">" + val.created_at.replace("T", " ").replace("Z", "") + "</p>";
        htmlstring +=  "</div>";
        htmlstring += "<div class=\"panel-body\">";
        htmlstring += val.data.extra.replace(/\r?\n/g, '<br />');
        htmlstring +=  "</div>";
        htmlstring +=  "</div>";
        $('#guestbook_entries').append(htmlstring);
      });
    }
  });
}

if (document.getElementById("guestbook_entries")) {
  fetch_messages();
}

if (document.getElementById("guestbookForm")) {
  $('#submit').click(function() {
    $("div#name-group").removeClass('has-error');
    $("div#email-group").removeClass('has-error');
    $("div#extra-group").removeClass('has-error');

    var name = escape($("input#name").val());
    var email = $("input#email").val();
    var extra = escape($("textarea#extra").val());

    var rgx = /(\d{2})\/(\d{2})\/(\d{4})/;

    if (name == "") {
      $("div#name-group").addClass('has-error');
      $("input#name").focus();
      return false;
    }

    if (email == "") {
      $("div#email-group").addClass('has-error');
      $("input#email").focus();
      return false;
    }

    if (extra == "") {
      $("div#extra-group").addClass('has-error');
      $("textarea#extra").focus();
      return false;
    }

    var dataString = 'name='+ name + '&email=' + email + '&extra=' + extra;
    $.ajax({
      type: "POST",
      url: "http://getsimpleform.com/messages/ajax?form_api_token=6c9049299ad46ee4e3a263e70ba4b1fd",
      data: dataString,
      dataType: 'jsonp',
      success: function() {
        fetch_messages();
        $('#success').fadeTo(1500, 1);
      }
    });

    return false;
  });
}
