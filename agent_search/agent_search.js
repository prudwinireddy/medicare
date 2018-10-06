//setup ajax calls for good browsers and bad ones 
	if (!window.XMLHttpRequest) {
		window.XMLHttpRequest = function() {
			return new ActiveXObject('Microsoft.XMLHTTP');
		};
	}
	
	var map;
    var geocoder;
    var toTravel;
    function initialize() {
      var mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
      geocoder = new google.maps.Geocoder();
    }
    
    
    //only allow numbers to be keyed into the zip code field
    function numbersOnly(myfield, e, dec) {
		var key,
			keychar;
		if (window.event) key = window.event.keyCode;
		else if (e) key = e.which;
		else return true;
		keychar = String.fromCharCode(key);
		if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27) )
		   return true;
		else if ((("0123456789").indexOf(keychar) > -1))
		   return true;
		else if (dec && (keychar == ".")){
		   myfield.form.elements[dec].focus();
		   return false;
		} else
		   return false;
	}
	
	//remove error states of inputs when the user clicks back into the input field
	function resetInputs() {
		$("input#valFirstName, input#valLastName, input#valZip,  input#valCity").css({"background-color" : "#fefefe", "border" : "solid 1px #d8d8d8" });
	}
	
	$("input#valFirstName, input#valLastName, input#valZip,  input#valCity").focus(function() {
  resetInputs();
	$(this).next(".errors.errmsg").hide();
	});
	
	
	//call this function to append SM <sup> tags on all product names
	function replaceMe(){
		var str=document.getElementById("agent-results").innerHTML;
		var n=str.replace(/Supplement/g,"Supplement<sup>SM</sup>");
		n=n.replace(/\(HMO\)/g,"\(HMO\)<sup>SM</sup>");
		n=n.replace(/\(PPO\)/g,"\(PPO\)<sup>SM</sup>");
		n=n.replace(/Rx/g,"Rx<sup>SM</sup>");
		document.getElementById("agent-results").innerHTML = n;
	}

