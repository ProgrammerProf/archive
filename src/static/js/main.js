let lang_data = {};

function set_theme () {

    if (localStorage.getItem("_x_theme") == '"light"')  $("body").addClass("light-mode");

    else $("body").addClass("dark-mode");

}
function set_text () {

    let lang = localStorage.getItem("_x_locale");
    lang = lang ? JSON.parse(lang) : "en";

    $("header .langs").find("a").removeClass("text-primary bg-primary/10");
    $(`header .langs a#${lang}`).addClass("text-primary bg-primary/10");
    $("header img.current-lang").attr("src", `/static/media/public/flag/${lang}.svg`);
    
    if ( lang === "ar" ) {
        lang_data = _arabic_data_;
        localStorage.setItem("_x_rtlClass", JSON.stringify("rtl"));
        $(".for-ar").each(function(){ $(this).addClass("ar"); });
    }
    else {
        localStorage.setItem("_x_rtlClass", JSON.stringify("ltr"));
        $(".for-ar").each(function(){ $(this).removeClass("ar"); });
    }
    if ( lang === "de" ) lang_data = _german_data_;
    if ( lang === "en" ) lang_data = _english_data_;
    if ( lang === "es" ) lang_data = _spanish_data_;
    if ( lang === "fr" ) lang_data = _french_data_;
    if ( lang === "it" ) lang_data = _italian_data_;
    if ( lang === "ja" ) lang_data = _japanese_data_;
    if ( lang === "ru" ) lang_data = _russian_data_;
    if ( lang === "tr" ) lang_data = _turkish_data_;

    $("*").each(function(){

        if ( $(this).attr("text") ) {
            $(this).html(lang_data[trim($(this).attr("text")).toLowerCase()]);
            if ( this.nodeName == "INPUT" ) $(this).attr("placeholder", lang_data[trim($(this).attr("text")).toLowerCase()]);
        }

    });
    $(".page-title").each(function(){ $("title").text($(this).text()); $(this).remove(); });
    $(".fix-lang").each(function(){ $(this).html(lang_data[trim($(this).text().toLowerCase())]); });

}
function set_heights () {

    let height = 0;

    if ( localStorage.getItem("_x_menu") == '"horizontal"' ) {
        height = 170;
        if ( localStorage.getItem("_x_navbar") == '"navbar-floating"' ) height = 185;
    }
    else {
        height = 110;
        if ( localStorage.getItem("_x_navbar") == '"navbar-floating"' ) height = 125;
    }

    $(".mailbox, .chat-div").css({"height": $(window).height() - height});

}
function logout () {

    $(".screen_loader1").css({"display": "flex", "align-items": "center"});

    $.ajax({
        url: "/logout", method: "POST", data: {},
        headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN")},
        success: (data) => {
            if ( data.status == true ) location.replace("/login");
            else $(".screen_loader1").fadeOut(150);
        },
        error: (data) => {
            $(".screen_loader1").fadeOut(150);
        }
    });

}
function lockscreen () {

    $(".screen_loader1").css({"display": "flex", "align-items": "center"});

    $.ajax({
        url: "/lockout", method: "POST", data: {},
        headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN")},
        success: (data) => {
            if ( data.status == true ) location.replace("/lock-screen");
            else $(".screen_loader1").fadeOut(150);
        },
        error: (data) => {
            $(".screen_loader1").fadeOut(150);
        }
    });

}
function get_details (title, placeholder, button) {

    $(".get-details").find(".title").text(title || '');
    $(".get-details").find("input").attr("placeholder", placeholder || '').val('');
    $(".get-details").find("button").text(button || 'Submit');
    $(".get-details").fadeIn(50).flex();
    setTimeout(_ => $(".get-details input").focus());

}
function show_msg (text, type) {

    $(`.msgs .${type || "success"}-msg`).show().find(".content").text(text);
    setTimeout(_ => { $(".msgs > div").fadeOut(500); }, 3000);

}
function text (key) {
    
    return lang_data[key.toLowerCase().trim()] || '';

}
function main () {

    $(document).on("click", function(e){

        if ( check_class(e.target, "setting-nav", false) ) {
            $(".setting-nav").removeClass("open");
            $(".setting-nav").fadeOut(500);
        }
        if ( $(e.target).hasClass("details-div") || $(e.target).hasClass("more-details-div") ) {
            $(".details-div").fadeOut(200);
        }
        if ( $(e.target).hasClass("showing-data") || $(e.target).hasClass("more-data-div") ) {
            $(".showing-data").fadeOut(150);
        }
        if ( $(e.target).hasClass("get-details") || $(e.target).hasClass("get-details-div") ) {
            $(".get-details").fadeOut(100);
        }

    });
    $(".show-setting").click(function(){
        $(".setting-nav").fadeIn(200).css("display", "flex");
        $(".setting-nav").addClass("open");
    });
    $(".setting-nav .close, .setting-nav button").click(function(){
        $(".setting-nav").removeClass("open");
        $(".setting-nav").fadeOut(500);

    });
    $(window).on("load resize", function(){

        set_heights();

        if ( $(window).width() > 1024 ) {
            if ( $(".navbar-static").length ) $(".edit-item-info .left-tab > div").css({"position": 'sticky', 'top': '1.5rem'});
            else if ( $(".navbar-floating").length ) $(".edit-item-info .left-tab > div").css({"position": 'sticky', 'top': '6.1rem'});
            $("header .search-form").css("width", "20rem");
        }
        if ( $(window).width() < 1025 ) {
            $(".edit-item-info .panel .div-1 label").css({"padding": "0", "margin": "0", "max-width": "7rem"});
            $(".edit-item-info .panel .div-1 input").removeClass("lg:w-[250px] w-2/3").addClass("flex-1");
            $(".edit-item-info .panel .div-2 label").css({"padding": "0", "margin": "0", "width": "7rem"});
            $(".edit-item-info .panel .div-3 label").css({"padding": "0", "margin": "0", "width": "7rem"});
            $(".edit-item-info .panel .textarea-box").css({"margin-top": "1.5rem"});
            $(".edit-item-info .panel .textarea-box:last-child").css({"margin-top": "1rem"});
            $(".edit-item-info .panel .sec-2m").css({"padding": "0 0 .1rem"});
            $("header .search-form").css("width", "auto");
            $(".edit-item-info .panel .div-4 > div").css({"padding": "0", "margin": "0"});
        }
        if ( $(window).width() < 600 ) {
            $(".chat-div, .mailbox").css({"height": $(window).height() - 110, "margin": "0"});
            $(".chat-div .panel").css({"min-height": "100%"});
        }

    });
    $(window).on("scroll", function(){
        if ( $(window).scrollTop() > 130 ) $(".scroll-top").show();
        else $(".scroll-top").hide();
        $(".scroll-top").on("click", function(){ $(window).scrollTop(0); });
    });
    $(".details-div").on("click", ".close", function(){
        $(".details-div").fadeOut(200);
    });
    $(".showing-data .all-data").css({
        "min-height": "15rem", "overflow": "auto",
        "max-height": $(window).height() - 230,
    });
    $(".showing-data").on("click", ".close", function(){
        $(".showing-data").fadeOut(150);
    });
    $(".main-content").on("click", ".show-showing-data", function(){
        $(".showing-data").fadeIn(150).css("display", "flex");
    });
    $(".select-user").on("click", function(){
        $(".showing-data.users input").val('');
        $(".showing-data.users").find(".contact-item").show();
        $(".showing-data.users").fadeIn(100).css("display", "flex");
    });
    $(".select-project").on("click", function(){
        $(".showing-data.projects input").val('');
        $(".showing-data.projects").find(".contact-item").show();
        $(".showing-data.projects").fadeIn(100).css("display", "flex");
    });
    $(document).on("click", ".reload-height", function(){
        setTimeout(set_heights, 100);
    });
    $(document).on("click", ".change-lang", function(){
        localStorage.setItem("_x_locale", JSON.stringify($(this).attr("id")));
        set_text();
    });
    $("header .langs").on("click", "a", function(){
        localStorage.setItem("_x_locale", JSON.stringify($(this).attr("id")));
        set_text();
    });
    $(".showing-data.users input, .showing-data.projects input").on("keyup", function(){
        let text = $(this).val().trim().toLowerCase().replace(/\s/gi, "");
        if ( text ) {
            $(this).parents(".showing-data").find(".contact-item").each(function(){
                let name = $(this).find(".name").text().trim().toLowerCase().replace(/\s/gi, "");
                let tell = $(this).find(".tell").text().trim().toLowerCase().replace(/\s/gi, "");
                let id = $(this).attr("id");
                if ( name.includes(text) || tell.includes(text) || id.toString() == text ) $(this).show();
                else $(this).hide();
            });
        }
        else $(this).parents(".showing-data").find(".contact-item").show();
    });

    $(".logout-btn").click(logout);
    $(".lockscreen-btn").click(lockscreen);
    $(document).on("click", ".change-theme", set_theme);
    $(document).on("click", ".set-text", set_text);
    set_theme(); set_text();
    setTimeout(set_text, 100);
    
}

main();