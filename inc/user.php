<?php
//Database connection
$conn = new mysqli('localhost','root','','vue-2');

//Data get 
$data = file_get_contents('php://input');
$user = json_decode($data);

//Get action value
$action = 'read';
if(isset($_GET['action'])){
    $action = $_GET['action'];
}


//Add user
if($action == 'create'){
    //Value get 
    $name       = $_POST['name'];
    $email      = $_POST['email'];
    $cell       = $_POST['cell'];
    $division   = $_POST['division'];
    $gender     = $_POST['gender'];

    $unique_name = 'avatar.jpg';
    if(isset($_FILES['photo'])){
        $file_name = $_FILES['photo']['name'];
        $file_tmp_name = $_FILES['photo']['tmp_name'];

        $fil_array = explode('.',$file_name);
        $extension = end($fil_array);
        $unique_name = md5(time().rand()).'.'.$extension;
        move_uploaded_file($file_tmp_name,'../photos/users/'.$unique_name);
    }
    
    //Data insert
    $sql = "INSERT INTO users (name, email, cell, division, gender,photo) VALUES ('$name','$email','$cell','$division', '$gender','$unique_name') ";
    $conn -> query($sql);
    
}

//Show user
if($action == 'read'){
    $sql = "SELECT * FROM users ORDER BY id DESC";
    $all_users = $conn -> query($sql);

    $users = [];

   while($user = $all_users -> fetch_assoc()){
    array_push($users, $user);
   }


   $array_data = [
       'all_data'   => json_encode($users),
       'data'   => 'Hello',
   ];

  echo json_encode($users);
}

//Delete user
if($action == 'delete'){
    $id = $user -> delete_id;

    //delete
    $sql = "DELETE FROM users WHERE id = '$id' ";
    $conn -> query($sql);
}


//Single user show
if($action == 'singleshow'){
    $id = $_GET['id'];

    // User data find
    $sql = "SELECT * FROM users WHERE id = $id ";
    $user_data = $conn -> query($sql);
    $single_user = $user_data -> fetch_assoc();

    echo json_encode($single_user);
}

//Update
if($action == 'update'){
    $id = $_POST['id'];
    $photo = $_POST['photo'];
    $name = $_POST['name'];
    $email = $_POST['email'];
    $cell = $_POST['cell'];
    $division = $_POST['division'];
    $gender = $_POST['gender'];

    $unique_name = $photo;

  if(isset($_FILES['photo'])){
    $photo_name = $_FILES['photo']['name'];
    $photo_tmp_name = $_FILES['photo']['tmp_name'];
    $array = explode('.',$photo_name);
    $ext = end($array);
    $unique_name = time().rand(0,10000).'.'.$ext;

    move_uploaded_file($photo_tmp_name, '../photos/users/'.$unique_name);
  }




    $sql = "UPDATE users SET name='$name', email='$email', cell='$cell', division='$division', gender='$gender', photo='$unique_name' WHERE id='$id' ";

    $conn -> query($sql);
}

//Search
if($action == 'search'){


    $sear_data =  $conn -> query("SELECT * FROM users ");
    if($_POST['div'] OR $_GET['s'] OR $_POST['gender']){

        //Keyword search 
        $search_text = $_GET['s'];
        if($_POST['div'] == false AND $search_text){
            $key =  " name LIKE '%$search_text%'  ";
        }elseif($search_text){
         $key =  " && name LIKE '%$search_text%'  ";
        }else{
           $key = '';
        }

        // //Division Search
        $divs = $_POST['div'];
        $array = explode(',', $divs);
         foreach($array as $arr){
          $all_div[] = "'" . $arr . "'";
         }
        $divi = implode(',', $all_div);

        if($divs){
            $divisions = " division IN ($divi)";
        }else {
            $divisions = '';
        }

        //Gender search
        $gender = $_POST['gender'];
        if($gender == 'all'){
             $gen = '';
        }elseif ($gender == 'female' OR $gender == 'male') {
            
             $gen = " && gender IN ('$gender') ";
        } else {
             $gen = '';
        }
 

        $sear_data =  $conn -> query("SELECT * FROM users WHERE $divisions $key   $gen ");
    }


    $search_result = [];
    while($search = $sear_data -> fetch_assoc()){
        array_push($search_result, $search);
    }
  echo json_encode($search_result);


     
}

//Search
// if($action == 'searchGender'){
    
//     if($_GET['gender']){
//         $gender = $_GET['gender'];
//         $sear_data =  $conn -> query("SELECT * FROM users WHERE gender LIKE '$gender' ");
//     }
            

//     $search_result = [];
//     while($search = $sear_data -> fetch_assoc()){
//         array_push($search_result, $search);
//     }
//     echo json_encode($search_result);


     
// }