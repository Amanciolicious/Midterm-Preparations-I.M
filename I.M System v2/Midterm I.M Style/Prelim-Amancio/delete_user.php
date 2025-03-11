<?php
include("dbconnection.php");

if (isset($_POST['id'])) {
    $id = $_POST['id'];

    // Prepare the DELETE query
    $sql = "DELETE FROM students_tbl WHERE assign_id = :id";
    $stmt = $connection->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo "User deleted successfully";
    } else {
        echo "Failed to delete user";
    }
} else {
    echo "No ID provided";
}
?>
