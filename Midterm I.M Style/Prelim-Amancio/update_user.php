<?php
include("dbconnection.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get data from the form
    $id = $_POST['id'];  // Make sure 'id' is being passed correctly
    $student_name = $_POST['student_name'];
    $school = $_POST['school'];
    $school_address = $_POST['school_address'];
    $contact_number = $_POST['contact_number'];
    $coordinator = $_POST['coordinator'];
    $organization = $_POST['organization'];
    $date_started = $_POST['date_started'];

    // Ensure that the required fields are not empty
    if (empty($id) || empty($student_name) || empty($school) || empty($contact_number)) {
        echo "Required fields are missing!";
        exit;
    }

    // Prepare the SQL statement to update the user
    try {
        $sql = "UPDATE students_tbl SET 
                    student_name = :student_name, 
                    school = :school, 
                    school_address = :school_address, 
                    contact_number = :contact_number, 
                    coordinator = :coordinator, 
                    organization = :organization, 
                    date_started = :date_started
                WHERE assign_id = :id";

        $stmt = $connection->prepare($sql);

        // Bind parameters
        $stmt->bindParam(':student_name', $student_name);
        $stmt->bindParam(':school', $school);
        $stmt->bindParam(':school_address', $school_address);
        $stmt->bindParam(':contact_number', $contact_number);
        $stmt->bindParam(':coordinator', $coordinator);
        $stmt->bindParam(':organization', $organization);
        $stmt->bindParam(':date_started', $date_started);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT); // Ensure 'id' is properly bound

        // Execute the query
        if ($stmt->execute()) {
            echo "User updated successfully!";
        } else {
            echo "Error updating user: " . $stmt->errorInfo()[2];
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
