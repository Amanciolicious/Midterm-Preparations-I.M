<?php
include("dbconnection.php");

if (isset($_POST['id'])) {
    $id = $_POST['id'];
    $sql = "SELECT * FROM students_tbl WHERE assign_id = :id";
    $stmt = $connection->prepare($sql);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($user);
}
?>
