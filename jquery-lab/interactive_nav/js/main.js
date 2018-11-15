$(document).ready(function() {

    $('[data-related-panel]').click(function() {
        
        if ($(this).hasClass('active')) {

            $(this).removeClass('active');
            $('#subnav').slideUp();

        } else {
            
            $('#main-nav a').removeClass('active');
            $(this).addClass('active');
            $('#subnav').slideDown();
            $('.nav-panel').hide();
            $('#'+$(this).data('related-panel')).show();
            
        }

    });
    

});
