//https://vdtvilkas.b-cdn.net/VDT/master/SnippetFlexslider/flexslider-install.js

/* Add extraBnr before Middle and append the slider into it */
jQuery(document).ready(function() {
    jQuery('<div class="extraBnr"></div>').insertBefore('.start-page .Middle');
    jQuery('.flexslider').appendTo('.extraBnr');
});

/* Settings for flexslider - check http://flexslider.woothemes.com/index.html for more options */
jQuery(document).ready(function() {
  jQuery('.flexslider').flexslider({
    animation: "slide"
  });
});
