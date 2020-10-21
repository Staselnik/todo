<?php

$host = 'localhost';
$dbname = 'u0701138_todo';
$login = 'u0701138_root';
$password = 'p10xvk145igm';

$db = getDbConnect($host, $dbname, $login, $password);

// Установка соединения с БД
function getDbConnect($host, $dbname, $login, $password){
    $db = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
    $db->exec("SET CHARACTER SET utf8");
    return $db;
}

// Функция для получения из БД
function getData($db, $sql){
    $stmt = $db->query($sql);
    $rows = $stmt->fetchAll();
    return $rows;
}

// Получает все списки и их таски
function getListsData($db){
    $lists = getData($db, "SELECT * FROM `lists`");
    foreach($lists as $list_key => $list){
        $tasks = getData($db, "SELECT * FROM `tasks` WHERE `list_id` = " . $list['id'] . ' ORDER BY `num`');
        $lists[$list_key]['tasks'] = $tasks;
    }
    return $lists;
}

// Управление списками
function addList($db, $list_name = ''){
    $sql = "INSERT INTO `lists` (`name`) VALUES ('$list_name')";
    $db->query($sql);
    return $db->lastInsertId();
}
function editList($db, $list_id, $list_name){
    $sql = "UPDATE `lists` SET `name` = '$list_name' WHERE `id` = $list_id";
    $db->query($sql);
}
function deleteList($db, $list_id){
    $sql = "DELETE FROM `lists` WHERE `id` = $list_id";
    $db->query($sql);
    
    $sql = "DELETE FROM `tasks` WHERE `list_id` = $list_id";
    $db->query($sql);
}

// Управление тасками
function addTask($db, $list_id, $task_num, $task_name, $task_deadline){
    $sql = "INSERT INTO `tasks` (`list_id`, `num`, `name`, `deadline`) VALUES ($list_id, '$task_num', '$task_name', '" . strtotime($task_deadline) . "')";
    $db->query($sql);
    return $db->lastInsertId();
}
function editTask($db, $task_id, $list_id, $task_num, $task_name, $task_ended, $task_deadline){
    $sql = "UPDATE `tasks` SET `list_id` = '$list_id', `num` = '$task_num', `name` = '$task_name', `ended` = '$task_ended', `deadline` = '" . strtotime($task_deadline) . "' WHERE `id` = $task_id";
    $db->query($sql);
}
function moveTask($db, $tasks){
    
    foreach($tasks as $task){
        $sql = "UPDATE `tasks` SET `num` = '" . $task['num'] . "', `ended` = '" . $task['ended'] . "' WHERE `id` = " . $task[id];
        $db->query($sql);
    }
}
function deleteTask($db, $task_id){
    $sql = "DELETE FROM `tasks` WHERE `id` = $task_id";
    $db->query($sql);
}
