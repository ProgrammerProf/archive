const audio = new Audio();
let admin_id = 0;
let socket = ''
let socket_id = $("#admin-id").text() ? JSON.parse($("#admin-id").text()) : 0;
// socket = new WebSocket(`ws://${location.host}/${socket_id}`);
let my_image = `/static/media/user/${JSON.parse($("#admin-image").text())}`;
let contacts = [];
let user_id = 0;
let last_message_date = "";

function download ( src ) {

    let link = document.createElement("a");
    link.setAttribute('target', "_blank");
    link.href = src;
    document.body.appendChild(link);
    link.click();
    link.remove();

}
function sound (src, volume=1) {

    audio.pause();
    audio.src = `/static/media/public/${src}.wav`;
    audio.volume = volume;
    audio.play();

}
function got_to_msg (msg_id) {

    let el = $(`.chat-div .right-content .messages-list #${msg_id}`);
    el.addClass("selected");
    el.prev()[0].scrollIntoView();

}
function fix_date (date) {

    if ( date == "Just now" ) return text('now');
    let hour = parseInt(date.split(" ")[1].split(":")[0]);
    let minute = parseInt(date.split(" ")[1].split(":")[1]);
    if ( minute == get_date("minute") ) return text('now');
    let p = text('am');
    if ( hour > 12 ) { hour -= 12; p = text("pm") }
    if ( hour == 0 ) hour = 12;
    if ( minute < 10 ) minute = `0${minute}`;
    return `${hour}:${minute} ${p}`;

}
function shorten_date (date) {

    let today = `${get_date('year')}-${get_date('month')}-${get_date('day')} 0:0:0`;
    diff = new Date(today).getTime() - new Date(date).getTime();
    if ( diff <= 0 ) return text("today");
    else if ( Math.floor(diff / 1000 / 60 / 60) < 24 ) return text("yasterday");
    else date = date.split(" ")[0];
    return date;

}
function send_message(data){
    
    $.ajax({
        url: "", method: "POST", data: data,
        headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN"), "request": "send_message"},
        success: _ => {
            if ( socket ) socket.send(JSON.stringify(_));
            contacts.map(item => { if ( item.contact_id == user_id ) item.messages.push(_) });
        },
        error: _ => {}
    });

}
function get_conacts () {

    $.ajax({
        url: "", method: "POST", data: {},
        headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN"), "request": `get_contacts`},
        success: (data) => {

            if ( data.status == true ) {

                contacts = JSON.parse(data.contacts);
                contacts.forEach( _ => { display_contact(_) });

            }

        },
        error: (data) => {}
    });

}
function display_contact (_) {

    let last_message = "~~";
    let last_date = fix_date(_.friend_date);
    let none_active = 0;
    if ( _.messages.length ) {

        if ( _.messages.slice(-1)[0].content.trim() ) last_message = _.messages.slice(-1)[0].content;
        if ( _.messages.slice(-1)[0].type == "video" ) last_message = text("video");
        if ( _.messages.slice(-1)[0].type == "image" ) last_message = text("image");
        if ( _.messages.slice(-1)[0].type == "file" ) last_message = text("file");
        last_date = fix_date(_.messages.slice(-1)[0].date);
        none_active = _.messages.filter(item => item.active == false && item.sender != admin_id).length;

    }
    let item =  `

        <button class="chat-user relative no-select type-admin no-margin no-outline for-ar" id="${_.id}" data-contact="${_.contact_id}">
                                    
            <div class="flex-1">

                <div class="flex items-center">

                    <div class="flex-shrink-0 relative image">

                        <img src="/static/media/user/${_.image}" class="rounded-full h-9 w-9 object-cover" style="background: rgba(0, 0, 0, .3);">
                        
                        <div class="absolute bottom-0 ltr:right-0 rtl:left-0">

                            <div class="w-3 h-3 bg-success rounded-full online hide"></div>

                        </div>

                    </div>

                    <div class="mx-3 ltr:text-left rtl:text-right">

                        <p class="font-semibold name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${_.name.trim()}</p>

                        <p class="text-xs text-white-dark truncate last-msg" style="margin-top: .15rem">${last_message}&nbsp;</p>

                    </div>

                </div>

            </div>

            <div class="font-semibold whitespace-nowrap text-xs">

                <p class="mb-1 date">${last_date}</p>

                <div style="display: flex; justify-content: flex-end;">&nbsp;<div class="count hide">${none_active}</div></div>

                <div class="dropdown shrink-0 no-select chat-user-options">
                    <a class="show-options pointer flex justify-center items-center w-7 hover:text-primary">
                        <svg class="w-5 h-5 rotate-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </a>
                    <ul class="hide top-5 right-0 options py-2">
                        <li>
                            <a class="delete-contact">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0">
                                    <path opacity="0.5" d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                    <path d="M20.5001 6H3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                    <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                    <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                    <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                </svg>
                                <span class="ltr:mr-4 rtl:ml-4">${text("delete")}</span>
                            </a>
                        </li>
                        <li>
                            <a class="delete-contact-all">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0">
                                    <path opacity="0.5" d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                    <path d="M20.5001 6H3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                    <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                    <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                    <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                </svg>
                                <span class="ltr:mr-4 rtl:ml-4">${text("delete_for_all")}</span>
                            </a>
                        </li>
                    </ul>
                </div>

            </div>

        </button>

    `;
    $(".chat-div .empty").hide();
    $(".chat-div .chat-users").show().prepend(item);
    let el = $(`.chat-users .chat-user[id=${_.id}]`);
    if ( _.online ) el.find(".online").show();
    if ( none_active > 0 ) el.find(".count").show();
    let name_width = el.outerWidth() - el.find(".date").outerWidth() - el.find(".image").outerWidth() - 50;
    el.find(".name").css({"max-width": name_width});

}
function display_chat () {

    let user_details = contacts.filter(_ => _.contact_id == user_id)[0];
    let user_image = `/static/media/user/${user_details.image}`;
    $(".chat-div .right-content .content-image img").attr("src", user_image);
    $(".chat-div .right-content .content-name").text(user_details.name);
    $(".chat-div .right-content .content-status").html(user_details.online ? text("online") : text("offline"));
    if (user_details.online) $(".chat-div .right-content .content-image .online").show();
    else $(".chat-div .right-content .content-image .online").hide();

    $(".chat-div .right-content .display-content").html(`
        <div class="space-y-5 p-4 chat-conversation-box sm:pb-0 pb-[68px] sm:min-h-[300px] min-h-[400px] messages-list">
            <div class="flex system-message text no-select">
                <div class="msg-text">
                    <span class="warn flex items-start" style="font-size: .75rem;">
                        <span class="material-symbols-outlined icon" style="font-size: .8rem; margin: 3px 0 0;">lock</span>
                        <span style="margin: 0 .4rem">${text("chat_lock_msg")}</span>
                    </span>
                </div>
            </div>
        </div>
    `);
    
    last_message_date = "0-0-0 0:0:0";
    let none_active = user_details.messages.filter(item => item.active == false && item.sender != admin_id).length;

    user_details.messages.forEach( _ => {

        if ( _.active == false && none_active > 0 && _.sender != admin_id ) {
            
            write_message("none-active", "", "", `( ${none_active} ) ${text("not_readen")}`, get_date(), "text", "", "", "", "system");
            none_active = 0;

        }

        let diff = parseInt(_.date.split(" ")[0].split("-")[2]) - parseInt(last_message_date.split(" ")[0].split("-")[2]);

        if ( diff > 0 ) {

            last_message_date = _.date;

            write_message(0, "", "", shorten_date(_.date), get_date(), "text", "", "", "", "system");

        }

        write_message(_.id, user_image, my_image, _.content, _.date, _.type, _.link, _.name, _.size, _.sender);

    });

    if ( $(".chat-div .right-content .messages-list #none-active").length > 0 ) setTimeout( _ => { got_to_msg("none-active"); }, 100);
    else {
        $(".chat-div .right-content .display-content").addClass("none-smooth");
        setTimeout( _ => {$(".chat-div .right-content .display-content")[0].scrollBy(0, 100000)}, 100);
        setTimeout( _ => {$(".chat-div .right-content .display-content")[0].scrollBy(0, 100000)}, 200);
        setTimeout( _ => {$(".chat-div .right-content .display-content")[0].scrollBy(0, 100000)}, 300);
        setTimeout( _ => { $(".chat-div .right-content .display-content").removeClass("none-smooth"); }, 1000);
    }
    setTimeout( _ => { $(".chat-div .right-content .screen_loader2").fadeOut(300); }, 200);
    active_chat();

}
function write_message (id, user_image, branch_image, content, date, type, link, name, size, who_send, current=false) {

    let cls = "", image = "";
    let path = `/static/media/chat/${link}`;
    if ( current ) path = link;
    if ( who_send == 0 ) { cls = "sender"; image = branch_image; }
    else if ( who_send == 'system' ) { cls = "system"; }
    else { cls = "receiver"; image = user_image; }
    $(`.chat-users .chat-user[data-contact='${user_id}'] .date`).html(fix_date(date));

    if ( type == "text" ) {

        let msg = $(`.chat-div .right-content .test-messages-list .${cls}-message.text`).first().clone();
        msg.appendTo(".chat-div .right-content .messages-list").fadeIn(300).css("display", "flex").attr("id", id);
        msg.find(".profile-image").attr("src", image);
        msg.find(".msg-text span").html(content);
        msg.find(".msg-date").html(fix_date(date));
        $(`.chat-users .chat-user[data-contact='${user_id}'] .last-msg`).html(content);

    }
    if ( type == "file" ) {

        let msg = $(`.chat-div .right-content .test-messages-list .${cls}-message.file`).first().clone();
        msg.appendTo(".chat-div .right-content .messages-list").fadeIn(300).css("display", "flex").attr("id", id);
        msg.find(".profile-image").attr("src", image);
        msg.find(".msg-file a").attr("href", path);
        msg.find(".msg-file .name").text(name);
        msg.find(".msg-file .size").text(size);
        msg.find(".msg-date").html(fix_date(date));
        msg.on('click', () => download(path));
        $(`.chat-users .chat-user[data-contact='${user_id}'] .last-msg`).html(text("file"));

    }
    if ( type == "image" ) {

        let msg = $(`.chat-div .right-content .test-messages-list .${cls}-message.image`).first().clone();
        msg.appendTo(".chat-div .right-content .messages-list").fadeIn(300).css("display", "flex").attr("id", id);
        msg.find(".profile-image").attr("src", image);
        msg.find(".msg-image img").attr("src", path);
        msg.find(".msg-date").html(fix_date(date));
        msg.on('click', () => download(path));
        $(`.chat-users .chat-user[data-contact='${user_id}'] .last-msg`).html(text("image"));

    }
    if ( type == "video" ) {

        let msg = $(`.chat-div .right-content .test-messages-list .${cls}-message.video`).first().clone();
        msg.appendTo(".chat-div .right-content .messages-list").fadeIn(300).css("display", "flex").attr("id", id);
        msg.find(".profile-image").attr("src", image);
        msg.find(".msg-video video").attr("src", path);
        msg.find(".msg-date").html(fix_date(date));
        msg.on('click', () => download(path));
        $(`.chat-users .chat-user[data-contact='${user_id}'] .last-msg`).html(text("video"));

    }

    setTimeout( _ => {
        let top = $(".chat-div .right-content .display-content")[0].scrollHeight + 10000;
        setTimeout( _ => { $(".chat-div .right-content .display-content")[0].scrollTo(0, top); }, 100);
    }, 100);

}
function text_message () {

    let msg = $(".chat-div .right-content .send-msg-input").val().trim();
    $(".chat-div .right-content .send-msg-input").val("");
    if ( !msg ) return;

    write_message(0, "", my_image, msg, "Just now", "text", "", "", "", admin_id);
    $(".chat-users").prepend($(`.chat-users .chat-user[data-contact='${user_id}']`));
    send_message({"content": msg, "type": "text", "user_id": user_id});
    setTimeout(_ => sound("send", .3), 200);

}
function file_message () {

    let file = $(".chat-div .right-content .attach-file-input")[0].files[0];
    $(".chat-div .right-content .attach-file-input").val("");
    if ( !file ) return;
    let type = file_information(file, "type");
    let size = file_information(file, "size");
    let name = file_information(file, "name") || "File data";
    let ext = file_information(file, "ext") || "";
    if ( type != "image" && type != "video" ) type = "file";

    let form = new FormData();
    form.append("user_id", user_id);
    form.append("content", "");
    form.append("type", type);
    form.append("name", name);
    form.append("size", size);
    form.append("ext", ext);
    form.append("file", file);

    var fr = new FileReader();
    fr.onload = _ => {
        write_message(0, "", my_image, "", "Just now", type, fr.result, name, size, admin_id, true);
        $(".chat-users").prepend($(`.chat-users .chat-user[data-contact='${user_id}']`));
        setTimeout(_ => sound("send", .3), 300);
    }
    fr.readAsDataURL(file);

    $.ajax({
        url: "", method: "POST", data: form, processData: false, contentType: false,
        headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN"), "request": "send_message"},
        success: _ => {

            if( _.status ) {

                if ( socket ) socket.send(JSON.stringify(_));
                contacts.map(_ => { if ( _.contact_id == user_id ) _.messages.push(_) });

            }

        },
        error: _ => {}
    });

}
function active_chat () {

    contacts.map(_ => { if ( _.contact_id == user_id ) _.messages.map(i => i.active = true); });

    $.ajax({
        url: "", method: "POST", data: {"id": user_id},
        headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN"), "request": "active_chat"},
        success: (data) => {},
        error: (data) => {}
    });

}
function delete_contact (id, all=false) {

    contacts = contacts.filter(_ => _.id != id);

    $.ajax({
        url: "", method: "POST", data: {id: id, all: all},
        headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN"), "request": "delete_contact"},
        success: (data) => {},
        error: (data) => {}
    });

}
function socket_message (msg) {

    if ( user_id == msg.user_id ) {

        msg.active = true;
        
        contacts.map(_ => { if ( _.contact_id == msg.user_id ) _.messages.push(msg); });

        let user_image = contacts.filter(_ => _.contact_id == user_id)[0].image;

        user_image = `/static/media/user/${user_image}`;

        write_message(msg.id, user_image, my_image, msg.content, msg.date, msg.type, msg.link, msg.name, msg.size, msg.sender);

        sound("receive", .5);

        active_chat();

    }
    else {

        let user_details = contacts.filter(_ => _.contact_id == msg.user_id);

        if ( user_details.length ) {

            contacts.map(_ => { if ( _.contact_id == msg.user_id ) _.messages.push(msg); });

            let count = user_details[0].messages.filter(item => item.active == false && item.who_send == "user").length;

            let last_msg = "~~~";
            if ( msg.content.trim() ) last_msg = msg.content;
            if ( msg.type == "video" ) last_msg = text("video");
            if ( msg.type == "image" ) last_msg = text("image");
            if ( msg.type == "file" ) last_msg = text("file");

            $(`.chat-users .chat-user#${user_details[0].id} .count`).text(count).show();
            $(`.chat-users .chat-user#${user_details[0].id} .last-msg`).html(last_msg);
            $(".chat-users").prepend($(`.chat-users .chat-user#${user_details[0].id}`));

        }
        else {

            $.ajax({
                url: "", method: "POST", data: {"id": msg.user_id},
                headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN"), "request": `new_chat_user`},
                success: (data) => {
    
                    let contact = {
                        "id": parseInt(data.id), "contact_id": parseInt(msg.user_id), "name": data.name, "image": data.image,
                        "online": data.online, "friend_date": "Just now",
                        "messages": data.msgs,
                    }
                    contacts.push(contact);
                    display_contact(contact);
    
                },
                error: (data) => {}
            });
            
        }

    }

}
function new_chat (id) {

    if ( contacts.filter(_ => _.contact_id == id).length) {

        $(".showing-contacts").fadeOut(50);
        $(`.chat-div .chat-users .chat-user[data-contact='${id}']`).click();

    }
    else {

        $(".showing-contacts").fadeOut(50);

        $.ajax({
            url: "", method: "POST", data: {"id": parseInt(id)},
            headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN"), "request": `new_contact`},
            success: (data) => {

                if ( data.status != true ) return;

                let contact = {
                    "id": parseInt(data.id), "contact_id": parseInt(id), "name": data.name, "image": data.image,
                    "online": data.online, "friend_date": "Just now",
                    "messages": data.msgs,
                }
                contacts.push(contact);
                display_contact(contact);
                $(`.chat-div .chat-users .chat-user[data-contact='${id}']`).click();

            },
            error: (data) => {}
        });

    }

}
function actions () {

    $(document).on("click", function(e){
        
        if ( check_class(e.target, "showing-contacts", false) ) $(".showing-contacts").fadeOut(150);
        if ( !check_class(e.target, "show-options") ) $(".chat-user-options .options").addClass("hide");

        if ( $(window).width() < 1280 ) {
            if ( !check_class(e.target, "left-content") && !check_class(e.target, "show-side-chat") ) $(".left-content").hide();
        }

    });
    $(".chat-users").on("click", ".chat-user:not(.active)", function(){
        $(".chat-users").find(".chat-user").removeClass("active");
        $(this).addClass("active");
        $(this).find(".count").fadeOut(200);
        $(".chat-div .right-content .none-content").hide();
        $(`.chat-div .right-content .active-content`).hide();
        $(`.chat-div .right-content .active-content`).fadeIn();
        $(".chat-div .right-content .screen_loader2").css("display", "flex");
        user_id = parseInt($(this).attr("data-contact"));
        setTimeout( _ => { display_chat() }, 100);
    });
    $(".chat-users").on("click", ".chat-user", function(){
        if ( $(window).width() < 1280 ) $(".chat-div .left-content").hide();
    });
    $(".showing-contacts .close").click(function(){
        $(".showing-contacts").fadeOut(150);
    });
    $(".show-contacts-user").click(function(){
        $(".showing-contacts.user-contacts").fadeIn(200).css("display", "flex");
        $(".showing-contacts.user-contacts").find(".contact-item").show();
        $(".showing-contacts.user-contacts .form-input").val("");
    });
    $(document).on("keyup", ".showing-contacts .form-input", function(){
        let text = $(this).val().trim().toLowerCase().replace(/\s/gi, "");
        if ( text ) {
            $(this).parents(".showing-contacts").find(".contact-item").each(function(){
                let name = $(this).find(".name").text().trim().toLowerCase().replace(/\s/gi, "");
                let tell = $(this).find(".tell").text().trim().toLowerCase().replace(/\s/gi, "");
                let id = $(this).attr("id")
                if ( name.includes(text) || tell.includes(text) || id == text ) $(this).show();
                else $(this).hide();
            });
        }
        else $(this).parents(".showing-contacts").find(".contact-item").show();
    });
    $(".chat-div .search-input").on("keyup", function(){
        let text = $(this).val().trim().toLowerCase().replace(/\s/gi, "");
        if ( text ) {
            $(".chat-div .chat-users .chat-user").each(function(){
                let name = $(this).find(".name").text().trim().toLowerCase().replace(/\s/gi, "");
                let tell = $(this).find(".date").text().trim().toLowerCase().replace(/\s/gi, "");
                let id = $(this).attr("id");
                let contact_id = $(this).attr("data-contact");
                let count = $(this).find(".count").text();
                if ( name.includes(text) || tell.includes(text) || id.toString() == text || 
                    count.toString() == text || contact_id.toString() == text ) $(this).show();
                else $(this).hide();
            });
        }
        else $(".chat-div .chat-users").find(".chat-user").show();
    });
    $(document).on("click", ".user-contacts .contact-item", function(){
        new_chat($(this).attr("id"));
    });
    $(".chat-div").on("click", ".msg-video video", function(){
        if ( $(this)[0].paused ) {
            $(this)[0].currentTime = 0;
            $(this)[0].play();
        }
        else {
            $(this)[0].pause();
        }
    });
    $(".chat-div .right-content .send-msg-btn").click(function(){
        text_message();
    });
    $(".chat-div .right-content .send-msg-input").keyup(function(e){
        e.key == 'Enter' ? text_message() : "";
    });
    $(".chat-div .right-content .attach-file").click(function(){
        $(".chat-div .right-content .attach-file-input").click();
    });
    $(".chat-div .right-content .attach-file-input").change(function(){
        file_message();
    });
    $(".chat-div .right-content .scroll-down").click(function(){
        let top = $(".chat-div .right-content .display-content")[0].scrollHeight + 10000;
        setTimeout( _ => { $(".chat-div .right-content .display-content")[0].scrollTo(0, top); }, 100);
    });
    $(".chat-div .right-content .display-content").scroll(function(){
        if ( parseInt($(this).scrollTop() + $(this).outerHeight()) > ( this.scrollHeight - 200 ) ) {
            $(".chat-div .right-content .scroll-down").fadeOut();
        }
        else $(".chat-div .right-content .scroll-down").fadeIn().flex();
    });
    $(".chat-div .right-content .show-side-chat").click(function(){

        $(".chat-div .left-content").show();
        
    });
    $(".chat-div .left-content .hide-side-chat").click(function(){

        $(".chat-div .left-content").hide();
        
    });
    $(".chat-users").on("click", ".chat-user-options a", function(){
        $(this).parents(".chat-user-options").find("ul").toggleClass("hide");
        return false
    });
    $(".chat-users").on("click", ".chat-user-options .options", function(){
        $(this).addClass("hide");
        return false;
    });
    $(".chat-users").on("click", ".chat-user .delete-contact", function(){
        if ( !confirm(text("delete_contact_msg")) ) return;
        let id = parseInt($(this).parents(".chat-user").attr("id"));
        let contact_id = parseInt($(this).parents(".chat-user").attr("data-contact"));
        $(this).parents(".chat-user").remove();
        if ( !$(".chat-user").length ) { $(".chat-users").hide(); $(".empty").show(); }
        if ( contact_id === user_id ) { user_id = 0; $(".right-content .active-content").hide(); $(".right-content .none-content").show(); }
        delete_contact(id);
    });
    $(".chat-users").on("click", ".chat-user .delete-contact-all", function(){
        if ( !confirm(text("delete_contact_msg")) ) return;
        let id = parseInt($(this).parents(".chat-user").attr("id"));
        let contact_id = parseInt($(this).parents(".chat-user").attr("data-contact"));
        $(this).parents(".chat-user").remove();
        if ( !$(".chat-user").length ) { $(".chat-users").hide(); $(".empty").show(); }
        if ( contact_id === user_id ) { user_id = 0; $(".right-content .active-content").hide(); $(".right-content .none-content").show(); }
        delete_contact(id, true);
    });
    $(".chat-users").on("mouseleave", ".chat-user", function(){
        $(this).find(".options").addClass("hide");
    });
    $(".all-contacts").css({
        "min-height": "15rem", "overflow": "auto",
        "max-height": $(window).height() - 230,
    });
    $(".chat-users").css({
        "margin-top": "0"
    });
    socket.onmessage = function(e){
    
        socket_message(JSON.parse(e.data));
    
    }

}
function main () {

    actions();
    get_conacts();

}

main();