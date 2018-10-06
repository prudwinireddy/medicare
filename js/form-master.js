/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {
		
    $('.EMAsubmit').h5Validate({
        errorClass: 'errors'
    });
		
		$('.EMAsubmit').submit(function (event) {   
        formSubmitted(this, event);   
    });

    	
    

}); // End $(documnet).ready() 

function formSubmitted(form, event) {
		var result = $(form).h5Validate('allValid');
        
        /*if ($('#Male').hasClass("errors")){
            $('#gender').removeClass('hidden-msg');        
        } else {
            $('#gender').addClass('hidden-msg');
        }*/
       
			 if (result === true) {           
            submissionGen(form);
            //$(form).off('submit');						
        }
			 
			 
			  /*
        if (result === true && $(form).attr("id") != "affinity") {           
            submissionGen(form);
            $(form).off('submit');						
        } else if (result === true &&  $(form).attr("id") == "affinity"){
        	submissionGen(form);
        }
				*/
				//event.preventDefault();      
        return false;
}


/*$( "#download-booklet" ).click(function(e) {
$('.EMAsubmit').submit();
});
*/


function submissionGen(form) {
    
    //Set potential url parameter variables
    var EventTimeStamp,
        HCSCPlanState,
        state,
        source,
        campaign,
        CampaignID,
        URL,
        Notes,
        pgURL = window.location.href,
        urlRec,
        qParams;

        
    $.parseParams = function (query) {
        var params = {}, e;
        if (query) {
            if (query.substr(0, 1) === '?') {
                query = query.substr(1);
            }

            while (e = re.exec(query)) {
                var k = decode(e[1]),
                    v = decode(e[2]);
                if (params[k] !== undefined) {
                    if (!$.isArray(params[k])) {
                        params[k] = [params[k]];
                    }
                    params[k].push(v);
                } else {
                    params[k] = v;
                }
            }
        }

        return params;
    };
    
        
    // Parse URL queries into object
    var re = /([^&=]+)=?([^&]*)/g,
        decode = function (str) {
            return decodeURIComponent(str.replace(/\+/g, ' '));
        };

        
    //---------------------------------------------------
    //---Set State Variables based on URL

    if (pgURL.indexOf('bcbs-mt') > -1) {
        state = "MT";
        HCSCPlanState = "Montana";
    } else if (pgURL.indexOf('bcbsnm') > -1) {
        state = "NM";
        HCSCPlanState = "New Mexico";
    } else if (pgURL.indexOf('bcbsok') > -1) {
        state = "OK";
        HCSCPlanState = "Oklahoma";
    } else if (pgURL.indexOf('bcbstx') > -1) {
        state = "TX";
        HCSCPlanState = "Texas";
    } else if (pgURL.indexOf('bcbsmt') > -1) {
        state = "MT";
        HCSCPlanState = "Montana";
    } else {
        state = "IL";
        HCSCPlanState = "Illinois";
    }


        
    //---------------------------------------------------
    //---Pull Params out of URL and set to variables

    qParams = $.parseParams(pgURL.split('?')[1] || '');
    CampaignID = ("creativetype" in qParams) ? qParams.creativetype : "";
    CampaignID = CampaignID.split('#')[0]; //remove everthing after # in url
    source = ("source" in qParams) ? qParams.source : "YI";



    //---------------------------------------------------
    //---Set EMA HTTPRECEIVER URL - Production or UAT		
	// testing
	if (pgURL.indexOf('www.bcbs') > -1 || pgURL.indexOf('espanol.bcbs') > -1 && pgURL.indexOf('sdstaging') == -1 ) {
        urlRec = "https://ema-receiver.hcsc.net/httpreceiver_process/";
  } 
	
	else if (pgURL.indexOf('staging.bcbs') > -1)	{
	urlRec = "https://t-ema-receiver-pfx-lb.test.hcscint.net/httpreceiver_process_pfx/";
	}
	
	else if (pgURL.indexOf('live-uat.test') > -1)	{
		urlRec = "https://t-ema-receiver-pfx-lb.test.hcscint.net/httpreceiver_process_pfx/";
	}
		
	else {
        urlRec = "https://t-ema-receiver-pfx-lb.test.hcscint.net/httpreceiver_process_pfx/";

  }

        
    //assigns variable to the form for alteration
    var formItself = form,
        formName = $(form).attr('name'),

        //Time Stamp Handler
        d = new Date();

    d.setDate(d.getDate());

    EventTimeStamp = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2)  + ":" + ('0' + d.getSeconds()).slice(-2);
        
        
    //create parameter variables object via data passed into the URL, and parsed via functions above
    var paramVarsObj = {
        EventTimeStamp : EventTimeStamp,
        CampaignID : CampaignID,
        HCSCPlanState : HCSCPlanState,
        campaign : campaign,
        Notes : pgURL,
        URL : pgURL
    };

    //function to remove blank or undefined fields from paramvars object
    removeUndefinedProps(paramVarsObj);
        
    
		//********************//
    //SEARCH AND LOGIN FORM HANDLING//
    //********************//
		
		/*
		if ($(form).hasClass('noEMA')) {
				var action = $(form).attr('action');
				
				$(form).unbind('submit').attr('action', action).submit();
				return false;
		}	
    */
    
    //********************//
    //FORM DATA COLLECTION//
    //********************//

    //Creates array of objects from clicked form data
    var formData = $(form).serializeArray();

    //Turns formData into usable object
    var formDataObj = {};
    
    $(formData).each(function (i, field) {
        formDataObj[field.name] = field.value;
    });


    
    
    //////////////////////////////////////////////////////////////////////////
    //Example of data that can be picked specifically out of the formDataObj (i.e. age, email, phone, etc)//
    //console.log(formDataObj['PrimaryEmail']);           

    formDataObj.OralLanguage = formDataObj.LanguagePreference;
    formDataObj.WrittenLanguage = formDataObj.LanguagePreference;

    
    if (formDataObj.DateofBirth !== undefined && formDataObj.DateofBirth !== "") {
        var date = formDataObj.DateofBirth,
            newdate = date.split("/");
            newdate = newdate[2] + "-" + newdate[0] + "-" + newdate[1];
        formDataObj.DateofBirth = newdate;
    }


    //*******************//
    //Combine Parameter and Form objects into single object and overwrite form data with parameter variables if applicable.
    //*******************//

    var combinedObj = $.extend(true, formDataObj, paramVarsObj);

    //remove brackets and name/value designations
    $.fn.serializeObject = function () {
        var o = {},
            a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };


    //creates JSON string from parsed out of combined/cleaned data
    var finalFormData = JSON.stringify(combinedObj);
       
    //adding lead detail portion of string & string of data to be sent to EMA
    finalFormData = "{\"LeadDetail\":" + finalFormData + "}";
    //console.log(finalFormData);
       
    
    if ($(form).hasClass('over65Check') && formDataObj.DateofBirth !== undefined && formDataObj.DateofBirth !== "") {

        //Get Date of Birth from the JSON Object
        var dob = date,
        //Calculate the age as of Today
        age = getAgeAsOfDate(new Date(dob), new Date());

        //Change the class name based on the form you want to submit
        if (age >= 65) {
            
            $('#doberror1').addClass('hidden');
            $('#doberror2').removeClass('hidden');
            $('#doberror3').addClass('hidden');
            
        }
        
        //Change the class name based on the form you want to submit
        if (age < 13) {
            
            $('#doberror1').addClass('hidden');
            $('#doberror2').addClass('hidden');
            $('#doberror3').removeClass('hidden');
            
        }
    

    }
    
    if ($(form).hasClass('zipCheck')) {
        
        var zipCode = formDataObj.ZipCode,
            formID = $(form).attr('id'),
            $zipField = $("#" + formID + " .zipCode");


        $.zipLookup(
            zipCode,

            function (cityName, stateName, stateShortName) {
                
                if (stateShortName !== state) {

                    $('#zip-value').val("").addClass('errors');
                    $('#zip-valueb').val("").addClass('errors');
                    $('#zip-valuec').val("").addClass('errors');
                    $('#zipErr').remove();

                    return false;
                    
                } else {
                    $('#zipErr').remove();
                    $('#zip-value').removeClass('errors');
                    $('#zip-valueb').removeClass('errors');
                    $('#zip-valuec').removeClass('errors');

                    var email = formDataObj.PrimaryEmail;
                    var zip = formDataObj.ZipCode;

                    if (age < 65 && age > 12 || age === undefined) {

                        transmit(urlRec, finalFormData, formItself, formName);

                        if ($('form').hasClass('altSubmit')) {
                            rscRedirect(formItself, email, state, zip, source);
                        }
                    }
                }
            },
            
            function (errMsg) {
                
                $('#zip-value').val("").addClass('errors');
                $('#zip-valueb').val("").addClass('errors');
                $('#zip-valuec').val("").addClass('errors');
                $('#zipErr').remove();
                return false;
                
            }
        );

    } else if (age < 65 && age > 12 || age === undefined || !$(form).hasClass('over65Check')) {
        
        transmit(urlRec, finalFormData, formItself, formName);
        wt(formDataObj.PrimaryEmail, formDataObj.LanguagePreference);
    }
    
}





