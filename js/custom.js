//DROPDOWN HANDLER


$(document).click(function(e){
  if($(e.target).attr('data-close')){
    closeAll();
  }

  if($(e.target).hasClass('dropdown-toggle')){
    dropDownHandler(e.target);
  } else if($(e.target).parents().hasClass('dropdown-menu') || $(e.target).hasClass('dropdown-menu')) {
      var target = $(e.target);
      var hasDataClose = $(target).is('[data-close]');
        if(hasDataClose == true){
          closeAll();
        }
  } else {
    closeAll();
  }

});



$('.main-table').each(function () {
	$(this).wrap('<div class="table-wrapper" ></div>');
	
	var copy = $(this).clone(true).addClass('clone').attr("aria-hidden","true");
  $(this).parent().parent('.table-container').append(copy);
});



function dropDownHandler(element){

  var activeButton = element;
  var partner = '#' + $(element).attr('data-pair');

  var toggleHeight = $(element).outerHeight();
  var toggleWidth = $(element).outerWidth();
  var toggleY = $(element).position().top;
  var toggleX = $(element).position().left;

  var partnerWidth = $(partner).outerWidth();
  var left = toggleWidth + toggleX - 320;

  if(!$(activeButton).hasClass('active')){

    if($(window).outerWidth() < 640){
      $(partner).css({'top': toggleHeight + toggleY, 'width':'100%', 'right':'0'});
    }
	
	else {
      $(partner).css({'top': toggleHeight + toggleY, 'left': left, 'width':'320px'});
    }

    closeAll();
    $(partner).show();
    $(activeButton).addClass('active');

  } 
  
  else if ($('.dropdown-toggle').hasClass('active')) {

    closeAll();

  } else {
    $(partner).hide();
    $(activeButton).removeClass('active');
  }



  $(window).resize(function(){

    var toggleHeight = $(activeButton).outerHeight();
    var toggleWidth = $(activeButton).outerWidth();
    var toggleY = $(activeButton).position().top;
    var toggleX = $(activeButton).position().left;

    if($(window).outerWidth() < 640){
      $(partner).css({'top': toggleHeight + toggleY, 'width':'100%', 'left':'0'});
    } else {
      $(partner).css({'top': toggleHeight + toggleY, 'left': toggleWidth + toggleX - 320, 'width':'320px'});
    }
  })

}



function closeAll(){
  $('.dropdown-toggle').removeClass('active');
  $('.dropdown-menu').hide();
}




//Automatic Off-canvas addtions
$('body').wrapInner('<div class="off-canvas-wrapper"><div class="off-canvas-content" data-off-canvas-content>');
$('.off-canvas-wrapper').prepend('<div class="off-canvas position-left" id="offCanvas" data-off-canvas data-auto-focus="false" ><div id="mobile-nav"></div></div>');


//Load Mobile menu AFTER offcanvas is created
$("#mobile-nav-module").appendTo("#mobile-nav");
$("#mobile-nav-module").show();
//$('#mobile-nav').foundation();








/****************************************   START   ********************************************/
/*This section is for individual elements that need special treatment for external link icons*/
/**********************************************************************************************/

//Add external pdf link information to target blank anchors

$('a[href$=".pdf"]').each(function(){
  $(this).removeClass('external-link');
   addOrphanPdf(this);
});

$('main a[target="_blank"]').not('.button').not('a[href$=".pdf"]').each(function() {
  $(this).removeClass('external-link');
  addOrphan(this);
  inputButtonCheck(this); //check if the external icons are inside of input-buttonse
});

$('#banner a[target="_blank"]').not('.button').not('a[href$=".pdf"]').each(function() {
  $(this).removeClass('external-link');
  addOrphanWhite(this);
  inputButtonCheck(this); //check if the external icons are inside of input-buttons
});

