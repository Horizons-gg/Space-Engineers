$(document).ready(function(){
    "use strict"; 
    
    // NAVBAR RESIZE FUNCTION
    $(window).scroll( function() {
        var value = $(this).scrollTop();
        if ( value > $(window).height() * 1 )
            $(".navbar-dark").addClass("scrolled");
        else
            $(".navbar-dark").removeClass("scrolled");
    });
    
    // COOKIES NOTIFICATION
    $('.cookies-bar').addClass('open'); // Bring up notification bar
    $('#cookies-close').on("click", function () { 
        $('.cookies-bar').addClass('closed'); // Close notification bar when "accept cookies" button is cicked
    });
                            
    // HAMBURGER MENU ANIMATION
    	$('#hamburger').on("click", function(){
            $(this).toggleClass('open');
        });
    
    // SMOOTH SCROLLING TO ANCHORS
        $('a[href*=\\#]:not([href=\\#]):not(.control-right, .control-left)').on('click', function() {
            if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                  scrollTop: target.offset().top - 100
                }, 1000);
            return false;
          }
        }
      }); 
    
    // LAZY LOADING IMAGES
    var bLazy = new Blazy();
    
    // VIDEO LIGHTBOX
    $(".js-video-button").modalVideo();
    
    // FEATURE CARD ANIMATION
    $(".feature-card").on({
    mouseenter: function () {
        //stuff to do on mouse enter
        $(this).addClass('card-active');
    },
    mouseleave: function () {
        //stuff to do on mouse leave
        $(this).removeClass('card-active');
    }
    });
    
    // ANIMATIONS
    var $animation_elements = $('.animation-element');
    var $window = $(window);

    function check_if_in_view() {
        var window_height = $window.height();
        var window_top_position = $window.scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        $.each($animation_elements, function() {
            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top_position = $element.offset().top + 150;
            var element_bottom_position = (element_top_position + element_height);

            //check to see if this current container is within viewport
            if ((element_bottom_position >= window_top_position) &&
            (element_top_position <= window_bottom_position)) {
                $element.addClass('in-view');
            }
      });
    }
    $window.on('scroll resize', check_if_in_view);
    $window.trigger('scroll');
    
    // LIGHTBOX OPTIONS
     lightbox.option({
        'resizeDuration': 300,
        'imageFadeDuration': 300,
        'wrapAround': true
    });
    
    // NEWSLETTER SIGNUP SCRIPTS
    $("#newsletter").validator().on("submit", function(event) {
        if (event.isDefaultPrevented()) {
            // handle the invalid form...
            signupError();
            signupMSG(false, "Did you fill in the form properly?");
        } else {
            // everything looks good!
            event.preventDefault();
            submitSignup();
        }
    });

    function submitSignup() {
        // Initiate Variables With Form Content
        var emailsign = $("#emailsign").val();


        $.ajax({
            type: "POST",
            url: "php/newsletter-process.php",
            data: "&emailsign=" + emailsign,
            success: function(text) {
                if (text === "success") {
                    signupSuccess();
                } else {
                    signupError();
                    signupMSG(false, text);
                }
            }
        });
    }

    function signupSuccess() {
        $("#newsletter")[0].reset();
        signupMSG(true, "Awesome! Thank you for subscribing!")
    }

    function signupError() {
        $("#newsletter").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
    }

    function signupMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated text-success";
        } else {
            var msgClasses = "h3 text-center text-danger";
        }
        $("#msgSignup").removeClass().addClass(msgClasses).text(msg);
    }
            
    //PRIVACY FORM SCRIPTS
    $("#privacyForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            pformError();
            psubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            psubmitForm();
        }
    });

    function psubmitForm() {
        // initiate variables with form content
		var name = $("#pname").val();
		var email = $("#pemail").val();
        var select = $("#pselect").val();
        var terms = $("#pterms").val();
        
        $.ajax({
            type: "POST",
            url: "php/privacyform-process.php",
            data: "name=" + name + "&email=" + email + "&select=" + select + "&terms=" + terms, 
            success: function(text) {
                if (text == "success") {
                    pformSuccess();
                } else {
                    pformError();
                    psubmitMSG(false, text);
                }
            }
        });
	}

    function pformSuccess() {
        $("#privacyForm")[0].reset();
        psubmitMSG(true, "Request Submitted!");
        $("input").removeClass('notEmpty'); // resets the field label after submission
    }

    function pformError() {
        $("#privacyForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function psubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#pmsgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
    
    //COPYRIGHT YEAR
    var date = new Date().getFullYear();
    document.getElementById("year").innerHTML = date;
    
});