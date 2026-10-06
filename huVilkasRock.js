//https://vdtvilkas.b-cdn.net/VDT/master/ThemeRock/VilkasRock.js
// TuoteryhmÃ¤kuvat
jQuery(function() {
// Piilotetaan etusivulta tuoteryhmÃ¤t, joilla ei ole kuvaa
	jQuery('.start-page .ListItemCategory').each(function(){
		if(jQuery(this).find('.ImageArea').length == 0){
			jQuery(this).parent().remove();
		}
	});
// Poistetaan taulukkorakenne
	jQuery('.start-page .ListItemCategory').appendTo('.CategoryList .CategoryList');
	jQuery('.start-page table.ListItemCategoryTable').remove();

// Etusivun toinen tekstikenttÃ¤ tuoteryhmÃ¤nostojen alle
    jQuery(".start-page table.CategoryBaseTable tr:nth-child(1) td.TextRight").insertAfter(".CategoryList .CategoryList");

// Etusivun neljÃ¤s tekstikenttÃ¤ sivun loppuun
    jQuery(".start-page table.CategoryBaseTable tr:nth-child(2) td.TextRight").insertAfter("div.CategoryProducts");

// Etusivun kolmas tekstikenttÃ¤ sivun loppuun
    jQuery(".start-page table.CategoryBaseTable tr:nth-child(2) td.TextLeft").insertAfter("div.CategoryProducts");
});


// Teksti osta-nappiin
require(['jquery', '$ready!'], function ($) {
  function MangleButtonBasketTitle() {
    $('.ButtonBasket').each(function() {
      $e = $(this);
      $e.html($e.attr('title'));
    });
  }

  MangleButtonBasketTitle();
  $(document).on('facetssearch:loaded', MangleButtonBasketTitle);

});

// Ostoskorilinkin splittaus diveihin
jQuery(document).ajaxComplete(function(event,request,settings){
	if(jQuery('a.basket-icon-link').length){

	var span = jQuery('span.fa-shopping-cart');
	var array = jQuery('.BasketBox a span').text().match(/(\S+ \S+)[\s\n]*(\(\d\))/);
	var text = array[1];
	var number = array[2];
	var new_string = '<div class="basket-txt">' + text + '</div><div class="basket-nbr">' +number + '</div>';
	span.html(new_string);

   }
});


// ajaxify addtobasket
(function ($) {
    $.fn.ajaxifyAddToBasket = function () {

        var target = $(this);

        target.submit(function (e) {
            // prevent default action
            e.preventDefault();
            e.stopPropagation();

            var form = $(this);

            // check if we are already submitting
            if (form.data('submitting')) {
                return;
            }

            // mark that we are already submitting
            form.data('submitting', true);

            var button = form.find('button');
            // prevent double click (busy should be enough, but hey we can overkill ;)
            button.busy('show');
            button.prop("disabled", true);

            var formURL = form.attr("action");
            var postData = form.serializeArray();

            // send our data
            $.ajax({
                url: formURL,
                type: "POST",
                data: postData
            })
                .done(function (data, textStatus, jqXHR) {
                    // replace basket nav element with the returned data
                    var newNavData = $(data).find('.BasketBox');
                    $('.BasketBox').replaceWith(newNavData);

					console.error('data');
					console.error($(data).find('.BasketTable'));

                    // the theme has some extra bits for the basket styling, redo them here
                    // set number for basket icon
                    var $basket = $('.BasketBox span:first-child'),
                        basketCount = /[0-9]{1,}|0/.exec($basket.text());

                    // get the number of articles inside the basket
                    if (basketCount !== null && parseInt(basketCount[0]) > 0) {
                        $basket.addClass('hasProducts');
                    }
                    $('.BasketBox span:last').addClass('fa fa-shopping-cart');

                    // show a "product added" popover

					// add our wrapper if its not there already
					if($('.BasketBox #BasketOverLay').length == 0) {
						$('.BasketBox').append('<div id="BasketOverLay"></div>');
					};
					var overLay = $('.BasketBox #BasketOverLay');
					overLay.html(""); // clear it
					
					// copy basket data to popover
					$( ".basket-icon-link" ).clone().appendTo( "#BasketOverLay" );

					//move OverLay to top
					jQuery(function() { 
					   jQuery('#BasketOverLay').prependTo('.GeneralLayout');
					}); 
					
					
					// timout for removing the "popup"
					window.setTimeout(function() { $(' #BasketOverLay').remove(); }, 4000);
					


                })

                .always(function (jqXHR, textStatus, errorThrown) {
                    // clean up
                    button.busy('hide');
                    button.prop("disabled", false);
                    form.data('submitting', false);

                });


        });

        return this;

    };


}(jQuery));
require(["jquery", "ep/fn/busy", "$ready!"], function ($) {
    // product page
    $("form#basketForm_standalone").ajaxifyAddToBasket();
    // product listings
    $("form.AddToBasketForm").ajaxifyAddToBasket();
});


// Hakusuodatin
jQuery.ready(function($) {
  jQuery('#RemoteSearchFacets').addClass('Collapsed');
  	if ( jQuery('html').attr('lang') == 'fi' ) {
   		jQuery('#RemoteSearchFacets').prepend('<div class="FacetsToggle"><a href="#">Suodata tuotteita <i class="fa fa-sliders"></i></a></div>')
   	} else {
	  	jQuery('#RemoteSearchFacets').prepend('<div class="FacetsToggle"><a href="#">Filter <i class="fa fa-sliders"></i></a></div>')          
   }
  jQuery('#RemoteSearchFacets .FacetsToggle').click(function(event) {
     jQuery('#RemoteSearchFacets').toggleClass('Collapsed', 200);
     event.preventDefault();
  });
});
// Roof linkit mobiilissa
jQuery.ready(function($) {
  jQuery('.NavBarRoof.HorizontalNavBar .custom-right').addClass('Collapsed');
  jQuery('.NavBarRoof.HorizontalNavBar .custom-right').prepend('<div class="RoofToggle"><a href="#"><i class="fas fa-ellipsis-v"></i></a></div>') 
  jQuery('.NavBarRoof.HorizontalNavBar .custom-right .RoofToggle').click(function(event) {
     jQuery('.NavBarRoof.HorizontalNavBar .custom-right').toggleClass('Collapsed', 200);
     event.preventDefault();
  });
});

jQuery(document).ajaxComplete(function(event,request,settings){
  if(jQuery(window).width() < 769) {
    jQuery('#RemoteSearchFacets').appendTo('.CategoryList .CategoryText')
  }
});

// Ristiinmyynnin kuvien suurentaminen
jQuery(function() {
  jQuery('div.CrossellingImageArea a img').each(function() {
	var e = jQuery(this);
	var src = e.attr('src');
	src = src.replace('_s.','_m.');
	e.attr('src', src);
  });
});

// Some
jQuery(function() { 
    jQuery("div.SocialMedia").appendTo("div.ContentAreaWrapper");
});