$('a.button.secondary-blue[target="_blank"]').not('a[href$=".pdf"]').each(function() {
  $(this).removeClass('external-link');
  addOrphanWhiteButton(this);
  inputButtonCheck(this); //check if the external icons are inside of input-buttons
	$(this).mouseover(function() { 
	$(this).children('.external-link-white').removeClass('external-link-white').addClass('external-link');
	});
	$(this).mouseout(function() { 
	$(this).children('.external-link').removeClass('external-link').addClass('external-link-white');
	});	
});


$('a.button.secondary[target="_blank"]').not('a[href$=".pdf"]').each(function() {
  $(this).removeClass('external-link');
  addOrphan(this);
  inputButtonCheck(this); //check if the external icons are inside of input-buttons
});

$('a.button[target="_blank"]').not('.secondary').not('.secondary-blue').each(function() {
  $(this).removeClass('external-link');
  addOrphan(this);
  inputButtonCheck(this); //check if the external icons are inside of input-buttons
	
	$(this).mouseover(function() { 
	$(this).children('.external-link').removeClass('external-link').addClass('external-link-white');
	});
	$(this).mouseout(function() { 
	$(this).children('.external-link-white').removeClass('external-link-white').addClass('external-link');
	});		
});

$('footer a[target="_blank"]').not('.social-list a').not('a[href$=".pdf"]').each(function() {
  $(this).removeClass('external-link');
  addOrphanWhite(this);
  inputButtonCheck(this); //check if the external icons are inside of input-buttons
});




/****************************************   END    ********************************************/
/*This section is for individual elements that need special treatment for external link icons*/
/**********************************************************************************************/



//check if the external icons are inside of input-buttons
function inputButtonCheck(element){

  if($(this).find('input').length !== 0){
    //remove original icon
    $(this).addClass('no-icon');

    //check if it is a pdf or external link
    if($(this).attr('href').indexOf('.pdf') > -1){
      $(this).addClass('pdf-button-icon');
    } else {
      $(this).addClass('ext-button-icon');
    }
  }
}


$('.external-link').attr('aria-describedby','leaving-website-msg');
$('.external-link-white').attr('aria-describedby','leaving-website-msg');



//This code makes it so a external icon is attached to the last word and jumps lines with the word
function addOrphan(orphan){

  if($(orphan).attr('href') == "members.hcsc.net"){
    return;
  }
    var $this = $(orphan), text=$(orphan).html().trim(), words = text.split(/\s+/);
    var lastWord = words.pop();
    words.push('<span class="external-link">' + lastWord + '</span>');
    $(orphan).html(words.join(' '));
}

//This code makes it so a external icon is attached to the last word and jumps lines with the word
function addOrphanWhite(orphan){

  if($(orphan).attr('href') == "members.hcsc.net"){
    return;
  }
  var $this = $(orphan), text=$(orphan).html().trim(), words = text.split(/\s+/);
  var lastWord = words.pop();
  words.push('<span class="external-link-white">' + lastWord +'</span>');
  $(orphan).html(words.join(' '));         
}


