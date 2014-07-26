$(document).load().scrollTop(0);

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