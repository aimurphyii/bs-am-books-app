'use strict';
function myFunction() {
  let hamMenu = $('#burgerMenu')[0];
  if (hamMenu.className === 'topnav') {
    hamMenu.className += ' responsive';
  } else {
    hamMenu.className = 'topnav';
  }
}

// this says that when the doc loads, id button form will hide, and toggle hidden?
$(document).ready(function(){
  $('#buttonForm').click(function(){
    $('#hidden').toggle();
  });
});

// this will make things display-- first hide...on click it will toggle display or hide
$(document).ready(function(){
  $('.hide').hide();
  $('.showhidden').on('click', function(){
    $(this).next().slideToggle();
  });
});
