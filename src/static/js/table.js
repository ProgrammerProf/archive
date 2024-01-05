let _titles_ = [];
let _data_ = [];

function _delete_ (id) {

    _data_ = _data_.filter(_ => _[0] !== id);
    _set_();

}
function _insert_ (row) {

    if ( _data_.filter(_ => _[0] === parseInt(row[0]) ).length ) return;
    _data_.unshift(row);
    _set_();

}
function _set_ () {

    let table = `
        <table class="dataTable-table">
            <thead>
                <tr>
                    ${_titles_.map(_ => `<th><a class="dataTable-sorter">${text(_)}</a></th>`)}
                    <th><a>${text('actions')}</a></th>
                </tr>
            </thead>
            <tbody>
                ${
                    _data_.map((_) =>`
                        <tr>
                            ${
                                _.slice(1).map((item, index) =>
                                    index === 0 ? `
                                        <td>
                                            <a href="/edit-task/${_.slice(0, 1)}" class="pointer image for-ar hover:text-primary">
                                                <span class="material-symbols-outlined icon">calendar_today</span>
                                                <span class="font-semibold">${item.slice(0, 30)}...</span>
                                            </a>
                                        </td>
                                    ` : index === 2 ? (
                                        item === 'True' ?
                                        `<td><span class='no-select badge badge-outline-success'>${text('finished')}</span></td>`
                                        : `<td><span class='no-select badge badge-outline-warning'>${text('pending')}</span></td>`
                                    )
                                    : `<td><a class="default font-semibold">${item}</a></td>`
                                )
                            }
                            <td class="buttons gap-4">
                                <button class="btn btn-sm btn-outline-danger" onclick="_delete_(${_[0]})">${text('delete')}</button>
                            </td>
                        </tr>
                    `)
                }
            </tbody>
        </table>
        ${!_data_.length ? `<div class='empty'>${text('no_data')}</div>` : ''}
    `;

    $(".table").html(table.replace(/,/g, ''));
    $(".table").parents('.div-table').css({'overflow': 'auto'});

}
function _get_ () {

    return _data_.map(_ => _[0]);

}
function _set_file_ ( isdelete ) {

    let table = `
        <table class="dataTable-table">
            <thead>
                <tr>
                    ${_titles_.map(_ => `<th><a class="dataTable-sorter">${text(_)}</a></th>`)}
                    <th><a>${text('actions')}</a></th>
                </tr>
            </thead>
            <tbody>
                ${
                    _data_.map((_) => {
                        
                        let icon = '';
                        if ( _.type === 'image' ) icon = "<span class='material-symbols-outlined icon'>image</span>";
                        else if ( _.type === 'video' ) icon = "<span class='material-symbols-outlined icon'>play_circle</span>";
                        else icon = "<span class='material-symbols-outlined icon'>folder_open</span>";

                        return `
                            <tr id="${_.id}">
                                <td>
                                    <a class="default image for-ar">
                                        <div class="layer-div">${icon}</div>
                                        <span class="font-semibold">${_.name}</span>
                                    </a>
                                </td>
                                <td><a class="default">${_.size}</a></td>
                                <td><a class="default">${_.date}</a></td>
                                <td class="buttons gap-4">
                                    <a href="${_.link}" class="btn btn-sm btn-outline-primary pointer" target="_blank">
                                        ${text('open')}
                                    </a>
                                    <a href="${_.link}" class="btn btn-sm btn-outline-success pointer" download="${_.name}">
                                        ${text('download')}
                                    </a>
                                    ${
                                        isdelete ? '' :
                                        `
                                        <button class="btn btn-sm btn-outline-danger" onclick="deleted_files.push(${_.id}); $(this).parents('tr').remove()">
                                            ${text('delete')}
                                        </button>
                                        `
                                    }
                                </td>
                            </tr>
                        `;
                    })
                }
            </tbody>
        </table>
        ${!_data_.length ? `<div class='empty'>${text('no_data')}</div>` : ''}
    `;

    $(".table").html(table.replace(/,/g, ''));
    $(".table").parents('.div-table').css({'overflow': 'auto'});

}
function _delete_file_ ( id ) {
    
    files = files.filter(_ => _.id !== id);
    $(`.table table tbody tr#${id}`).remove();
    if ( !$(".table table tbody tr td").length ) $(".table .empty").show();
    
}
function _add_file_ ( row, isdelete ) {

    let icon = '';
    if ( row.type === 'image' ) icon = "<span class='material-symbols-outlined icon'>image</span>";
    else if ( row.type === 'video' ) icon = "<span class='material-symbols-outlined icon'>play_circle</span>";
    else icon = "<span class='material-symbols-outlined icon'>folder_open</span>";

    let item = `
        <tr id="${row.id}">
            <td>
                <a class="default image for-ar">
                    <div class="layer-div">${icon}</div>
                    <span class="font-semibold">${row.name}</span>
                </a>
            </td>
            <td><a class="default">${row.size}</a></td>
            <td><a class="default">${row.date}</a></td>
            <td class="buttons gap-4">
                <a href="${row.link}" class="btn btn-sm btn-outline-primary pointer" target="_blank">${text('open')}</a>
                <a href="${row.link}" class="btn btn-sm btn-outline-success pointer" download="${row.name}">${text('download')}</a>
                <button class="btn btn-sm btn-outline-danger" onclick="_delete_file_(${row.id})">${text('delete')}</button>
            </td>
        </tr>
    `;

    $(".table table tbody").prepend(item);
    $(".table .empty").hide();

}
function _file_ ( isdelete ) {

    const file_data = ( file ) => {

        var fr = new FileReader();
        fr.readAsDataURL(file);

        fr.onload = function () {

            let name = file_information(file, 'name');
            let size = file_information(file, 'size');
            let type = file_information(file, 'type');
            let date = get_date('date');
            let id = new Date().getTime() + files.length;
            if ( type !== 'image' && type !== 'video' ) type = 'file';

            let row = {
                'id': id, 'link': fr.result, 'name': name,
                'type': type, 'size': size, 'date': date
            }

            _add_file_(row, isdelete);

            file.id = id;

            files.push(file);

        }

    }
    $(".add-file-table").on("click", function(){

        $(".div-table input[type='file']").click();

    });
    $(".div-table input[type='file']").on("change", function(){

        let all_files = $(this)[0].files;
        Array.from(all_files).forEach(_ => file_data(_))
        $(this).val('');

    });

    _set_file_(isdelete);

}
function _table_ ( isfile, isdelete ) {

    let data = JSON.parse($("#data-table").text());
    if ( !data ) return;

    _titles_ = data.titles || [];
    _data_ = data.data || [];
    if ( isfile ) _file_(isdelete);
    else _set_();

}
