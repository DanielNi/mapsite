$(function(){
	$('#header_nav').data('size','big');
});

$(window).scroll(function(){
	if ($(document).scrollTop() > 75)
	{
		if ($('#header_nav').data('size') === 'big')
		{
			$('#header_nav').data('size','small');
			$('#header_nav').stop().animate({
				height:'50px'
			},600);
			$('.navbar-brand').stop().animate({
				fontSize:'20px',
				marginTop:'0px'
			},600);
			$('#menu').stop().animate({
				fontSize:'14px',
				marginTop:'0px'
			},600);
		}
	}
	else
	{
		if ($('#header_nav').data('size') === 'small')
		{
			$('#header_nav').data('size','big');
			$('#header_nav').stop().animate({
				height:'80px'
			},600);
			$('.navbar-brand').stop().animate({
				fontSize:'35px',
				marginTop:'15px'
			},600);
			$('#menu').stop().animate({
				fontSize:'20px',
				marginTop:'15px'
			},600);
		}  
	}
});

var showing_login = false;
var showing_register = false;

$('.overlay').on('click', function() {
	if ($('#login_frame').is(":visible")) {
		$('#login_frame').fadeOut();
		$('.overlay').fadeOut();
	}
	if ($('#register_frame').is(':visible')) {
		$('#register_frame').fadeOut();
		$('.overlay').fadeOut();
	}
});

$('.login').on('click', function() {
	if (!$('#login_frame').is(':visible')) {
		$('#login_frame').fadeIn();
		$('.overlay').fadeIn();
	}
});

$('.btn-primary').on('click', function() {
	if (!$('#register_frame').is(':visible')) {
		$('#register_frame').fadeIn();
		$('.overlay').fadeIn();
	}
})