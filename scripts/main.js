"use strict";
var fics;

function initialize() {
    //apply style - fuck mobile users
    let head = document.head;
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        link.href = "assets/styles/style_mobile.css";
        head.appendChild(link);
    } else {
        link.href = "assets/styles/style.css";
        head.appendChild(link);
    }
    //load dynamic elements
    getData();
}

//easter egg
function ghost() {
    console.log("                      .-.\n         heehee      /aa \\_\n                   __\\-  / )                 .-.\n         .-.      (__/    /        haha    _/oo \\\n       _/ ..\\       /     \\               ( \\v  /__\n      ( \\  u/__    /       \\__             \\/   ___)\n       \\    \\__)   \\_.-._._   )  .-.       /     \\\n       /     \\             `-`  / ee\\_    /       \\_\n    __/       \\               __\\  o/ )   \\_.-.__   )\n   (   _._.-._/     hoho     (___   \\/           \'-\'\nboo \'-\'                        /     \\\n                             _/       \\    teehee\n                            (   __.-._/");
    return;
}

//------[HANDLE JSON]-------

function getData() {
    clearFics();
    fics = [];
    $.getJSON('../data/archive.json', function(data) {
        populateFilters(data.Categories, data.Fandoms, data.Hosts); //populate filters
        data.Fanfiction.forEach(fic => {
            if (fic.ID !== " - ") { //do not load empty cells
                fics.push(fic);
            }
        });
        printFics(fics);
    });
}

//------[BUILD ARTICLE]-------

//clear all loaded fics
function clearFics() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    $('#loadingScreen').show();
    $("#container").html("");
}

//print all fics from filtered list
function printFics(ficsFiltered) {
    ficsFiltered.forEach(fic => {
        buildContainer(fic);
    });
    $("#filterstring").html("Showing " + ficsFiltered.length + " records.");
    $("#filterstring").show();
    $('#loadingScreen').hide();
}

