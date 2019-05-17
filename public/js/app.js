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

// this will make things display. on click it will remove the class from the following element
$('.hide-n-seek').on('click', function(){
  $(this).next().removeClass('hide');
});