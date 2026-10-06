//https://vdtvilkas.b-cdn.net/VDT/master/hockeyunlimited.fi/hockeyunlimited.js
/* hockey unlimited js */

jQuery.ready(function ($) {
  // Move the footer nav element into the custom footer container and pull the
  // payment/partner logo up above the bottom nav bar.
  jQuery("#NavElement_40949907").appendTo(".Footer .SizeContainer.custom-container.custom-left");
  jQuery("#NavElement_40949911 > div > ul:nth-child(3) > li > img").prependTo(".NavBarBottom");
  jQuery("div.FooterContainer > div.NavBarBottom.HorizontalNavBar > img").css("display", "block");
  jQuery("div.FooterContainer > div.NavBarBottom.HorizontalNavBar > img").css("margin", "35px auto 10px");
});

jQuery.ready(function ($) {
  // On the start page, build the "recommended products" carousel area and move
  // the Instagram widget below the category products.
  if (jQuery(".start-page").length) {
    jQuery("#CategoryProducts").before('<div class="Suosituimmat"></div> ');

    jQuery(".FourPoints").insertAfter("#CategoryProducts");
    jQuery(".lightwidget-widget").insertAfter("#CategoryProducts");
    jQuery(".lightwidget-widget").before("<h2>@hockey_unlimited_pro_shop</h2>");
  }
});

jQuery.ready(function () {
  // Localized "SALE" badge and heading above the recommended products.
  if (epConfig.language == "fi") {
    jQuery(".LineThrough").after('<div class="Tarjous">ALE</div>');
    jQuery("<h2>Suositut tuotteet</h2>").insertBefore(".start-page div.Suosituimmat");
  }
  if (epConfig.language == "en") {
    jQuery(".LineThrough").after('<div class="Tarjous">SALE</div>');
    jQuery("<h2>Recommended</h2>").insertBefore(".start-page div.Suosituimmat");
  }
  if (epConfig.language == "ru") {
    jQuery(".LineThrough").after('<div class="Tarjous">SALE</div>');
    jQuery("<h2>Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÐµÐ¼</h2>").insertBefore(".start-page div.Suosituimmat");
  }
});

// Highlight sale prices (those with a struck-through original price) in red,
// across product listings, the product page, and the hot deals carousel.
function highlightSalePrices() {
  jQuery(".ProductListImageBox td span.LineThrough").each(function () {
    jQuery(this).parents(".InfoArea").find(".price-value").css("color", "#ff0000");
  });
  jQuery(".PriceContainer span.LineThrough").each(function () {
    jQuery(this).parents(".PriceContainer").find(".price-value").css("color", "#ff0000");
  });
  jQuery(".HotDeal span.LineThrough").each(function () {
    jQuery(this).parents(".HotDealFoot").find(".price-value").css("color", "#ff0000");
  });
}

// Run on initial load and again whenever AJAX swaps in new content.
jQuery.ready(highlightSalePrices);
jQuery(document).ajaxComplete(highlightSalePrices);

jQuery(document).ready(function () {
  // Add a search toggle button that collapses/expands the search box.
  jQuery(".Div .NavBarTop .SizeContainer").append('<div class="SearchToggle"><a href="#"></a></div>');
  jQuery(".SearchElement").addClass("Collapsed");
  jQuery(".SearchElement").css("visibility", "visible");

  jQuery(".SearchToggle").click(function (event) {
    jQuery(".SearchElement").toggleClass("Collapsed", 400);
    event.preventDefault();
  });
});

require(["jquery", "https://vdt.vilkas.fi/VDT/master/SnippetSlickslider/slick.min.js", "$ready!"], function ($) {
  // Turn the hot deals list into a responsive slick carousel on the start page.
  if (jQuery(".start-page").length) {
    setTimeout(function () {
      jQuery(".HotDealList").slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 3,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }, 1500);
  }
});

jQuery(function () {
  // Apply the Russian font to the whole page for the Russian locale.
  if (epConfig.language == "ru") {
    jQuery("*").addClass("RussianFont");
  }
});

jQuery(function () {
  // Force the shop logo to the hosted PNG.
  jQuery(".ShopLogo img").attr("src", "https://www.hockeyunlimited.fi//WebRoot/vilkasfi01/Shops/2014061601/MediaGallery/Logo.png");
});

// Currency selection as a dropdown menu.
require(["jquery", "$ready!"], function ($) {
  var Currency = $(".Price span[itemprop=priceCurrency]:lt(1)").text();

  // Create the dropdown base.
  if ($(".Price").length) {
    $("<select id='CurSelect' />").appendTo(".Header .custom-right");

    // Default option showing the current currency.
    $("<option />", {
      "selected": "selected",
      "value": "",
      "text": Currency
    }).appendTo("select#CurSelect");

    // Populate the dropdown from the currency menu items.
    $("div#NavElement_52714512 .ContextBoxBody a").each(function () {
      var el = $(this);
      $("<option />", {
        "value": el.attr("href"),
        "text": el.text()
      }).appendTo("select#CurSelect");
    });

    // Navigate to the selected currency's URL on change.
    $("select#CurSelect").change(function () {
      window.location = $(this).find("option:selected").val();
    });
  }

  $("div#NavElement_52714512").remove();
});