//This code makes it so a external icon is attached to the last word and jumps lines with the word
function addOrphanWhiteButton(orphan){
  var $this = $(orphan), text=$(orphan).text().trim(), words = text.split(/\s+/);
  var lastWord = words.pop();
  words.push('<span class="external-link-white">' + lastWord +'</span>');
  $(orphan).html(words.join(' '));

  //This checks if theres a capitalized SM in the button text and adds superscripts
  if (orphan.text.indexOf("SM") >= 0){
    $(orphan).html(
      $(orphan).html()
          .replace(/((?!<sup>\s*))SM((?!\s*<\/sup>))/gi, '<sup>SM</sup>') // wrap SM if not wrapped yet
      );
  }

  //This checks if theres a capitalized TM in the button text and adds superscripts
  if (orphan.text.indexOf("TM") >= 0){
    $(orphan).html(
      $(orphan).html()
          .replace(/((?!<sup>\s*))TM((?!\s*<\/sup>))/gi, '<sup>TM</sup>') // wrap TM if not wrapped yet
      );
  }

  //This checks if theres a reg, trade, or copy in the button text and adds superscripts
  $(orphan).html(
    $(orphan).html()
      .replace(/((?!<sup>\s*))&reg;((?!\s*<\/sup>))/gi, '<sup>&reg;</sup>') // wrap &reg; if not wrapped yet
      .replace(/((?!<sup>\s*))®((?!\s*<\/sup>))/gi, '<sup>&reg;</sup>') // wrap ® if not wrapped yet

      .replace(/((?!<sup>\s*))&trade;((?!\s*<\/sup>))/gi, '<sup>&trade;</sup>') // wrap &trade; if not wrapped yet
      .replace(/((?!<sup>\s*))™((?!\s*<\/sup>))/gi, '<sup>&trade;</sup>') // wrap ™ if not wrapped yet

      .replace(/((?!<sup>\s*))&copy;((?!\s*<\/sup>))/gi, '<sup>&copy;</sup>') // wrap &copy; if not wrapped yet
      .replace(/((?!<sup>\s*))©((?!\s*<\/sup>))/gi, '<sup>&copy;</sup>') // wrap © if not wrapped yet
    );
}


//This code makes it so a external pdf icon is attached to the last word and jumps lines with the word
function addOrphanPdf(orphan){
  var $this = $(orphan), text=$(orphan).text().trim(), words = text.split(/\s+/);
  var lastWord = words.pop();
  words.push('<span class="external-link-pdf">' + lastWord +'</span>');
  $(orphan).html(words.join(' '));     
        //This checks if theres a capitalized SM in the button text and adds superscripts
  if (orphan.text.indexOf("SM") >= 0){

    //This IF statement can contain acronyms that break the SM rule for links i.e. CISM
      if (orphan.text.indexOf("CISM") >= 0){
        return false;
      } else {
      $(orphan).html(
        $(orphan).html().replace(/((?!<sup>\s*))SM((?!\s*<\/sup>))/gi, '<sup>SM</sup>')// wrap SM if not wrapped yet
      );

    }
  }

  //This checks if theres a capitalized TM in the button text and adds superscripts
  if (orphan.text.indexOf("TM") >= 0){
    $(orphan).html(
      $(orphan).html()
          .replace(/((?!<sup>\s*))TM((?!\s*<\/sup>))/gi, '<sup>TM</sup>') // wrap TM if not wrapped yet
      );
  }

  //This checks if theres a reg, trade, or copy in the button text and adds superscripts
  $(orphan).html(

    $(orphan).html()
      .replace(/((?!<sup>\s*))&reg;((?!\s*<\/sup>))/gi, '<sup>&reg;</sup>') // wrap &reg; if not wrapped yet
      .replace(/((?!<sup>\s*))®((?!\s*<\/sup>))/gi, '<sup>&reg;</sup>') // wrap ® if not wrapped yet

      .replace(/((?!<sup>\s*))&trade;((?!\s*<\/sup>))/gi, '<sup>&trade;</sup>') // wrap &trade; if not wrapped yet
      .replace(/((?!<sup>\s*))™((?!\s*<\/sup>))/gi, '<sup>&trade;</sup>') // wrap ™ if not wrapped yet

      .replace(/((?!<sup>\s*))&copy;((?!\s*<\/sup>))/gi, '<sup>&copy;</sup>') // wrap &copy; if not wrapped yet
      .replace(/((?!<sup>\s*))©((?!\s*<\/sup>))/gi, '<sup>&copy;</sup>') // wrap © if not wrapped yet

      );    
}

var state,
    pgURL = window.location.href;


