$(document).ready(function(){
	if($('#cart-primary') && location.pathname === "/shopping-cart") {
		$('#cart-primary').effect( "shake" );
	}
});