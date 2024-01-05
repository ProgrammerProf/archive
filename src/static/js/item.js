let files = [];
let deleted_files = [];
let back_url = "/";
let mySwiper = '';

function send_data (url, data) {

    $(".edit-item-info").find("video").each(function(){ this.pause(); });
    $(".screen_loader1").css({"display": "flex", "align-items": "center"});
    let form = new FormData();
    Object.keys(data).forEach(_ => form.append(_, data[_]));
    form.append('deleted_files', JSON.stringify(deleted_files));
    form.append('file_num', files.length);

    files.forEach((file, index) => {
        if ( typeof(file) === "string" ) {
            form.append(`file_${index}`, file);
            form.append(`file_${index}_type`, "iframe");
        }
        else {
            form.append(`file_${index}`, file);
            form.append(`file_${index}_ext`, file_information(file, "ext"));
            form.append(`file_${index}_name`, file_information(file, "name"));
            form.append(`file_${index}_type`, file_information(file, "type"));
            form.append(`file_${index}_size`, file_information(file, "size"));
        }
    });
    $.ajax({
        url: url, method: "POST", data: form,
        processData: false, contentType: false,
        headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN")},
        success: (data) => {
            if ( data.status == true ) {
                location.replace(back_url);
            }
            else if ( data.status == "email" ) {
                $(".screen_loader1").fadeOut(100);
                setTimeout( _ => show_msg(text('exists_email'), "error"), 100);
            }
            else if ( data.status == "name" ) {
                $(".screen_loader1").fadeOut(100);
                setTimeout( _ => show_msg(text('exists_name'), "error"), 100);
            }
            else {
                $(".screen_loader1").fadeOut(100);
                setTimeout( _ => show_msg(text('error_msg'), "error"), 100);
            }
        },
        error: (data) => {
            $(".screen_loader1").fadeOut(100);
            setTimeout( _ => show_msg(text('error_msg'), "error"), 100);
        }
    });

}
function slider_image (image) {

    let type = file_information(image, "type");
    $("input[name='change-image']").val('');
    if ( type != "image" && type != "video" ) return show_msg(text('error_image'), "error");

    var fr = new FileReader();
    fr.onload = function () {
        if ( type == 'image' ) {
            mySwiper.appendSlide(`
                <div class="swiper-slide relative no-select pointer">
                    <img src="${fr.result}">
                    <div class="actions absolute">
                        <a class="delete-slide">
                            <span class="material-symbols-outlined icon">close</span>
                        </a>
                        <a onclick="navigator.clipboard.writeText('${fr.result}')">
                            <span class="material-symbols-outlined icon">content_copy</span>
                        </a>
                        <a href="${fr.result}" download>
                            <span class="material-symbols-outlined icon">arrow_downward</span>
                        </a>
                    </div>
                </div>
            `);
        }
        if ( type == 'video' ) {
            mySwiper.appendSlide(`
                <div class="swiper-slide relative no-select pointer">
                    <video src="${fr.result}"></video>
                    <div class="actions absolute">
                        <a class="delete-slide">
                            <span class="material-symbols-outlined icon">close</span>
                        </a>
                        <a onclick="navigator.clipboard.writeText('${fr.result}')">
                            <span class="material-symbols-outlined icon">content_copy</span>
                        </a>
                        <a href="${fr.result}" download>
                            <span class="material-symbols-outlined icon">arrow_downward</span>
                        </a>
                    </div>
                </div>
            `);
        }
        mySwiper.slideTo($(".swiper-slide").length);
        $(".count-sliders, .current-index").text($(".swiper-slide").length);
        files.push(image);
    }
    fr.readAsDataURL(image);

}
function add_image (image) {

    let type = file_information(image, "type");
    $("input[name='change-image']").val('');
    if ( type != "image" ) return show_msg(text('error_image'), "error");

    var fr = new FileReader();
    fr.onload = function () {
        $(".banner-image").attr("src", fr.result);
        files = [image];
    }
    fr.readAsDataURL(image);

}
function set_swiper () {

    let images = $("#item-images").text() && JSON.parse($("#item-images").text());

    mySwiper = new Swiper('.edit-item-info .my-slider', {
        speed: 400,
        slidesPerView: 'auto',
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        on: {
            beforeInit() {
                const slides = this.el.querySelectorAll('.edit-item-info .swiper-slide');
                if (slides) {
                    this.params.loop = slides.length > 1;
                    this.params.autoplay.enabled = slides.length > 1;
                }
            },
        }
    });
    mySwiper.on('slideChange', function () {
        $(".edit-item-info .current-index").text($(".swiper-slide").length ? mySwiper.activeIndex + 1 : 0);
        $(".edit-item-info video").each(function(){ this.pause(); });
    });
    $(".edit-item-info .my-slider").on("click", "video", function(){
        if ( this.paused ) this.play();
        else this.pause();
    });
    $(".edit-item-info .my-slider").on("click", ".delete-slide", function(){
        if ( $(this).parents('.swiper-slide').attr('id') ) deleted_files.push(parseInt($(this).parents('.swiper-slide').attr('id')));
        files = files.slice(0, mySwiper.activeIndex).concat(files.slice(mySwiper.activeIndex+1))
        mySwiper.removeSlide(mySwiper.activeIndex);
        $(".count-sliders").text($(".swiper-slide").length);
        $(".current-index").text($(".swiper-slide").length ? mySwiper.activeIndex + 1 : 0);
    });
    $(".edit-item-info .add-url-btn").on("click", function(){
        get_details(text('external_video'), text('url'), text('submit'));
    });
    $(".get-details form").on("submit", function(){
        let src = $(this).find("input").val();
        mySwiper.appendSlide(`
            <div class="swiper-slide relative no-select pointer">
                <iframe src="${src}" allowfullscreen></iframe>
                <div class="actions absolute">
                    <a class="delete-slide">
                        <span class="material-symbols-outlined icon">close</span>
                    </a>
                    <a onclick="navigator.clipboard.writeText('${src}')">
                        <span class="material-symbols-outlined icon">content_copy</span>
                    </a>
                </div>
            </div>
        `);
        mySwiper.slideTo($(".swiper-slide").length);
        $(".count-sliders, .current-index").text($(".swiper-slide").length);
        files.push(src);
    });
    if ( images ) {
        
        images.forEach(_ => {

            let host = window.location.protocol + "//" + window.location.host;
            let link = `${host}/static/media/${_[2]}`;

            let src = `<video src="/static/media/${_[2]}"></video>`;
            if ( _[1] === 'image' ) src = `<img src="/static/media/${_[2]}">`;
            else if ( _[1] === 'iframe' ) src = `<iframe src="${_[2].split('/').slice(1).join('/')}" allowfullscreen></iframe>`;
            
            if ( _[1] === 'iframe' ) {
                mySwiper.appendSlide(`
                    <div class="swiper-slide relative no-select pointer" id="${_[0]}">
                        ${src}
                        <div class="actions absolute">
                            <a class="delete-slide">
                                <span class="material-symbols-outlined icon">close</span>
                            </a>
                            <a onclick="navigator.clipboard.writeText('${_[2].split('/').slice(1).join('/')}')">
                                <span class="material-symbols-outlined icon">content_copy</span>
                            </a>
                        </div>
                    </div>
                `);
            }
            else {
                mySwiper.appendSlide(`
                    <div class="swiper-slide relative no-select pointer" id="${_[0]}">
                        ${src}
                        <div class="actions absolute">
                            <a class="delete-slide">
                                <span class="material-symbols-outlined icon">close</span>
                            </a>
                            <a onclick="navigator.clipboard.writeText('${link}')">
                                <span class="material-symbols-outlined icon">content_copy</span>
                            </a>
                            <a href="${link}" download>
                                <span class="material-symbols-outlined icon">arrow_downward</span>
                            </a>
                        </div>
                    </div>
                `);
            }

        });
        
        $(".edit-item-info .current-index").text(1);
        $(".edit-item-info .count-sliders").text($(".swiper-slide").length);
        // mySwiper.slideTo($(".swiper-slide").length);
        // $(".edit-item-info .current-index").text($(".swiper-slide").length);
        
    }

}
function text_editor (element, height) {

    let options = [
        {'header': [1, 2, 3, 4]},
        {'list': 'ordered'},
        {'list': 'bullet'},
        'bold',
        'italic',
        'underline',
        'image',
        'video',
        'link',
        'clean',
        'strike',
        {'script': 'sub'},
        {'script': 'super'},
    ];
    let lang = localStorage.getItem("_x_locale");
    lang = lang ? JSON.parse(lang) : "en";
    if ( lang === 'ar' ) options = options.reverse();
    new Quill(element, { modules: { toolbar: options }, theme: 'snow' });
    $(element).find('.ql-editor').css({'min-height': height || "12rem", 'max-height': height || "12rem"});

}
function manage_item (url, multi) {

    back_url = `/${url || ''}`;
    if ( multi ) set_swiper();

    $(".edit-item-info").on("click", ".add-img-btn", function(){
        $("input[name='change-image']").click();
    });
    $(".edit-item-info").on("change", "input[name='change-image']", function(){
        let all_files = $("input[name='change-image']")[0].files;
        if ( multi ) Array.from(all_files).forEach(_ => _ ? slider_image(_) : '');
        else Array.from(all_files).forEach(_ => _ ? add_image(_) : '');
    });
    $(".edit-item-info .editor").each(function(){
        text_editor(this, $(this).attr("height"));
    });
    $(".edit-item-info .sortable").each(function(){
        Sortable.create(this, { animation: 200 });
    });
    $(".edit-item-info").on("click", ".delete-item", function(){

        if ( confirm(text('delete_item_msg')) ) {

            $(".screen_loader1").css({"display": "flex", "align-items": "center"});

            $.ajax({
                url: back_url, method: "POST", data: {"ids": JSON.stringify([param()])},
                headers: {"X-XSRF-TOKEN": get_cookie("XSRF-TOKEN")},
                success: (data) => { location.replace(back_url); },
                error: (data) => {
                    $(".screen_loader1").fadeOut(100);
                    setTimeout( _ => show_msg(text('error_msg'), "error"), 100);
                }
            });

        }

    });

    if ( !$("input#date").val() ) $("input#date").val(get_date('date'));
    let date = new Date(get_date());
    date.setDate(date.getDate() + 10);
    date = get_date('', date).split(":").slice(0, -1).join(":");
    if ( !$("input#expire_date").val() ) $("input#expire_date").val(date);
    $(`.sidebar ul a[href='${back_url}']`).addClass("active");
    $(".edit-item-info .close-item").click(_ => location.replace(back_url));

}
