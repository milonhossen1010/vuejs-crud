<?php
// Database connection
$con = new mysqli('localhost','root','','v-project');

//Data Edit 
if(isset($_GET['edit_id'])){
    $edit_id = $_GET['edit_id'];
    $sql  = ("SELECT * FROM users WHERE id = '$edit_id' ");
    $data = $con -> query($sql);

    $single_data = $data -> fetch_assoc();

    echo json_encode($single_data);
}

//Data update
if(isset($_GET['name']) && isset($_GET['email']) && isset($_GET['cell'] ) ){
    $id = $_GET['id'];
    $name = $_GET['name'];
    $email = $_GET['email'];
    $cell = $_GET['cell'];

    $sql = ("UPDATE users SET name='$name', email='$email', cell='$cell' WHERE id='$id' ");
    $con -> query($sql);

  
}


if(isset($_GET['id'])){
   //Data show
    $data = $con -> query("SELECT * FROM users ORDER by id DESC");
    $all_users = [];
    while($user = $data -> fetch_assoc()){
        array_push($all_users, $user);
    };
    echo json_encode($all_users);
}