//add html of fic to document
function buildContainer(fic) {
    let div = $("<div class='box' id='" + fic.ID.replace(/ /g, "_") + "'></div>"),
        header = $("<div id='accordionHeader' class='accordionHeader'></div>"),
        accordion = $("<div id='accordionBody' class='accordionBody'></div>"),
        color;

    //container
    if (fic.y == 1) {
        color = 'red';
    } else {
        color = 'blue'
    }

    //series
    if (fic.SeriesName) {
        let series = $("<span class='" + color + "'>" + fic.PlaceInSeries + " - " + fic.SeriesName + "</span>");
        series.attr("onClick", 'applySpecificFilterToAll("SeriesName","' + fic.SeriesName + '")'); //add that onclick filter
        header.append(series);
    }

    //title+URL
    if (fic.URL) {
        header.append($("<h2 class='" + color + "'><a href='" + fic.URL + "'>" + fic.Title + "</a></h2>"));
    } else { //white if no associated url
        header.append($("<h2>" + fic.Title + "</h2>"));
    }

    //author
    let auth = $("<h3 class='" + color + "'>" + fic.Author + "</h3>");
    auth.attr("onClick", "applySpecificFilterToAll('Author','" + fic.Author + "')"); //add that onclick filter
    header.append(auth);

    //accordion time
    header.on("click", function() {
        let panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });

    div.append(header);

    //synopsis
    accordion.append($("<p class='" + color + "'>" + fic.Synopsis + "</p>"));

    //tags container
    let divtags = $("<div class='tags'></div>");
    let fan = $("<p class='fandom'>" + fic.Fandom + "</p>");
    fan.attr("onClick", "applySpecificFilterToAll('Fandom','" + fic.Fandom + "')"); //add that onclick filter
    divtags.append(fan);
    let host = $("<p class='host'>" + fic.Host + "</p>");
    host.attr("onClick", "applySpecificFilterToAll('Host','" + fic.Host + "')"); //add that onclick filter
    divtags.append(host);

    if (fic.Category) {
        let cat = $("<p class='category'>" + fic.Category + "</p>");
        cat.attr("onClick", "applySpecificFilterToAll('Category','" + fic.Category + "')"); //add that onclick filter
        divtags.append(cat);
    }
    if (fic.Characters) {
        let chars = fic.Characters.split(/[, ]+/);
        chars.forEach((item) => {
            let char = $("<p class='character'>" + item + "</p>");
            char.attr("onClick", "applySpecificFilterToAll('Characters','" + item + "')"); //add that onclick filter
            divtags.append(char);
        })
    }
    accordion.append(divtags);

    //stats table
    let stats = $("<table cellspacing='0' cellpadding='0' class='stats'>")

    if (fic.Finished == "1") {
        stats.append($("<td style='background-color:#99FF8850;border-left: none !important;'>Completed</td>"));
    } else {
        stats.append($("<td style='background-color:#DAE36950;border-left: none !important;'>Unfinished</td>"));
    }

    if (fic.Deleted !== "0") {
        stats.append($("<td style='background-color:#DAE36950;'>Deleted</td>"));
    } else {
        stats.append($("<td style='background-color:#99FF8850;'>Live</td>"));
    }
    stats.append($("<td>Words: " + fic.Words + "</td>"));
    stats.append($("<td>Chapters: " + fic.Chapters + "</td>"));
    stats.append($("<td>Last Updated: " + fic.Updated + "</td>"));
    let format = "";
    if (fic.other == 1) {
        format += "<a href='" + encodeURI("../data/raw/" + fic.ID + ".txt") + "' style=' text-decoration: underline;'>" + "Other" + "</a>";
    }
    if (fic.mobi == 1) {
        format += "<a href='" + encodeURI("../data/raw/" + fic.ID + ".mobi") + "' style=' text-decoration: underline;'>" + checkforseparator() + "MOBI" + "</a>";
    }
    if (fic.epub == 1) {
        format += "<a href='" + encodeURI("../data/raw/" + fic.ID + ".epub") + "' style=' text-decoration: underline;'>" + checkforseparator() + "EPUB" + "</a>";
    }
    if (fic.pdf == 1) {
        format += "<a href='" + encodeURI("../data/raw/" + fic.ID + ".pdf") + "' style=' text-decoration: underline;'>" + checkforseparator() + "PDF" + "</a>";
    }
    stats.append($("<td>Format(s): " + format + "</td>"));
    accordion.append(stats);
    div.append(accordion);

    function checkforseparator() {
        if (format.length > 1) {
            return ",";
        }
        return "";
    }

    //add to page
    $("#container").append(div);
}

//accordion expand/collapse
function accordion() {
    $(".accordionBody").each(function() {
        if ($(this).css("maxHeight") == $(this).get(0).scrollHeight + "px") {
            $(this).css({ "maxHeight": "0" });
        } else {
            $(this).css({ "maxHeight": $(this).get(0).scrollHeight + "px" })
        }
    });
}

//------[FILTERS]-------

