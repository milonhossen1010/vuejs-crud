$(document).ready(function () {

    //Img Preview Function
    function imgPreviewFunction(id, load_url) {
        $(id).change(function (e) {
            let file_url = URL.createObjectURL(e.target.files[0]);

            $(load_url).attr('src', file_url);
        });

    }

    //Img load
    imgPreviewFunction('#photo', '#load-img');
    imgPreviewFunction('#edit-photo', '#load-photo');

    //Form prevent default
    $('form').submit(function (e) {
        e.preventDefault();
        $("#load-img").attr('src', 'photos/users/avatar.jpg');

    });

    //Toggle code
    $('#searchForm').show();
    $('#myForm').hide();
    $("#add-user").click(function () {
        $('#myForm').slideDown(700);
        $('#searchForm').slideUp('slow');
    });

    $('#search').click(function () {
        $('#myForm').slideUp('slow');
        $('#searchForm').slideDown(700);
    });

    //division and Gender Show hide
    $('#genderID').hide();
    $(".division li input").click(function(){
        // $('#genderID').hide();
        // $(".input:checked").each(function() {
        //     $('#genderID').show();
        // });

        // if($('.input').prop("checked") == true){
        //     $('#genderID').show();
        // }
        // else if($('.input').prop("checked") == false){
        //     $('#genderID').hide();
        // }

        
        // if($(this).is(":checked")){
        //     $('#genderID').show();
        // }
        // else if($(this).is(":not(:checked)")){
        //     $('#genderID').hide();
        // }

        
    });

  

});




/**
 * Vue JS code
 */

const root = new Vue({
    el: "#root",
    data: {
        user: {
            name: '',
            email: '',
            cell: '',
            division: '',
            gender: '',
            photo: '',
        },
        alert: {
            success: false,
            danger: false,
            warning: false,
            mess: ''
        },
        all_users: [],
        all_division: [],
        search_users: [],
        singleUser: {
            id: '',
            name: '',
            email: '',
            cell: '',
            division: '',
            gender: '',
            photo: ''
        },
        search: {
            key: '',
            division: [],
            gender: '',
        },

    },

    //Methods
    methods: {

        // Add user
        insertUser: function () {
            if (root.user.name == "" || root.user.email == '' || root.user.cell == '' || root.user.division == '' || root.user.gender == '') {

                root.alert.danger = true;
                root.alert.mess = "All field are required!";

            } else {

                root.user.photo = root.$refs.file.files[0];

                let userData = new FormData();
                userData.append('name', root.user.name);
                userData.append('email', root.user.email);
                userData.append('cell', root.user.cell);
                userData.append('division', root.user.division);
                userData.append('gender', root.user.gender);
                userData.append('photo', root.user.photo);

                axios.post('inc/user.php?action=create', userData, {
                    header: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(function (response) {
                    root.showUser();
                    root.user.name = '';
                    root.user.email = '';
                    root.user.cell = '';
                    root.user.division = '';
                    root.user.gender = '';
                    root.user.photo = '';


                });
                root.alert.success = true;
                root.alert.danger = false;
                root.alert.mess = "User added successful.";
            }

        },

        //Show all user 
        showUser: function () {

            axios.get('inc/user.php?action=read').then(function (response) {
                root.all_users = response.data;
                root.all_division = response.data;
                  
            });

             
        },

        //Delete user
        deleteUser: function (id) {
            // let con = confirm('Are you sure?');

            // alertify
            alertify.confirm("Are you sure?", function (e) {
                if (e) {
                    alertify.success("User Delete successful!!");
                    axios.post('inc/user.php?action=delete', {
                        delete_id: id
                    }).then(function (response) {
                        root.showUser();
                    });

                } else {
                    alertify.error("You've clicked Cancel");
                    return false;
                }
            });

            
            
        },

        //Single user show
        singleUserShow: function (id) {
            axios.get('inc/user.php?action=singleshow&id=' + id).then(function (response) {
                root.singleUser.id = response.data.id;
                root.singleUser.name = response.data.name;
                root.singleUser.email = response.data.email;
                root.singleUser.cell = response.data.cell;
                root.singleUser.division = response.data.division;
                root.singleUser.gender = response.data.gender;
                root.singleUser.photo = response.data.photo;
            });
        },

        //Edit user
        updateUser: function () {
            if (root.$refs.editPhoto.files[0]) {
                root.singleUser.photo = root.$refs.editPhoto.files[0];
            }


            let update = new FormData();
            update.append('id', root.singleUser.id);
            update.append('name', root.singleUser.name);
            update.append('email', root.singleUser.email);
            update.append('cell', root.singleUser.cell);
            update.append('division', root.singleUser.division);
            update.append('gender', root.singleUser.gender);
            update.append('photo', root.singleUser.photo);


            if (root.singleUser.name == '' || root.singleUser.email == '' || root.singleUser.cell == '' || root.singleUser.division == '' || root.singleUser.gender == '') {
                root.alert.danger = true;
                root.alert.mess = "All field are required!";
            } else {
                axios.post('inc/user.php?action=update', update).then(function (response) {
                    root.showUser();
                    $('#myModal').modal('hide');
                });

            }

        },

        //Search 
        searchUser: function (gender) {
            // this.search_users.push(this.all_users.find(div => div.division == division));
            
            //Key word get
            let search_text = root.search.key;
            // Form data
            let searchDiv = new FormData();
           
            
            searchDiv.append('div', this.search.division);
  
           
           if(this.search.division==''){
            $('#genderID').hide();
            searchDiv.append('gender', '');
           }else {
            $('#genderID').show();
            searchDiv.append('gender', this.search.gender);
           }
             
            axios.post('inc/user.php?action=search&s=' + search_text , searchDiv).then(function (response) {
                
           
                root.all_users = response.data; 
                // console.log(response.data);

            });

            

        },

        //Search 
        searchGender: function (g) {
            axios.get('inc/user.php?action=searchGender&gender=' + g).then(function(response){
                root.all_users = response.data; 
            });
            //  this.search_users.push(this.all_users.find(variant => variant.division == division));
            
        },







    },

    //Created
    created: function () {
        this.showUser();
    }







});