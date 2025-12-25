<?php
$host = "YOUR-RDS-ENDPOINT"";
$user = "admin";
$password = ""YOUR-RDS-PASSWORD";
$dbname = "feedbackdb";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die("Database connection failed");
}

$status = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $type = htmlspecialchars($_POST["type"]);
    $message = htmlspecialchars($_POST["message"]);

    $sql = "INSERT INTO feedback (name, email, type, message)
            VALUES ('$name', '$email', '$type', '$message')";

    if ($conn->query($sql)) {
       header("Location: index.php?success=1");
       exit();
}

}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Secure Feedback Portal</title>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f6f9;
}

.header {
  background: #0a0958;
  color: white;
  padding: 28px;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 28px;
}

.header p {
  margin-top: 8px;
  font-size: 15px;
  opacity: 0.9;
}

.main {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.card {
  background: white;
  height: 500px;
  width: 450px;
  padding: 1px 40px 36px 20px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.card h2 {
  text-align: center;
  margin-bottom: 9px;
}

.card .subtitle {
  text-align: center;
  font-size: 14px;
  color: #555;
  margin-bottom: 22px;
}

label {
  display: block;
  margin-top: 12px;
  font-weight: bold;
}

input, textarea, select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  background: #050485;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  cursor: pointer;
}

.status {
  margin-top: 15px;
  color: green;
  text-align: center;
  font-weight: bold;
}

.footer {
  margin-top: 60px;
  background-color: #41413d26;
  padding: 36px;
  text-align: center;
  font-size: 15px;
  color: #666;
}
</style>
</head>

<body>

<header class="header">
  <h1>Secure EC2–RDS Feedback Portal</h1>
  <p>A hands-on demonstration of secure application–database connectivity on AWS</p>
</header>

<main class="main">
  <div class="card">
    <h2>Submit Feedback</h2>
    <div class="subtitle">
      EC2 Application → Private RDS Database
    </div>

    <form method="post">
      <label>Name</label>
      <input name="name" required>

      <label>Email</label>
      <input name="email" type="email" required>

      <label>Feedback Type</label>
      <select name="type" required>
        <option>General Query</option>
        <option>Bug</option>
        <option>Feature Request</option>
      </select>

      <label>Message</label>
      <textarea name="message" rows="4" required></textarea>

      <button type="submit">Submit Feedback</button>
    </form>

    <?php
    if (isset($_GET["success"])) {
       echo "<div class='status'>Feedback submitted successfully.</div>";
       echo "<script>
          if (window.history.replaceState) {
             window.history.replaceState(null, null, window.location.pathname);
          }
       </script>";
    }
    ?>

  </div>
</main>

<footer class="footer">
  AWS EC2 | Amazon RDS | VPC | Security Groups
</footer>

</body>
</html>