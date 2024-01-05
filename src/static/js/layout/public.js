$.prototype.flex = function() {
    $(this).css("display", "flex");
}
function each_class (e){

    const px_rm = _ => {
        if ( !_.endsWith("px") && !_.endsWith("rem") && !_.endsWith("em") && !_.endsWith("%") ) _ += "px";
        return _;
    }
    const family = _ => {
        _ = _.split("-").slice(1);
        if ( _.length > 1 ) return _.join("-");
        _ = _[0];
        let font = "";
        if ( _.includes("_")) {
            _.split("_").forEach(c => { font += `${c} `; });
            font = font.slice(0, -1);
        }
        else font = _;
        return font;
    }
    const set_css = (classes, el) => {

        classes.split(" ").forEach( _ => {
            if ( _.startsWith("pl-") ) $(el).css({"padding-left": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("pr-") ) $(el).css({"padding-right": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("plr-") ) $(el).css({"padding-left": `${px_rm(_.split("-")[1])}`,"padding-right": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("prl-") ) $(el).css({"padding-right": `${px_rm(_.split("-")[1])}`,"padding-left": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("pt-") ) $(el).css({"padding-top": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("pb-") ) $(el).css({"padding-bottom": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("ptb-") ) $(el).css({"padding-top": `${px_rm(_.split("-")[1])}`,"padding-bottom": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("pbt-") ) $(el).css({"padding-bottom": `${px_rm(_.split("-")[1])}`,"padding-top": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("p-") ) $(el).css({"padding": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("ml-") ) $(el).css({"margin-left": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("mr-") ) $(el).css({"margin-right": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("mlr-") ) $(el).css({"margin-left": `${px_rm(_.split("-")[1])}`,"margin-right": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("mrl-") ) $(el).css({"margin-right": `${px_rm(_.split("-")[1])}`,"margin-left": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("mt-") ) $(el).css({"margin-top": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("mb-") ) $(el).css({"margin-bottom": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("mtb-") ) $(el).css({"margin-top": `${px_rm(_.split("-")[1])}`,"margin-bottom": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("mbt-") ) $(el).css({"margin-bottom": `${px_rm(_.split("-")[1])}`,"margin-top": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("m-") ) $(el).css({"margin": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("w-") ) $(el).css({"width": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("maxw-") ) $(el).css({"max-width": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("minw-") ) $(el).css({"min-width": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("h-") ) $(el).css({"height": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("maxh-") ) $(el).css({"max-height": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("minh-") ) $(el).css({"min-height": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("size-") ) $(el).css({"font-size": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("family-") ) $(el).css({"font-family": `${family(_)}`});
            if ( _.startsWith("radius-") ) $(el).css({"border-radius": `${px_rm(_.split("-")[1])}`});
            if ( _.startsWith("back-") ) $(el).css({"background": `${_.split("-")[1]}`});
            if ( _.startsWith("color-") ) $(el).css({"color": `${_.split("-")[1]}`});
            if ( _.startsWith("transition-") ) $(el).css({"transition": `all ${_.split("-")[1]} linear`});
            if ( _.startsWith("cursor-") ) $(el).css({"cursor": `${_.split("-")[1]}`});
            if ( _.startsWith("z-") ) $(el).css({"z-index": `${_.split("-")[1]}`});
            if ( _.startsWith("backdropFilter-") ) $(el).css({"backdrop-filter": `${_.split("-")[1]}`});
        });

    }
    
    let data_child = $(e).data("child");
    let classes = $(e).attr("class");

    if ( data_child ) {
        $(e).children().each(function(){
            set_css(data_child, this);
        });
    }
    if ( classes ) {
        set_css(classes, e);
    }
    
}
function print(..._){ 
    
    console.log(..._);

}
function check_hidden(_){ 
    
    return $(_).css("display") == "none";

}
function check_class(el, class_name, check_parent=true) {

    return check_parent ? $(el).hasClass(class_name) ||
        $(el).parents(`.${class_name}`).length : $(el).hasClass(class_name);

}
function position(element, query){

    if (query == "top") return $(element).offset().top;

    if (query == "bottom") return $(window).height() - $(element).offset().top;

    if (query == "left") return $(element).offset().left;

    else if (query == "right") return $(window).width() - $(element).offset().left;

    else return [$(element).offset().top, $(element).offset().left];

}
function get_cookie(name) {

    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {
        
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {

            const cookie = cookies[i].trim();

            if (cookie.substring(0, name.length + 1) === (name + "=")) {

                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

                break;

            }

        }

    }

    return cookieValue;

}
function get_date (query, _) {

    query = query ? query.toLowerCase().replace(/\s+/g, "") : "full";
    var cur_date = _ ? new Date(_.toString().trim()) : new Date();
    let Months = ["January","February","March","April","May","June","July","August",
                    "September","October","November","December"];
    let Days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let Mon_name = Months[cur_date.getMonth()];
    let Day_name = Days[cur_date.getDay()];
    let Week_day = cur_date.getDay();
    let years = cur_date.getFullYear();
    let months = cur_date.getMonth() + 1;
    let days = cur_date.getDate();
    let hours = cur_date.getHours();
    let hrs = cur_date.getHours();
    let minutes = cur_date.getMinutes();
    let seconds = cur_date.getSeconds();
    let p = cur_date.getHours() > 12 ? "PM" : "AM";

    hrs = hrs > 12 ? hrs - 12 : hrs;
    hrs = hrs === 0 ? 12 : hrs < 10 ? `0${hrs}` : hrs;
    years = years < 10 ? `0${years}` : years;
    months = months < 10 ? `0${months}` : months;
    days = days < 10 ? `0${days}` : days;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    if (query === 'y') return cur_date.getFullYear();
    else if (query === 'm') return cur_date.getMonth() + 1;
    else if (query === 'd')  return cur_date.getDate();
    else if (query === 'h') return cur_date.getHours();
    else if (query === 'mi') return cur_date.getMinutes();
    else if (query === 's') return cur_date.getSeconds();
    else if ("years".includes(query)) return cur_date.getFullYear();
    else if ("months".includes(query)) return cur_date.getMonth() + 1;
    else if ("days".includes(query))  return cur_date.getDate();
    else if ("hours".includes(query)) return cur_date.getHours();
    else if ("minutes".includes(query)) return cur_date.getMinutes();
    else if ("seconds".includes(query)) return cur_date.getSeconds();
    else if ("weekdays".includes(query)) return cur_date.getDay();
    else if ("ps".includes(query)) return p;
    else if ("month_lists".includes(query)) return Months;
    else if ("mon_lists".includes(query)) return Months.map(_ => _.slice(0, 3));
    else if ("day_lists".includes(query)) return Days;
    else if ("d_lists".includes(query)) return Days.map(_ => _.slice(0, 3));
    else if ("day_names".includes(query)) return Day_name;
    else if ("d_names".includes(query)) return Day_name.slice(0, 3);
    else if ("month_names".includes(query)) return Mon_name;
    else if ("mon_names".includes(query)) return Mon_name.slice(0, 3);
    else if ("weekdays".includes(query)) return Week_day;
    else if ("dates".includes(query)) return `${years}-${months}-${days}`;
    else if ("times".includes(query)) return `${hours}:${minutes}:${seconds}`;
    else if ("dts".includes(query)) return `${years}-${months}-${days} ${hrs}:${minutes} ${p}`;
    else if ("datetimes".includes(query)) return `${years}-${months}-${days} ${hrs}:${minutes}:${seconds} ${p}`;
    else if ("todays".includes(query)) return `${Days[Week_day]}, ${Months[months-1].slice(0, 3)} ${days.replace(/^0/, '')}, ${years}`;
    return `${years}-${months}-${days} ${hours}:${minutes}:${seconds}`;

}
function file_information(File, query) {

    let Size = File['size'];
    let Real_Size = File['size'];
    let Name = File['name'].split(".").slice(0, -1).join(".");
    let Type = File['type'].split("/")[0];
    let Extention = File['name'].split(".").slice(-1)[0];
    let LastModifiedDate = File['lastModifiedDate'];
    query = query.toLowerCase();
    if ( !File['type'] ) Extention = "";
    if (Size < 1000) Size = `${Size} Byte`
    else if (Size >= 1000 && Size < 1000000) Size = `${(Size / 1000).toFixed(2)} KB`;
    else if (Size >= 1000000 && Size < 1000000000) Size = `${(Size / 1000000).toFixed(2)} MB`;
    else if (Size >= 1000000000 && Size < 1000000000000) Size = `${(Size / 1000000000).toFixed(2)} GB`;
    else Size = `${(Size / 1000000000000).toFixed(2)} TB`;

    if (query == "size") return Size;
    else if (query == "real_size") return Real_Size;
    else if (query == "name") return Name || File['name'];
    else if (query == "type") return Type;
    else if (query == "ext") return Extention;
    else if (query == "last_modify") return LastModifiedDate;
    else return File;

}
function query( query ){

    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params[query] ? params[query] : "";

}
function param ( section ) {

    section = section ? -section : -1;
    let data = window.location.href.split('/').slice(section).join("/");
    data = isNaN(data) ? data : parseInt(data);
    return data;

}
function full_screen(){

    document.fullScreenElement && null !== document.fullScreenElement ||
    !document.mozFullScreen && !document.webkitIsFullScreen ? document.documentElement.requestFullScreen ?
    document.documentElement.requestFullScreen() : document.documentElement.mozRequestFullScreen ?
    document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullScreen
    && document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : document.cancelFullScreen ?
    document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() :
    document.webkitCancelFullScreen && document.webkitCancelFullScreen()

}
function play_sound (src, volume=1) {

    audio.pause();
    audio.src = `/static/media/audio/${src}.wav`
    audio.volume = volume;
    audio.play();

}
function seconds_to_time (seconds) {

    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if ( hours < 10 ) hours = `0${hours}`;
    if ( minutes < 10 ) minutes = `0${minutes}`;
    if ( seconds < 10 ) seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;

}
function lower ( str ) {

    return str.toString().toLowerCase();

}
function upper ( str ) {

    return str.toString().toUpperCase();

}
function capitalize ( str ) {

    str = lower(str);
    return str.replace(str.slice(0, 1), upper(str.slice(0, 1)));

}
function title ( str ) {

    str = lower(str);
    return str.split(" ").map(_ => capitalize(_)).join(" ");

}
function trim ( str ) {

    return str ? str.toString().trim() : '';

}
function no_space ( str ) {

    return str ? str.toString().replace(/\s+/g, '') : '';

}
function match ( str1, str2 ) {

    str1 = lower(no_space(str1));
    str2 = lower(no_space(str2));
    return str1.includes(str2) || str2.includes(str1);

}
async function api ( url='', method, data={} ) {

    method = method ? method.toUpperCase() : 'GET';

    async function _get_ () {

        const response = await fetch(url);
        let res = await response.text();
        try{ return JSON.parse(res); }catch(e) { return res; }

    }
    async function _other_ () {

        let form = new FormData();
        Object.keys(data).forEach(_ => form.append(_, data[_]));

        const content = {
            method: method,
            body: form,
            headers: { 'X-XSRF-TOKEN': cookie("XSRF-TOKEN") }
        }
        const response = await fetch(url, content);
        let res = await response.text();
        try{ return JSON.parse(res); }catch(e) { return res; }

    }

    if (method === 'GET') try{ return await _get_(); } catch(e){ return false }

    try{ return await _other_(); } catch(e){ return false }

}
function find_key ( dict, ...values ) {

    values = values.length ? values : [''];
    let _keys_ = [];
    Object.keys(dict).forEach(_ => values.includes(dict[_]) ? _keys_.push(_) : '');
    return _keys_.length ? _keys_ : false;

}
function set_list ( list ) {

    return list.reduce( (_, __) => { if ( !_.includes(__) ) _.push(__); return _ }, []);

}
