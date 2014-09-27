var register = (function($) {

	var elements = {
		acquire:function() {
			this.parent = window.parent;
			this.login_switch = $('.login');
		}
	};

	var ev = {
		bind:function() {
			elements.login_switch.on('click', ev.switch_to_login);
			document.on('click', '.login', ev.switch_to_login);
		},

		switch_to_login:function() {
			alert('clicked');
			elements.parent.jQuery('#register_frame').fadeOut();
			elements.parent.jQuery('#login_frame').fadeIn();
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
	register.init();
});

$('#login_switch').on('click', alert('hey'));