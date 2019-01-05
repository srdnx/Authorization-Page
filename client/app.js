$(function() {
  // Turn from Registration to Login page
  $('#login-form-link').click(function(e) {
		$("#login-form").delay(80).fadeIn(80);
 		$("#register-form").fadeOut(80);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
    $('#message').text("");
		e.preventDefault();
	});

  // Turn from Login to Registration page
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(80).fadeIn(80);
 		$("#login-form").fadeOut(80);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
    $('#message').text("");
		e.preventDefault();
	});

  // Send Login request
  $('#login-form').submit(function(){
    $.ajax({
      url: $('#login-form').attr('action'),
      type: 'POST',
      data: $('#login-form').serialize(),
      success: function(ret) {
        var ret1 = $.parseJSON(ret);
        $('#message').text(ret1.text);
        if (ret1.success == 1) {
          $("#logindata").text('Логин: ' + ret1.userdata.login);
          $("#emaildata").text('E-mail: ' + ret1.userdata.email);
          $("#namedata").text('Полное имя: ' + ret1.userdata.name);
          $("#datedata").text('Дата рождения (гггг-мм-дд): ' + ret1.userdata.date);

          $("#data-form").delay(80).fadeIn(80);
          $("#login-form").fadeOut(80);
          $(".panel-heading").fadeOut(80);
          $('#login-form-link').removeClass('active');
          $('#message').text("");
        }
      }
    });
    return false;
  });

  // Send Register request
  $('#register-form').submit(function(){
    $.ajax({
      url: $('#register-form').attr('action'),
      type: 'POST',
      data: $('#register-form').serialize(),
      success: function(ret) {
        var ret1 = $.parseJSON(ret);
        $('#message').text(ret1.text);
        if (ret1.success == 1) {
          $("#register-form").fadeOut(80);
          $('#register-form-link').removeClass('active');
        }
      }
    });
    return false;
  });
});
