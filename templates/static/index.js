var index = (function($) {

	var elements = {
		acquire:function() {
			this.window 		= $(window);
			this.document		= $(document);
			this.header_nav		= $('#header_nav');
			this.navbar_brand	= $('.navbar-brand');
			this.menu			= $('#menu');
			this.overlay		= $('.overlay');
			this.login 			= $('.login');
			this.login_frame	= $('#login_frame');
			this.btn_primary	= $('.btn-primary');
			this.register_frame = $('#register_frame');	
		}
	};

	var ev = {
		bind:function() {
			elements.window.scroll(ev.change_header_size);
			elements.login.on('click', ev.show_login);
			elements.btn_primary.on('click', ev.show_register);
			elements.overlay.on('click', ev.close_everything);
		},

		change_header_size:function() {
			if (elements.document.scrollTop() > 75)
			{
				if (elements.header_nav.data('size') === 'big')
				{
					elements.header_nav.data('size','small');
					elements.header_nav.stop().animate({
						height:'50px'
					},600);
					elements.navbar_brand.stop().animate({
						fontSize:'20px',
						marginTop:'0px'
					},600);
					elements.menu.stop().animate({
						fontSize:'14px',
						marginTop:'0px'
					},600);
				}
			}
			else
			{
				if (elements.header_nav.data('size') === 'small')
				{
					elements.header_nav.data('size','big');
					elements.header_nav.stop().animate({
						height:'80px'
					},600);
					elements.navbar_brand.stop().animate({
						fontSize:'35px',
						marginTop:'15px'
					},600);
					elements.menu.stop().animate({
						fontSize:'20px',
						marginTop:'15px'
					},600);
				}  
			}
		},

		show_login:function() {
			if (!elements.login_frame.is(':visible')) {
				elements.login_frame.fadeIn();
				elements.overlay.fadeIn();
			}
		},

		show_register:function() {
			if (!elements.register_frame.is(':visible')) {
				elements.register_frame.fadeIn();
				elements.overlay.fadeIn();
			}
		},

		close_everything:function() {
			if (elements.login_frame.is(":visible")) {
				elements.login_frame.fadeOut();
				elements.overlay.fadeOut();
			}
			if (elements.register_frame.is(':visible')) {
				elements.register_frame.fadeOut();
				elements.overlay.fadeOut();
			}
		}
	};

	elements.acquire();

	return {
		init:function() {
			ev.bind();
		}
	};

})(jQuery);

jQuery(function($) {
	index.init();
});