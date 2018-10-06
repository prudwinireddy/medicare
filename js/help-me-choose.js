// JavaScript Document

$('.help-me-choose').h5Validate({
        errorClass: 'errors'
    });
		
		
/*
		function sendData() {
			var dataString = 'name='+ name + '&email=' + email + '&phone=' + phone;
      console.log(dataString);return false;
    $.ajax({
    	type: "POST",
    	url: "",
    	data: dataString,
    	success: function() {
    		$('form.help-me-choose').hide();
				$('#help-me-choose-result').show();
				
      
    		}
  	});
  	return false;	
			
		}

*/


		$('#help-me-choose-send').click(function () {								

		var result = $('form.help-me-choose').h5Validate('allValid');
		
		if (result==true) {
		
    var guserAge = $('input[name=age]:checked').val();
		var guserZip = $('#zip').val();
		var guserCoverage = $('input[name=coverage]:checked').val();
		var guserPriority = $('input[name=priority]:checked').val();
		var guserTravel = $('input[name=travel]:checked').val();
		var guserDrug = $('input[name=drug-coverage]:checked').val();


		localStorage.setItem('userAge', guserAge);
		localStorage.setItem('userZip', guserZip);
		localStorage.setItem('userCoverage', guserCoverage);
		localStorage.setItem('userPriority', guserPriority);
	  localStorage.setItem('userTravel', guserTravel);
		localStorage.setItem('userDrug', guserDrug);

								
		//$('#help-me-choose-result').show();
    //$(formItself).replaceWith('#help-me-choose-result');
								
																
		var getUserAge = localStorage.getItem('userAge');
		var getUserZip = localStorage.getItem('userZip');
		var getUserCoverage = localStorage.getItem('userCoverage');
		var getUserPriority = localStorage.getItem('userPriority');
		var getUserTravel = localStorage.getItem('userTravel');
		var getUserDrug = localStorage.getItem('userDrug');
		

		          
		//if (result === true) {           
        //sendData();
				
				$('form.help-me-choose, #help-me-choose-intro').hide();//remove
				$('#help-me-choose-result').show().focus();//remove
				
				$('html, body').animate({
      	scrollTop: $('#help-me-choose-result').offset().top
    		}, 10);
				
				equalHeight($('#widget-tools .widget-vertical'));
				equalHeight($('.widget-container .widget-vertical'));
				equalHeight($('.horrizontal-layout .button')); 
								
				$('#user-age').text(getUserAge);
				$('#user-zip').text(getUserZip);
				$('#user-coverage').text(getUserCoverage);
				$('#user-priority').text(getUserPriority);
				$('#user-travel').text(getUserTravel);
				$('#user-drug').text(getUserDrug);
									
    //}
			 			
    return false;


		};
							
	  });
		
				
		$('#return-form').click(function () {	
		returnHCform();
				
		return false;		
		
		});
		
		
		$('#reset-form').click(function () {	
		$('form.help-me-choose')[0].reset();		
		returnHCform();
		
		return false;		
		
		});
		
		function returnHCform() {
		$('form.help-me-choose, #help-me-choose-intro').show()//remove
		$('html,body').animate({
   	scrollTop: $('form.help-me-choose').offset().top
		});
		$('#help-me-choose-result').hide();//remove
			
		}
		