function transmit(urlRec, finalFormData, formItself, formName) {
    
    //Sending of data
    $.ajax({
        url: urlRec,
        type: 'POST',
        async: false,
        data:  finalFormData,
        contentType: 'application/json',
        dataType: 'html',
				//headers: {'X-Requested-With': 'XMLHttpRequest'},
        success: function (data) {
        console.log(data);
            
        if (!$('form').hasClass('altSubmit')) {
                
                //$('#loadingImage').hide();
                $(formItself).show();
                $(formItself).replaceWith(function () {return $('#' + formName + 'ty').contents(); });
                $('#' + formName + 'ty').removeClass('hidden-msg');
                
        }
						
						
			  else if ($('form').hasClass('medicare-booklet')) {
                
                //$('#loadingImage').hide();
                $(formItself).show();
                $(formItself).replaceWith(function () {return $('#' + formName + 'ty').contents(); });
                								
							  var gFirstName = $("#first-name").val();
								var gLastName = $("#last-name").val();
								var guserName = gFirstName + " " + gLastName;

								localStorage.setItem("userName", guserName);
								var getUserName = localStorage.getItem("userName");

                $('#medicare-booklet-form').hide();
								$('#' + formName + 'ty').removeClass('hidden-msg'); 

								$("#user-fullname").text(getUserName);
						                
            }
						
				else {
					  $(formItself).show();
            $(formItself).replaceWith(function () {return $('#' + formName + 'ty').contents(); });
            $('#' + formName + 'ty').removeClass('hidden-msg');
					
					}
										
        },
        
				error: function (data) {
										
            console.log(data);
            						
						//$('#loadingImage').hide();
            $(formItself).show();
            $(formItself).replaceWith(function () {return $('#' + formName + 'em').contents(); });						
            $('#' + formName + 'em').removeClass('hidden-msg'); 
						
						
						 /*if (data.indexOf('"Status": "0"') === -1 && !$('form').hasClass('altSubmit')) {
                
                //$('#loadingImage').hide();
                $(formItself).show();
                $(formItself).replaceWith(function () {return $('#' + formName + 'em').contents(); });
                $('#' + formName + 'em').removeClass('hidden-msg');

                
        } */




        }
				
				
    });

}



