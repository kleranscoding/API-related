
// get picture function
function getPic(query,offset,append) {

    var extendedURL= 'api_key='+apiKey+'&offset='+offset+'&q='+query;
    $.ajax({
        method: 'GET', url: 'http://api.giphy.com/v1/gifs/search?'+extendedURL,
        //data: $('.form-control').serialize()+'&api_key='+apiKey+'&offset='+offset,
        success: function(response) {

            var degree= 90+parseInt(Math.random()*90);
            var gallery= $('.gif-gallery');
            $('body').css('background','linear-gradient('+degree+'deg, #d8e0de 0%,#aebfbc 22%,#99afab 33%,#4e5c5a 50%,#829d98 75%, #8ea6a2 100%)').css('color','#0d0d0d');
            // check if appending new pictures
            if (append) {
                gallery.find('p').remove();
                gallery.find('button').remove();
            } else {
                $('title').html('Giffaw | '+query);
                gallery.empty();
                totalCount= response.pagination.total_count;
            }

            // append new pictures to gallery
            var count= offset+response.pagination.count;
            response.data.forEach(elem => {
                var imgSrc= elem.images.fixed_height_small.url;
                //var imgSrc= elem.images.fixed_width_small.url;
                gallery.append(`<img src='${imgSrc}'>`);
            });

            // add image counter and 'display more' button
            gallery.append(`
            <p class='count'>displaying ${count} of ${totalCount} ${query} gifs</p>
            <button class='btn btn-info add-more'>hungry for more?</button>`);
            $('.count').css('color','#1f3d7b');
        },
        error: function(err1,err2,err3) {
            alert(err2);
        },

    });
}


// define variables and get API key
var offset, query, totalCount, apiKey= $('input[name=api_key]').val();

// submit query form
$('form').on('submit',function(e) {
    e.preventDefault();

    // check if input text is empty
    query= $('.form-control').val();
    if (query==='') return;

    offset= 0;
    getPic(query,offset,false);

});

// load more button event
$('.gif-gallery').on('click','button',function() {
    if (query==='') {
        if ($('.gif-gallery').children().length>0) $(this).remove();
        $('.gif-gallery').append(`<p class='empty'> empty query</p>`);
        return;
    }
    getPic(query,offset+= 25,true);
});

// display gifs in new tab
$('.gif-gallery').on('click','img',function() {
    window.open($(this).attr('src'), '_blank');
});


