$(document).ready(function() {
    loadUsers();
    
    // Attach form submission handlers
    $('#userForm').on('submit', saveUser);
    $('#editUserForm').on('submit', editUser);
    
    // Event listener for date input in the modal
    $('#date_started').on('change', function() {
        calculateDaysOld();
    });
    
    // Make functions available globally
    window.openUserModal = openUserModal;
    window.openEditModal = openEditModal;
    window.deleteUser = deleteUser;
    
});

function loadUsers() {
    $.ajax({
        url: "fetch_user.php", 
        type: "GET",
        success: function(data) {
            $("#userTable").html(data); 
        }
    });
}

function openUserModal(id = null) {
    if (id) {
        // Editing a user
        $.ajax({
            url: "get_user.php",
            type: "POST",
            data: { id: id },
            success: function(response) {
                let user = JSON.parse(response);

                // Set the modal title
                $("#editUserModal .modal-title").text("Edit User");

                // Populate the Edit User form
                $("#edit_user_id").val(user.assign_id);
                $("#edit_student_name").val(user.student_name);
                $("#edit_school").val(user.school);
                $("#edit_school_address").val(user.school_address);
                $("#edit_contact_number").val(user.contact_number);
                $("#edit_coordinator").val(user.coordinator);
                $("#edit_organization").val(user.organization);
                $("#edit_date_started").val(user.date_started);

                // Show the Edit modal
                var editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
                editModal.show();
            }
        });
    } else {
        // Adding a new user
        $("#userModal .modal-title").text("Add User");
        $("#userForm")[0].reset();
        $("#user_id").val('');

        // Show the Add User modal
        var addModal = new bootstrap.Modal(document.getElementById('userModal'));
        addModal.show();
    }
}

// Function to open the Edit User Modal and populate it with data
function openEditModal(userId) {
    $.ajax({
        url: 'get_user.php', // PHP script to fetch user data
        method: 'POST', // Changed to POST to match your server implementation
        data: { id: userId },
        success: function(response) {
            const user = JSON.parse(response);
            
            // Populate the modal fields with user data
            $('#edit_user_id').val(user.assign_id);
            $('#edit_student_name').val(user.student_name);
            $('#edit_school').val(user.school);
            $('#edit_school_address').val(user.school_address);
            $('#edit_contact_number').val(user.contact_number);
            $('#edit_coordinator').val(user.coordinator);
            $('#edit_organization').val(user.organization);
            $('#edit_date_started').val(user.date_started);
            

            // If the user has a profile image, show it
            if (user.profile_image) {
                $('#current_profile_image').html(`<img src="${user.profile_image}" class="img-thumbnail mb-2" style="max-height: 100px;">`);
            } else {
                $('#current_profile_image').html('<p>No profile image</p>');
            }

            // Open the modal
            var editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editModal.show();
        },
        error: function(xhr, status, error) {
            console.error("Error fetching user data:", error);
            showFloatingBanner('Error fetching user data', 'danger');
        }
    });
}

function saveUser(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Create FormData object to handle file uploads
    let formData = new FormData();
    
    // Add all form fields to FormData
    formData.append('student_name', $("#student_name").val());
    formData.append('school', $("#school").val());
    formData.append('school_address', $("#school_address").val());
    formData.append('contact_number', $("#contact_number").val());
    formData.append('coordinator', $("#coordinator").val());
    formData.append('organization', $("#organization").val());
    formData.append('date_started', $("#date_started").val());
    formData.append('profileImage', $("#ProfileImage")[0].files[0]);
    
    // Perform AJAX request to save the user data
    $.ajax({
        url: "add_user.php",
        type: "POST",
        data: formData,
        processData: false, // Don't process the data
        contentType: false, // Don't set content type (browser will set it with boundary)
        success: function(response) {
            console.log(response); // Log response in the console (for debugging)

            // Display success notification as a floating banner
            showFloatingBanner('Data added successfully!');
            
            // Reset the form and hide the modal after success
            $('#userForm')[0].reset();
            $('#userModal').modal('hide');
            
            // Reload the user table
            loadUsers();
        },
        error: function(xhr, status, error) {
            // Handle error
            console.log('Error saving data: ' + error);
            showFloatingBanner('Error saving data', 'danger');
        }
    });
}

function editUser(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Create FormData object to handle file uploads
    let formData = new FormData();
    
    // Add user ID and form fields to FormData
    formData.append('id', $("#edit_user_id").val());
    formData.append('student_name', $("#edit_student_name").val());
    formData.append('school', $("#edit_school").val());
    formData.append('school_address', $("#edit_school_address").val());
    formData.append('contact_number', $("#edit_contact_number").val());
    formData.append('coordinator', $("#edit_coordinator").val());
    formData.append('organization', $("#edit_organization").val());
    formData.append('date_started', $("#edit_date_started").val());
    formData.append('profileImage', $("#ProfileImage")[0].files[0]);

    
    
    // Perform AJAX request to update the user data
    $.ajax({
        url: "update_user.php",
        type: "POST",
        data: formData,
        processData: false, // Don't process the data
        contentType: false, // Don't set content type (browser will set it with boundary)
        success: function(response) {
            console.log(response); // Log response for debugging
            
            // Display success notification as a floating banner
            showFloatingBanner('User updated successfully!');

            // Hide the modal after success
            var editModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            editModal.hide();

            // Reload the user table
            loadUsers();
        },
        error: function(xhr, status, error) {
            console.error("Error updating user:", error);
            showFloatingBanner('Error updating user data', 'danger');
        }
    });
}

function deleteUser(id) {
    if (confirm("Are you sure you want to delete this?")) {
        $.ajax({
            url: "delete_user.php",
            type: "POST",
            data: { id: id },
            success: function(response) {
                showFloatingBanner('User deleted successfully!');
                loadUsers();
            },
            error: function() {
                showFloatingBanner('Error deleting user', 'danger');
            }
        });
    }
}

// Function to calculate days old based on the selected date
function calculateDaysOld() {
    var selectedDate = $('#date_started').val(); // Get the selected date
    if (selectedDate) {
        var currentDate = new Date(); // Get the current date
        var startDate = new Date(selectedDate); // Convert selected date to Date object

        var timeDiff = currentDate - startDate; // Difference in time (milliseconds)
        var daysOld = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

        // Display the days old message
        var message = (daysOld === 1) ? '1 day old' : daysOld + ' days old';
        $('#days-old').text(message); // Update the message in the modal
    }
}

// Function to show the floating banner as a notification
function showFloatingBanner(message, type = 'success') {
    // Create the banner element dynamically
    var banner = $('<div class="floating-banner bg-' + type + ' text-white p-3 text-center">')
        .text(message)
        .css({
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1050,
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'none', // Initially hidden
            width: '300px',
        })
        .hide()
        .appendTo('body'); // Append the banner to the body

    // Show the banner with a fade-in effect
    banner.fadeIn(500);

    // After 3 seconds, hide the banner
    setTimeout(function() {
        banner.fadeOut(500, function() {
            banner.remove(); // Remove the banner from the DOM after hiding
        });
    }, 3000); // Display for 3 seconds
}