function removeUndefinedProps(paramVarsObj) {
    for (var prop in paramVarsObj) {
        if (paramVarsObj.hasOwnProperty(prop) && paramVarsObj[prop] === undefined || paramVarsObj[prop] === '') {
            delete paramVarsObj[prop];
        }
    }
}



function getAgeAsOfDate(birthDate, asOfDate) {
    var yearDiff = asOfDate.getFullYear() - birthDate.getFullYear();

    // check if the birthday has not occurred as of the given date
    var birthDayOccurred = false;

    if (birthDate.getMonth() < asOfDate.getMonth()) {
        birthDayOccurred = true;
    }

    if (birthDate.getMonth() == asOfDate.getMonth() && birthDate.getDate() <= asOfDate.getDate()) {
        birthDayOccurred = true;
    }

    if (!birthDayOccurred) {
        yearDiff--;
    }

    return yearDiff;
    
}



function rscRedirect(thisForm, email, state, zip, source) {
    
    if ($(thisForm).hasClass('rep-caller')) {
        
        // Show Thank You Message
        ////////////////////////////
        $(thisForm).hide();
        
        $('.cancel-btn').hide();
        $('#thankyou_message').show();
        $('#continueShopping').click(function(){
            continueShopping(email, state, zip, source);
        });
    
    } else {
    
    continueShopping(email, state, zip, source);
    
    }
        
}

// Send user to Shopping Cart
///////////////////////////////////
function continueShopping(email, state, zip, source) {
	
	var form_cta = $('#form_cta').val();
	
	if ((form_cta == "Ve los precios") || (form_cta == "Compra ya")) {
    
    $("#thankyou_continue #email-value").val(email);
    $("#thankyou_continue #zip-value").val(zip);
    $("#thankyou_continue")
        .attr("action", "https://retailweb.espanol.hcsc.net/retailshoppingcart/" + state + "/public_census?source=" + source )
        .unbind('submit')
        .submit();
		
	}
	
	else {
    
    $("#thankyou_continue #email-value").val(email);
    $("#thankyou_continue #zip-value").val(zip);
    $("#thankyou_continue")
        .attr("action", "https://retailweb.hcsc.net/retailshoppingcart/" + state + "/public_census?source=" + source )
        .unbind('submit')
        .submit();
		
	}
    
}

function wt(Email, LanguagePreference) {
    window.dataLayer={};
	dataLayer.LeadType='PublicSiteWidget';
	dataLayer.Email = Email;
	dataLayer.LanguagePreference = LanguagePreference;
	//dataLayer.PhoneNumber='3126530000';
    Bootstrapper.ensEvent.trigger("PS Lead Submit");
}


