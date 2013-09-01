//custom js goes here
$(document).ready(function(){

	var body = window.location.search.replace( "?", "" ).split('=')[1];
	if (body != '' && body != undefined)
	{
		$.ajax({
			type: 'POST',
			url: 'http://partychat-hooks.appspot.com/post/p_ztixmmrm',
			data: {
				body: unescape(body)
			}
		})
	}

});