$(document).ready(function(){
	
/*check states*/

	  var currentUrl = window.location.href;
	  var defaultUrl = '/agent_search/agents.xml'; //AEM	
	  //var defaultUrl = '../bcbsil/agent_search/agents.xml';  
		var assignNewUrl = defaultUrl.split(".xml")[0];
		
	
		
		if (currentUrl.indexOf('bcbsil') > -1) {
        var NewUrl = assignNewUrl + '-il.xml';
		    } else if (currentUrl.indexOf('bcbsnm') > -1) {
        var NewUrl = assignNewUrl + '-nm.xml';
        } else if (currentUrl.indexOf('bcbsmt') > -1) {
        var NewUrl = assignNewUrl + '-mt.xml';
        }  else if (currentUrl.indexOf('bcbsok') > -1) {
        var NewUrl = assignNewUrl + '-ok.xml';
        }  else if (currentUrl.indexOf('bcbstx') > -1) {
        var NewUrl = assignNewUrl + '-tx.xml';
        } else {
        var NewUrl = assignNewUrl + '-il.xml';
        }

//console.log(NewUrl);

// START OF ZIP SEARCH SECTION ****************************************************************************
	
	//data for ZIP and GEOLOCATION search 
	function findMe(location) {
    	$.ajax({
    		type: "GET",
    		cache: false,
			//url: "../bcbsil/agent_search/agents.xml",			
			url: NewUrl,			
			dataType: "xml",
			success: function(agents) {
				var agentCount = $(agents).find("agent").length -1;
				var agencies = [];
				$("#agent-results, #results-count, #error-message").html("");
				$(agents).find("agent").each(function(index) {

				var firstname = $(this).find("firstname").text(),		
				    lastname = $(this).find("lastname").text(),	
					agency = $(this).find("agency").text(),
					street = $(this).find("address").text(),	
					city = $(this).find("city").text(),
					state = $(this).find("state").text(),
					zip = $(this).find("zip").text(),
					phone = $(this).find("phone").text(),
					productA = $(this).find("productA").text(),
					productB = $(this).find("productB").text(),
					productC = $(this).find("productC").text(),
					language = $(this).find("language").text(),
					email = $(this).find("email").text(),
					bounds = new google.maps.LatLngBounds(), 
					markersArray = [],
					origin = location,
					destination= "",
					destinationIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=D|FF0000|000000', 
					originIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
					
			  
			  function callback(response, status) {
			    if (status != google.maps.DistanceMatrixStatus.OK) {
			      //alert('Error was: ' + status);
			    } else {
			      var origins = response.originAddresses;
			      var destinations = response.destinationAddresses;
			      var length = "";		      
			      for (var i = 0; i < origins.length; i++) {
			      var results = response.rows[i].elements;
					for (var j = 0; j < results.length; j++) {
			        	//find all the locations that fit within our radius. Turn them into objects, and add them to our array
			        	if(results[j].distance.value <= toTravel ){	
			        	var place = {
		        			location: results[j].distance.value,
		        			distance: results[j].distance.text,
		        			agency: agency,
							firstname: firstname,
							lastname: lastname,
		        	name: name,		
							agency: agency,
							street: street,	
							city: city,
							productA: productA,
							productB: productB,
							productC: productC,
							state: state,
							zip: zip,
							phone: phone,
							language: language
			        	};
			        		agencies.push(place);
			          	}
			        }//end for j loop  		
			      }//end for i loop
			    }//end else statement

			    // once we have gone through the whole XML sort our agency objects by their distance property
			    if(index == agentCount){ 			    	
			      agencies.sort(function (a, b) {
                    return ((a.location < b.location) ? -1 : ((a.location > b.location) ? 1 : 0));
                  });
                
                //here is the HTML output
                $.each(agencies ,function() {
                	$("<div class='agent-list' ><p class='agent-data'><strong>" 
                	+ this.firstname + " " + this.lastname + "</strong> <span class='valDistance'>" 
                	+ this.distance + "</span></p><p>" 
                	+ this.phone + "</p><p>"
                	+ this.city + ", " + this.state + "  " + this.zip + "</p><p><br />Languages Spoken: " 
					+ this.language + "</p></div>").appendTo("#agent-results");
                });	
                
                replaceMe();
			    
			    //if the ajax call was successful, but there are ZERO agents matching the search criteria...
			      if ($(".agent-data").length == 0){
					$("#error-message").html("We're sorry, but we could not find any agents that matched your search criteria. Please try searching with a different location or try searching by name.").show();
					$("#results-count").html("").hide();
				  } else if ($(".agent-data").length == 1){
					$("#results-count").html("Displaying "+ $(".agent-data").length +" agent by ZIP code.").show();
					$("#error-message").html("").hide();
				  } else {
					$("#results-count").html("Displaying "+ $(".agent-data").length +" agents by ZIP code.").show();
					$("#error-message").html("").hide();
					$("table.agent-data:odd").addClass("odd");
				  }	
			    }
			   
			  }//end callback function
			  
			  
			  function calculateDistances() {		  	
			  	var service = new google.maps.DistanceMatrixService();
			    service.getDistanceMatrix(
			      {
			        origins: [origin],
			        destinations: [zip], //you can also use something like "300+East+Randolph+Street+Chicago+IL" for better accuracy if you like
			        travelMode: google.maps.TravelMode.DRIVING,
			        unitSystem: google.maps.UnitSystem.IMPERIAL,
			        avoidHighways: false,
			        avoidTolls: false
			      }, callback); //as soon as we have calculated the distance this calls the function to append the html onto the page
			  }
			  
		  //now that everything is set up, we can go calculate distances  
		  calculateDistances();			
	  
		  });//end .each function 
		  
		  
		  
	    }//end success function
	  });//end ajax call
    }
    
	
	$("#zip-button").click(function() {
		var valZip = $("input#valZip").val(),
			valOrigin = "",
			valDistance = parseInt($("select#valDist").val());
		//convert Google's distance matrix default response to miles
		toTravel = valDistance*1610;
		//if nothing is entered by the user
			if (valZip == "") {
				$("input#valZip").css({"border" : "2px solid #e10000"});
				$("input#valZip").next(".errors.errmsg").show();
			} else if (valZip.length <= 4) {
				$("input#valZip").css({"border" : "2px solid #e10000"});
				$("input#valZip").next(".errors.errmsg").show();
			} else {
				//if everything looks good...
				geocoder.geocode( { 'address': valZip}, function(results, status) {
		          myState = results[0].address_components[3].short_name;  // myState should be "IL"
		          if (status == google.maps.GeocoderStatus.OK) {
		            var valOrigin = results[0].formatted_address;
		            findMe(valOrigin);
		          } else {
		            //alert('Geocode was not successful for the following reason: ' + status);
		          }
		        });
			}//end else statement - found results
	});//end click bind for zip code
	
	
// END OF ZIP SEARCH SECTION *******************************************************************************
// START OF NAME SEARCH SECTION ****************************************************************************
	
	$("#name-button").click(function() {
		var valFirstName = $("input#valFirstName").val(),
			valLastName = $("input#valLastName").val();
		if ((valFirstName == "") && (valLastName == "")) {
			$("input#valFirstName, input#valLastName").css({"border" : "2px solid #e10000"});
			$("input#valFirstName, input#valLastName").next(".errors.errmsg").show();
		} else {
			$.ajax({
				type: "GET",
				//url: "../agent_search/agents.xml",
				url: NewUrl,				
				dataType: "xml",
				success: function(agents) {
					$("#agent-results, #results-count, #error-message").html("");
					$(agents).find("agent").each(function(index) {

					var firstName = $(this).find("firstname").text(),
						lastName = $(this).find("lastname").text(),
						firstname = $(this).find("firstname").text(),
						lastname = $(this).find("lastname").text(),
						name = $(this).find("name").text(),		
						agency = $(this).find("agency").text(),
						street = $(this).find("address").text(),	
						city = $(this).find("city").text(),
						state = $(this).find("state").text(),
						zip = $(this).find("zip").text(),
						productA = $(this).find("productA").text(),
						productB = $(this).find("productB").text(),
						productC = $(this).find("productC").text(),
						phone = $(this).find("phone").text(),
						language = $(this).find("language").text(),
						email = $(this).find("email").text();
						
						if(firstName.toLowerCase() == valFirstName.toLowerCase() || lastName.toLowerCase() == valLastName.toLowerCase() ){
							$("<div class='agent-list' ><p class='agent-data' ><strong>" 
							+ firstname + " " + lastname + "</strong></p><p>" 
							+ phone + "</p><p>"
							+ city + ", " + state + "  " + zip + "</p><p><br />Languages Spoken: " 
							+ language + "</p></div>").appendTo("#agent-results");
			          	}
					});//end .each
					 
					//if the ajax call was successful, but there are ZERO agents matching the search criteria...
					if ($(".agent-data").length == 0){
						$("#error-message").html("We're sorry, but we could not find any agents that matched your search criteria. Please try searching with a different name or try searching by city or ZIP code.").show();
						$("#results-count").html("").hide();
					} else if ($(".agent-data").length == 1){
						$("#results-count").html("Displaying "+ $(".agent-data").length +" agent by name.").show();
						$("#error-message").html("").hide();
					} else {
						$("#results-count").html("Displaying "+ $(".agent-data").length +" agents by name.").show();
						$("#error-message").html("").hide();
						$("table.agent-data:odd").addClass("odd");
					}
					
					replaceMe();
					
				},//end success function
				error: function(message) {
					//alert("Sorry, there was an error because " + message);
				}
			});//end ajax call
		}//end else statement
	});//end click bind for name
	
// END OF NAME SEARCH SECTION *******************************************************************************
// START OF CITY SEARCH SECTION ****************************************************************************
	
	$("#city-button").click(function() {
		var valCity = $("input#valCity").val(),
			valState = "Illinois";
		if (valCity == "" ) {
			$("input#valCity").css({"border" : "2px solid #e10000"});
			$("input#valCity").next(".errors.errmsg").show();
		} else {
			$.ajax({
				type: "GET",
				//url: "../bcbsil/agent_search/agents.xml",
				url: NewUrl,
				dataType: "xml",
				success: function(agents) {
					$("#agent-results, #results-count, #error-message").html("");
					$(agents).find("agent").each(function() {

					var city = $(this).find("city").text(),
					    firstname = $(this).find("firstname").text(),
						lastname = $(this).find("lastname").text(),	
						name = $(this).find("name").text(),		
						agency = $(this).find("agency").text(),
						street = $(this).find("address").text(),	
						city = $(this).find("city").text(),
						state = $(this).find("state").text(),
						zip = $(this).find("zip").text(),
						productA = $(this).find("productA").text(),
						productB = $(this).find("productB").text(),
						productC = $(this).find("productC").text(),
						phone = $(this).find("phone").text(),
						language = $(this).find("language").text(),
						email = $(this).find("email").text();
						
						if(city.toLowerCase() == valCity.toLowerCase() ){
							$("<div class='agent-list' ><p class='agent-data'><strong>" 
							+ firstname + " " + lastname + "</strong></p><p>" 
							+ phone + "</p><p>"
							+ city + ", " + state + "  " + zip + "</p><p><br />Languages Spoken: " 
							+ language + "</p></div>").appendTo("#agent-results");
			          	}
					});//end .each
					
					//if the ajax call was successful, but there are ZERO agents matching the search criteria...
					if ($(".agent-data").length == 0){
						$("#error-message").html("We're sorry, but we could not find any agents that matched your search criteria. Please try searching with a different location or try searching by name.").show();
						$("#results-count").html("").hide();
					} else if ($(".agent-data").length == 1){
						$("#results-count").html("Displaying "+ $(".agent-data").length +" agent by city.").show();
						$("#error-message").html("").hide();
					} else {
						$("#results-count").html("Displaying "+ $(".agent-data").length +" agents by city.").show();
						$("#error-message").html("").hide();
						$("table.agent-data:odd").addClass("odd");
					}
					
					replaceMe();
					
				},//end success function
				error: function(message) {
					//alert("Sorry, there was an error because " + message);
				}
			});
		}
	});//end click bind for city
	
// END OF CITY SEARCH SECTION *******************************************************************************
					
//set up google distance matrix function
initialize();
	
});