// Add new List
$('body').on('click', 'button.add_list', function () {
    let new_list = $('.list.empty_list').clone();
    let list_id = 'list_id' + Math.random();

    new_list.removeClass('empty_list');
    new_list.find('.tasks').html('');

    new_list.find('.tasks').sortable({
        placeholder: "ui-state-highlight",
        handle: '.move',
        axis: "y",
        update: function (event, ui) {
            setTaskNum(new_list);
        },
    }).disableSelection();

    $.ajax({
        url: '/scripts.php',
        type: "POST",
        data: {
            add_list: 1,
            name: new_list.find('h2').html(),
        },
        success: function (data) {
            console.log(data);
            new_list.attr('data-listId', data);
            $('.lists').append(new_list);
        },
        error: function (msg) {
            console.log('ERR: ');
            console.log(msg);
        }
    });

});

// Remove List
$('body').on('click', '.list_head .remove', function () {

    $.ajax({
        url: '/scripts.php',
        type: "POST",
        data: {
            remove_list: 1,
            id: $(this).closest('.list').attr('data-listId'),
        },
        success: function (data) {
            console.log(data);
        },
        error: function (msg) {
            console.log('ERR: ');
            console.log(msg);
        }
    });

    $(this).closest('.list').remove();
});

// Edit List Name
$('body').on('click', '.list_head .edit', function () {
    $(this).removeClass('edit fa-pencil');
    $(this).addClass('save fa-check');

    let list_name = $(this).siblings('h2');
    list_name.html("<textarea>" + list_name.html() + "</textarea>");
});

// Save List Name
$('body').on('click', '.list_head .save', function () {
    $(this).removeClass('save fa-check');
    $(this).addClass('edit fa-pencil');

    let list_name = $(this).siblings('h2');

    $.ajax({
        url: '/scripts.php',
        type: "POST",
        data: {
            edit_list: 1,
            id: $(this).closest('.list').attr('data-listId'),
            name: list_name.find('textarea').val(),
        },
        success: function (data) {
            console.log(data);
        },
        error: function (msg) {
            console.log('ERR: ');
            console.log(msg);
        }
    });

    list_name.html(list_name.find('textarea').val());
});

// Add new Task
$('body').on('click', '.add_task_sub', function () {
    let this_list = $(this).closest('.list');

    let new_task = $('.list.empty_list .task_one').clone();

    let task_name = $(this).siblings('.add_task_name').val();
    let task_id = 'id' + Math.random();
    let task_num = this_list.find('.task_one').length;
    let task_deadline = this_list.find('.add_task_deadline').val();

    new_task.find('.task_check input').attr('id', task_id);
    new_task.find('label').attr('for', task_id);
    new_task.find('.task_name').html(task_name);
    console.log(task_name);
    $.ajax({
        url: '/scripts.php',
        type: "POST",
        data: {
            add_task: 1,
            list_id: this_list.attr('data-listId'),
            name: task_name,
            deadline: task_deadline,
            num: task_num,
        },
        success: function (data) {
            console.log(data);
            new_task.attr('data-taskId', data);
            this_list.find('.tasks').append(new_task);
            setTaskNum(this_list.find('.tasks'));
        },
        error: function (msg) {
            console.log('ERR: ');
            console.log(msg);
        }
    });

});

// Edit Task Name
$('body').on('click', '.task_one .edit', function () {
    $(this).removeClass('edit fa-pencil');
    $(this).addClass('save fa-check');

    let task_name = $(this).closest('.task_one').find('label');
    task_name.html("<textarea>" + task_name.html() + "</textarea>");

    let task_deadline = $(this).closest('.task_one').find('.task_deadline');
    task_deadline.html('<input type="date" class="task_deadline_input" value=' + task_deadline.attr('data-inputFormat') + '>');
});

// Save Task Name
$('body').on('click', '.task_one .save', function () {
    $(this).removeClass('save fa-check');
    $(this).addClass('edit fa-pencil');

    let task_name = $(this).closest('.task_one').find('label');
    let task_deadline = $(this).closest('.task_one').find('.task_deadline');

    let check = 0;
    if ($(this).closest('.task_one').find('.task_check input').prop("checked"))
        check = 1;

    $.ajax({
        url: '/scripts.php',
        type: "POST",
        data: {
            edit_task: 1,
            id: $(this).closest('.task_one').attr('data-taskId'),
            list_id: $(this).closest('.list').attr('data-listId'),
            num: $(this).closest('.task_one').attr('data-taskNum'),
            name: task_name.find('textarea').val(),
            deadline: task_deadline.find('input').val(),
            ended: check,
        },
        success: function (data) {
            console.log(data);
        },
        error: function (msg) {
            console.log('ERR: ');
            console.log(msg);
        }
    });

    task_deadline.attr('data-inputFormat', task_deadline.find('input').val());
    task_deadline.html(formatDate(task_deadline.find('input').val()));
    task_name.html(task_name.find('textarea').val());
});

// Remove Task
$('body').on('click', '.task_one .remove', function () {
    let task_one = $(this).closest('.task_one');
    let tasks = task_one.parent();

    $.ajax({
        url: '/scripts.php',
        type: "POST",
        data: {
            remove_task: 1,
            id: task_one.attr('data-taskId'),
        },
        success: function (data) {
            console.log(data);
        },
        error: function (msg) {
            console.log('ERR: ');
            console.log(msg);
        }
    });

    task_one.remove();
    setTaskNum(tasks);

});

// Перебирает список тасков и задаёт номер по порядку
function setTaskNum(tasks) {
    let num = 1;
    let tasks_id_num = [];
    tasks.find('.task_one').each(function () {
        let task_name = $(this).find('textarea').val();
        if (!task_name)
            task_name = $(this).find('label').html();
        let check = 0;
        if ($(this).find('.task_check input').prop("checked"))
            check = 1;

        $(this).attr('data-taskNum', num);
        let new_data = {
            edit_task: 1,
            id: $(this).attr('data-taskId'),
            list_id: $(this).closest('.list').attr('data-listId'),
            num: num,
            ended: check,
            name: task_name,
        };
        tasks_id_num.push(new_data);
        num++;
    });

    $.ajax({
        url: '/scripts.php',
        type: "POST",
        data: {
            move_task: 1,
            tasks_id_num: tasks_id_num,
        },
        success: function (data) {
            console.log(data);
        },
        error: function (msg) {
            console.log('ERR: ');
            console.log(msg);
        }
    });
}

function formatDate(date_input) {
    if(date_input == '') return "--";
    let date = new Date(date_input);

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();

    return dd + '.' + mm + '.' + yy;
}
