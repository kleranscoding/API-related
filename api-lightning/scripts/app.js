
google.charts.load('current', {
    'packages':['geochart'],
    'mapsApiKey': 'AIzaSyBHLett8djBo62dDXj0EjCimF8Rd6E8cxg'
});

var country_list, country_data;

var region_list= [
    {name: 'Africa', code: '002'},
    {name: 'Americas', code: '019'},
    {name: 'Asia', code: '142'},
    {name: 'Europe', code: '150'},
    {name: 'Oceania', code: '009'}
];

var regionalBloc_list= [
    {code: 'EU', name: 'European Union'},
    {code: 'EFTA', name: 'European Free Trade Association'},
    {code: 'CARICOM', name: 'Caribbean Community'},
    {code: 'PA', name: 'Pacific Alliance'},
    {code: 'AU', name: 'African Union'},
    {code: 'USAN', name: 'Union of South American Nations'},
    {code: 'EEU', name: 'Eurasian Economic Union'},
    {code: 'AL', name: 'Arab League'},
    {code: 'ASEAN', name: 'Association of Southeast Asian Nations'},
    {code: 'CAIS', name: 'Central American Integration System'},
    {code: 'CEFTA', name: 'Central European Free Trade Agreement'},
    {code: 'NAFTA', name: 'North American Free Trade Agreement'},
    {code: 'SAARC', name: 'South Asian Association for Regional Cooperation'},
];

function getCountryInfo(endpoint,value) {
    $.ajax({
        method: 'GET',
        url: `https://restcountries.eu/rest/v2/${endpoint}/${value}`,
        success: function(data) {
            $('#map_div').hide();
            var c= data.currencies[0], l= data.languages[0];
            $('#country-info div.container').append(`
                <button class='return'> <- Back to Map</button>
                <article class='col-2'>
                    <img src='${data.flag}'/>
                    <p class='country-name'>Name: ${data.name} (${data.nativeName})</p>
                    <p>Capital: ${data.capital}</p>
                    <p>Language: ${l.name} (${l.iso639_1.toUpperCase()})</p>
                    <p>Region: ${data.region}</p>
                    <p>Population: ${data.population}</p>
                    <p>Currency: ${c.name} - (${c.code} ${c.symbol})</p>
                    <p>Calling Code: ${data.callingCodes}</p>
                </article>
                <div id='country_map' class='col-2'></div>
            `).css('background-image',`url(${data.flag})`);
            drawCountry(data.alpha2Code,data.name,data.capital);
        },
        error: function(err1,err2) {
            console.log(err1+','+err2);
        }
    });
}

function errorFunc(err1,err2,err3) {
    var response= err1.responseJSON.status;
    if (response==404) {
        country_list= [];
        $('.text').html('result not found...');
    }
    $('#map_div').html('');
}

function initWorldMap() {

    var dataArr= [['Region']];
    region_list.forEach(function(region){ dataArr.push([region.name]); });
    var data = google.visualization.arrayToDataTable(dataArr);
    var options = {
        backgroundColor: { fill: '#3d3d3d', },
        defaultColor: '#c0c0c0',
        region: 'world'
    };
    var chart = new google.visualization.GeoChart(document.getElementById('map_div'));
    chart.draw(data, options);
    $('.text').html('');
}

function drawCountry(alpha2Code,name,capital) {
    var data = google.visualization.arrayToDataTable(
        [['Capital'],
        [capital]]);
    var options = {
        backgroundColor: { fill: '#add8e6', },
        displayMode: 'markers',
        region: alpha2Code
    };
    var chart= new google.visualization.GeoChart(document.getElementById('country_map'));
    chart.draw(data, options);
}


function drawMap(regionMode) {

    var dataArr= [['code','Country','Population']];
    country_list.forEach(function(c){ 
        dataArr.push([c.alpha2Code,c.name,c.population]); 
    });
    var data = google.visualization.arrayToDataTable(dataArr);
    var options = {
        backgroundColor: { fill: '#add8e6', },
        colorAxis: {colors: ['blue']},
        region: regionMode
    };
    var chart = new google.visualization.GeoChart(document.getElementById('map_div'));
    chart.draw(data, options);
    $('.text').html(`<p>Results: ${country_list.length} matched</p>`);
    google.visualization.events.addListener(chart,'select', function(){
        getCountryInfo('alpha',data.getValue(chart.getSelection()[0].row, 0));
    });
}

function getCountriesBySelection(endpointObj,endpoint,regionMode,mode) {
    var baseURL= `https://restcountries.eu/rest/v2/${endpoint}/`
    if (mode=='code') {
        baseURL+= `${endpointObj.code}`;
    } else if (mode=='name') {
        baseURL+= `${endpointObj.name}`;
    }
    $.ajax({
        method: 'GET', 
        url: baseURL,
        success: function(countries) {
            country_list= countries;
            drawMap(regionMode);
        },
        error: errorFunc
    });
}


function getCountriesByInput(endpoint,value) {
    $.ajax({
        method: 'GET', 
        url: `https://restcountries.eu/rest/v2/${endpoint}/${value}`,
        success: function(countries) {
            country_list= countries;
            drawMap('world');
        },
        error: errorFunc
    });
}


function buttonByInput(e,endpoint) {
    var inputVal= $(e.target).parent().find('input').val();
    if (inputVal=='') return;
    google.charts.setOnLoadCallback(function(){ 
        getCountriesByInput(endpoint,inputVal); 
    });
}


function resetHeader() {
    $('#country-info div').html('');
    $('#country-info div.container').css('background-image','');
    $('#map_div').show();
}


$(document).ready(function(){
    region_list.forEach(function(region){
        $('.continent').append(`<option>${region.name}</option>`);
    });
    regionalBloc_list.forEach(function(bloc){
        $('.bloc').append(`<option>${bloc.name}</option>`);
    });
});

$('nav p').on('click',function(){
    var index= $(this).index();
    var selectedDiv= $('div.nav-div').eq(index);
    $('.text').html('');
    
    if (selectedDiv.hasClass('selected')) {
        selectedDiv.removeClass('selected');
    } else {
        $('.selected').removeClass('selected');
        selectedDiv.addClass('selected');
    }
    
});


$('select.continent').on('change',function(e) {
    resetHeader();
    var index= this.selectedIndex;
    if (index==0) {
        //google.charts.setOnLoadCallback(initWorldMap);
        $('#map_div').html('');
        $('.text').html('');
        return;
    }
    google.charts.setOnLoadCallback(function(){ 
        getCountriesBySelection(region_list[index-1],'region',region_list[index-1].code,'name');
    });
});

$('select.bloc').on('change',function(e) {
    resetHeader();
    var index= this.selectedIndex;
    if (index==0) {
        $('#map_div').html('');
        $('.text').html('');
        return;
    }
    google.charts.setOnLoadCallback(function(){ 
        getCountriesBySelection(regionalBloc_list[index-1],'regionalbloc','world','code');
    });
});

$('div.capital-city button').on('click',function(e) {
    resetHeader();
    buttonByInput(e,'capital');
});

$('div.language button').on('click',function(e) {
    resetHeader();
    buttonByInput(e,'lang');
});

$('div.calling-code button').on('click',function(e) {
    resetHeader();
    buttonByInput(e,'callingcode');
});

$('div.currency button').on('click',function(e) {
    resetHeader();
    buttonByInput(e,'currency');
});

$('#country-info').on('click','button.return',function(){
    resetHeader();
    $(this).remove();
})