//removes all fics and reloads with those specified in filters tab
function applyAllFilters() {
    clearFics();
    $(".dropdown").hide();
    let ficsFiltered = [],
        passFilter = true;
    //for loop no. 1 -- all fics
    fics.forEach((fic) => {
        passFilter = true;
        if ($("#filterAll").val() !== "") {
            //for loop for every field in fic...
            if (!applyFilter(null, $("#filterAll").val(), fic)) { passFilter = false; }
        }
        if ($("#filterTitle").val() !== "") {
            if (!applyFilter("Title", $("#filterTitle").val(), fic)) { passFilter = false; }
        }
        if ($("#filterAuthor").val() !== "") {
            if (!applyFilter("Author", $("#filterAuthor").val(), fic)) { passFilter = false; }
        }
        if ($("#filterFinished").is(":checked")) {
            if (applyFilter("Finished", 0, fic)) { passFilter = false; }
        }
        if ($("#filterDeleted").is(":checked")) {
            if (applyFilter("Deleted", 0, fic)) { passFilter = false; }
        }
        if ($("#filterFavourite").is(":checked")) {
            if (applyFilter("Favourite", 0, fic)) { passFilter = false; }
        }
        if ($("#filterFandoms").children("option:selected").text() !== "Any") {
            if (!applyFilter("Fandom", $("#filterFandoms").children("option:selected").text(), fic)) { passFilter = false; }
        }
        if ($("#filterHosts").children("option:selected").val() !== "Any") {
            if (!applyFilter("Host", $("#filterHosts").children("option:selected").text(), fic)) { passFilter = false; }
        }
        if ($("#filterFormats").children("option:selected").val() !== "Any") {
            if (fic[$("#filterFormats").children("option:selected").val()] == 0) { passFilter = false; }
        }
        if ($("#filterCategories").children("option:selected").text() !== "Any") {
            if (!applyFilter("Category", $("#filterCategories").children("option:selected").text(), fic)) { passFilter = false; }
        }
        //these require minor computation
        if ($("#filterWordsMin").val() !== "") { if (parseInt(fic.Words) < parseInt($("#filterWordsMin").val())) { passFilter = false; } }
        if ($("#filterWordsMax").val() !== "") { if (parseInt(fic.Words) > parseInt($("#filterWordsMax").val())) { passFilter = false; } }
        if ($("#filterChaptersMin").val() !== "") { if (parseInt(fic.Chapters) < parseInt($("#filterChaptersMin").val())) { passFilter = false; } }
        if ($("#filterChaptersMax").val() !== "") { if (parseInt(fic.Chapters) > parseInt($("#filterChaptersMax").val())) { passFilter = false; } }

        if (passFilter) { //no exclusionary factors?
            ficsFiltered.push(fic);
        }
    });
    //print them
    printFics(ficsFiltered);

}
//populate dropdown lists for filters
function populateFilters(categories, fandoms, hosts) {
    categories.forEach((item) => {
        if (item.Category) {
            let cat = $("<option value='" + item.Category + "'>" + item.Category + "</option>");
            $("#filterCategories").append(cat);
        }
    });

    fandoms.forEach((item) => {
        if (item.Fandom) {
            let fan = $("<option value='" + item.Fandom + "'>" + item.Fandom + "</option>");
            $("#filterFandoms").append(fan);
        }
    });

    //this one's a bit tricky because we use name/IDs
    // hosts.forEach((item) => {
    //     if (item.HostName) {
    //         let fan = $("<option value='" + item.HostName + "'>" + item.HostName + "</option>");
    //         $("#filterHosts").append(fan);
    //     }
    // });

    //formats, chapters, words currently hardcoded
}
//returns true or false -- checks if passed fic contains value in index, or value in any index
function applyFilter(filterIndex, filterValue, fic) {
    if (filterValue == "Any") { //default - user has not entered data
        return true
    } else if (filterIndex == null) { //no index provided - check all
        if (filterValue) {
            for (var field in fic) {
                if (fic[field].includes(filterValue)) {
                    //console.log("included in " + fic[field]); //for testing
                    return true;
                }
            }
        }
    } else { //check index against value
        if (fic[filterIndex]) {
            if (fic[filterIndex].includes(filterValue)) {
                return true;
            }
        }
    }
    return false;
}

function applySpecificFilterToAll(index, value) {
    clearFics();
    let ficsFiltered = [];
    fics.forEach((fic) => {
        if (fic[index]) { //strict mode check
            if (fic[index].includes(value)) {
                ficsFiltered.push(fic);
            }
        }
    });
    printFics(ficsFiltered);
}

//------[API]-------

//oh no ao3 has basic CORS protection I can't web scrape it using the front :(
function checkMetaData() {

    var settings = {
        cache: false,
        dataType: "html",
        async: true,
        crossDomain: true,
        url: fics[0].URL,
        method: "GET",
        xhrFields: { withCredentials: true },

    }

    $.ajax(settings).done(function(response) {
        console.log(response);
    });
}