//BAM SUBMISSION CODE
function submitBam() {	

		if (pgURL.indexOf('bcbsnm') > -1) {
        state = "NM1";
        } else if (pgURL.indexOf('bcbsmt') > -1) {
        state = "MT1";
        }  else if (pgURL.indexOf('bcbsok') > -1) {
        state = "OK1";
        }  else if (pgURL.indexOf('bcbstx') > -1) {
        state = "TX1";
        } else {
            state = "IL1";
        }
	
		if ($(document).width() > 640){
			$("#BamLogin").attr("action","https://members.hcsc.net/wps/PA_BAMLogin/bamGateway?corpEntCode=" + state).submit();
		}else {
			$("#BamLogin").attr("action","https://members.hcsc.net/wps/PA_BAMLogin/bamGateway?corpEntCode=" + state).submit();
		}
}

//RETURNING SHOPPER LOGIN AND SubmitSHOPPER() FUNCTION {


function returningLogin() {
var rscRedirectURL = "https://retailweb.hcsc.net/retailshoppingcart/" + thisRSCState + "/welcome.html";
var rscRedirectState = thisRSCState;
var rscForgotUsername = "https://retailweb.hcsc.net/retailshoppingcart/" + thisRSCState + "/retrieveUsername";
var rscForgotPassword = "https://retailweb.hcsc.net/retailshoppingcart/" + thisRSCState + "/resetPassword";

$("#redirectUrl").attr("value",rscRedirectURL);
$("#state").attr("value",rscRedirectState);
$("#forgotUserName").attr("href",rscForgotUsername);
$("#forgotPassword").attr("href",rscForgotPassword);

$("#submit-shopper").click(function() {
	$("#returning_shopper_login").attr("action","https://retailweb.hcsc.net/retailshoppingcart/public/login").submit();
	return false;
	});
}


if (pgURL.indexOf('bcbsil') > -1) {
var thisRSCState = "IL";
returningLogin();
}
 
else if (pgURL.indexOf('bcbsnm') > -1) {
var thisRSCState = "NM";
returningLogin();
} 
				
else if (pgURL.indexOf('bcbsmt') > -1) {
var thisRSCState = "MT";
returningLogin();
}  

else if (pgURL.indexOf('bcbsok') > -1) {
var thisRSCState = "OK";
returningLogin();
}  

else if (pgURL.indexOf('bcbstx') > -1) {
var thisRSCState = "TX";
returningLogin();
} 

else {
var thisRSCState = "IL";
returningLogin();
}




//check if homepage has content modules and add margin to footer if there are none
/*if($("#buckets-3").length == 0 && $("#buckets-2").length == 0 && $("#single").length == 0) {
  $('footer').css('margin-top','4rem');
}*/

$('#banner-carousel #alert-box').appendTo('.orbit-slide .row');


//Remove TreeView from LeftNav on page load to show applicable links to screen reader
//$('#left-nav ul').attr('role','');


function equalHeight(group) {
    if($(window).outerWidth() >= 640){
      group.css("height","auto");
      tallest = 0;
      group.each(function() {
        thisHeight = $(this).height();
          if(thisHeight > tallest) {
          tallest = thisHeight;
          }
      });
      group.height(tallest);
    } else {
      group.css("height","auto");
    }
  }


