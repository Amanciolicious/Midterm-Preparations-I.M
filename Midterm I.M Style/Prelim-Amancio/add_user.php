    <?php
    include("dbconnection.php");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $student_name = $_POST['student_name'] ?? '';
        $school = $_POST['school'] ?? '';
        $school_address = $_POST['school_address'] ?? '';
        $contact_number = $_POST['contact_number'] ?? '';
        $coordinator = $_POST['coordinator'] ?? '';
        $organization = $_POST['organization'] ?? '';
        $date_started = $_POST['date_started'] ?? date('Y-m-d H:i:s');
        $profileImagePath = null;

        $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        $maxFileSize = 2 * 1024 * 1024; // 2MB

        if (!empty($_FILES["profileImage"]["name"])) {
            $uploadDir = "profiles/";
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $imageName = time() . "_" . basename($_FILES["profileImage"]["name"]);
            $uploadFile = $uploadDir . $imageName;
            $fileType = $_FILES["profileImage"]["type"];
            $fileSize = $_FILES["profileImage"]["size"];

            if (!in_array($fileType, $allowedTypes) || $fileSize > $maxFileSize) {
                echo json_encode(["status" => "error", "message" => "Invalid file type or size."]);
                exit;
            }

            if (move_uploaded_file($_FILES["profileImage"]["tmp_name"], $uploadFile)) {
                $profileImagePath = $uploadDir . $imageName; // Correct path
            } else {
                $profileImagePath = null; // Ensure a default value if upload fails
            }
            
            
        }

        try {
            $sql = "INSERT INTO students_tbl (student_name, school, school_address, contact_number, coordinator, organization, date_started, profile_image) 
                    VALUES (:student_name, :school, :school_address, :contact_number, :coordinator, :organization, :date_started, :profile_image)";
            $stmt = $connection->prepare($sql);
            $stmt->bindParam(':student_name', $student_name);
            $stmt->bindParam(':school', $school);
            $stmt->bindParam(':school_address', $school_address);
            $stmt->bindParam(':contact_number', $contact_number);
            $stmt->bindParam(':coordinator', $coordinator);
            $stmt->bindParam(':organization', $organization);
            $stmt->bindParam(':date_started', $date_started);
            $stmt->bindParam(':profile_image', $profileImagePath, PDO::PARAM_STR);
            $stmt->execute();

            echo json_encode(["status" => "success", "message" => "User added successfully."]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
        }
    }
    ?>
