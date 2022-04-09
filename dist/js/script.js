"use strict";

// jQuery( function( $ ) {$( ".p-hamburger" ).on( "click", function() {$( this ).toggleClass( "is-open" );$( ".p-gmenu" ).toggleClass( "is-open" );
//          $( "body" ).toggleClass( "is-open" );   
//          } );} );
$(".p-hamburger").click(function () {
  $(".p-hamburger").toggleClass("is-open"); // $(".l-sidebar").css("transition","0.5s")
});
$(".p-gmenu--btn").click(function () {
  $(".p-header__nav--sp,body").toggleClass("is-active"); // $(".l-sidebar").css("transition","0.5s")
});
var windowWidth = $(window).width();
$(window).resize(function () {
  var ww = $(window).width();

  if (windowWidth !== ww) {
    $(".p-header__nav--sp").removeClass("is-active");
    $(".p-hamburger").removeClass("is-open");
  }
});
!function () {
  var viewport = document.querySelector('meta[name="viewport"]');

  function switchViewport() {
    var value = window.outerWidth > 360 ? 'width=device-width,initial-scale=1' : 'width=360';

    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  }

  addEventListener('resize', switchViewport, false);
  switchViewport();
}();
$(window).on("load scroll", function () {
  var $header = $(".p-header__nav");

  if ($(window).scrollTop() > 200) {
    $header.addClass("sticky");
  } else {
    $header.removeClass("sticky");
  }
});