$(document).ready(function(){
  //AUTOMATIC HEIGHT

  //Elements that need to be equal height
  equalHeight($("#buckets-3 .card"));
  equalHeight($("#buckets-2 .card"));
  equalHeight($(".orbit-slide"));
	
	equalHeight($("#widget-tools .widget-vertical"));
	equalHeight($(".widget-container .widget-vertical"));
	equalHeight($(".horrizontal-layout .button"));
	
    
	
  var winWidth = $(window).innerWidth();
	//var mobile = winWidth <= 639; 
  var ipadMobile = winWidth < 1023;
	var bannerImgHeight = $('#banner-rightCol').outerHeight();
	var bannerContentHeight = $('#banner-leftCol').outerHeight();
	var topValue = (bannerImgHeight - bannerContentHeight) / 2 + "px";
	
    
    //BANNER
	if (ipadMobile == true){		
		$('#banner-leftCol').css("top", "0px");
	}
	
	else {
		if (bannerImgHeight > bannerContentHeight){
		
		$('#banner-leftCol').css("top", topValue);	
		}
		else {
			$('#banner-leftCol').css("top", "0px");
			}
		
	}	    
	

  //Elements that need special treatment on page resize, autoheight removed on screens less than 1024px wide
  $(window).resize(function() {
	  var winWidth = $(window).innerWidth();
	  var bannerImgHeight = $('#banner-rightCol').outerHeight();
	  var bannerContentHeight = $('#banner-leftCol').outerHeight();
	  var topValue = (bannerImgHeight - bannerContentHeight) / 2 + "px";
     
	  equalHeight($("#buckets-3 .card"));
    equalHeight($("#buckets-2 .card"));
    equalHeight($(".orbit-slide"));
	  
	  equalHeight($(".widget-container .widget-vertical"));
		equalHeight($("#widget-tools .widget-vertical"));
		
		equalHeight($(".horrizontal-layout .button"));
	  
 	//BANNER
	if (winWidth < 1023){		
		$('#banner-leftCol').css("top", "0px");
	}

	else {
		
		if (bannerImgHeight > bannerContentHeight){
		
		$('#banner-leftCol').css("top", topValue);	
		}
		else {
			$('#banner-leftCol').css("top", "0px");
			}
	}	   
		 
	  
  });


 
	
}); //end document ready


//If there are two client logos in the top bar, this code puts them on a new line and centers everything on smaller screens
if($("#logo-bar img").length >= 3 ){

    $('#main-logo').removeClass('small-8');
    $('#main-logo').addClass('small-12');
    $('#main-logo').addClass('text-center');

    $('#client-logo').removeClass('small-4');
    $('#client-logo').addClass('small-12');
    $('#client-logo').addClass('text-center');
    $('#client-logo').addClass('double-logo');
    
} else {
    //if there is only 1 logo, it adjusts to the right
    $('#client-logo').addClass('text-right');
}

if ($('#search-bar').length == 0 ){
    $('#client-logo').removeClass('large-5');
    $('#client-logo').addClass('large-8');
}


function customTab() {
$('.tab-toggle-button > li > a').click(function() {
event.stopPropagation();

$(this).parent().parent().parent().find('.tab-content-box').removeClass('is-active');
var gt = $(this).attr('href');
//console.log(gt);
$(gt).addClass('is-active');


$(this).parent().parent().parent().find('.tab-toggle-button > li > a.is-active').removeClass('is-active');
$(this).addClass('is-active');

return false;
});



$('.container').attr('role','');
$('.tab-toggle-button').attr('role','tablist');
$('.tab-toggle-button > li > a').attr('role','tab');
$('.tab-content-box').attr('role','tabpanel');
}

/*styles*/
$('.pdf-name').each(function () {
	$(this).parent('p').css('margin','0');
});

$('.pdf-doc:last-child').each(function () {
	$(this).parent('p').css('margin-bottom','2rem');
});



customTab();


//Brightcove JS
brightcove.createExperiences();



//DOI & Material ID
if (document.documentElement.lang === 'en') {
$('#en-non-discrimination, #en-material-id').css('display','block');


if($(window).outerWidth() < 640){
	$('#doi-id-en-mb').css('display','block');
} else {
  $('#doi-id-en').css('display','block');
}
}

else if (document.documentElement.lang === "es") {
$('#es-non-discrimination, #es-material-id').css('display','block');


if($(window).outerWidth() < 640){
	$('#doi-id-es-mb').css('display','block');
} else {
  $('#doi-id-es').css('display','block');
}
}

else {
$('#es-material-id').css('display','none');	
$('#en-material-id').css('display','block');
}


