<?php
include("dbconnection.php");

$sql = "SELECT * FROM students_tbl";
$result = $connection->query($sql);
$output = "";

if ($result) {
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $dateStarted = new DateTime($row['date_started']);
        $daysOld = $dateStarted->diff(new DateTime())->days;
        $formattedDateStarted = $dateStarted->format('F j, Y');
        $daysOldMessage = ($daysOld == 1) ? '1 day old' : "$daysOld days old";
        $profileImage = (!empty($row['profile_image']) && file_exists($row['profile_image'])) 
            ? "<img src='{$row['profile_image']}' class='img-thumbnail' style='width: 50px; height: 50px; object-fit: cover;'>"
            : "<i class='bi bi-person-circle' style='font-size: 2rem;'></i>";

        $output .= "
            <tr>
                <td>{$row['assign_id']}</td>
                <td>{$row['student_name']}</td>
                <td>{$row['school']}</td>
                <td>{$row['school_address']}</td>
                <td>{$row['contact_number']}</td>
                <td>{$row['coordinator']}</td>
                <td>{$row['organization']}</td>
                <td title='Started on {$formattedDateStarted}'>{$daysOldMessage}</td>
                <td class='text-center'>{$profileImage}</td>
                <td>
                    <button class='btn btn-warning btn-sm' onclick='openEditModal({$row['assign_id']})'>Edit</button>
                    <button class='btn btn-danger btn-sm' onclick='deleteUser({$row['assign_id']})'>Delete</button>
                </td>
            </tr>
        ";
    }
} else {
    $output .= "<tr><td colspan='10' class='text-center'>No records found</td></tr>";
}

echo $output;
?>
