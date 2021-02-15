<?php 
// error_reporting(E_ALL ^ E_NOTICE);
error_reporting(E_ERROR | E_PARSE);

/************************************************************************************************************* */

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // access
    $secretKey = $_SERVER["HTTP_RECAPTCHA_API_KEY"];
    // $captcha = $_POST['g-recaptcha-response'];
    $token = $_POST['token'];

    // if(!$captcha){
    //   echo '<p class="alert alert-warning">Please check the the captcha form.</p>';
    //   exit;
    // }

    # FIX: Replace this email with recipient email
    $mail_to = "oapm10@gmail.com";
    
    # Sender Data
    $subject = "Servicio Técnico"/*trim($_POST["subject"])*/;
    $name = str_replace(array("\r","\n"),array(" "," ") , strip_tags(trim($_POST["clientName"])));
    $email = filter_var(trim($_POST["clientMail"]), FILTER_SANITIZE_EMAIL);
    $phone = trim($_POST["clientNumber"]);
    $message = trim($_POST["clientMsg"]);
    
    if ( empty($name) OR !filter_var($email, FILTER_VALIDATE_EMAIL) OR empty($phone) OR empty($subject) /*OR empty($message)*/) {
        # Set a 400 (bad request) response code and exit.
        http_response_code(400);
        echo "complete form";
        // echo '<p class="alert alert-warning">Por favor complete el formulario de contacto e intentelo de nuevo.</p>';
        
        exit;
    }

    $ip = $_SERVER['REMOTE_ADDR'];
    $response=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$token."&remoteip=".$ip);
    $responseKeys = json_decode($response,true);

    if(boolval($responseKeys["success"]) !== true && floatval($responseKeys["score"]) < 0.5) {
        http_response_code(500);
        echo "suspicious";
        // echo '<p class="alert alert-warning">Please check the the captcha form.</p>';
    } else {
        # Mail Content
        $content = "Name: $name\n";
        $content .= "Email: $email\n\n";
        $content .= "Phone: $phone\n";
        $content .= "Message:\n$message\n";

        # email headers.
        $headers = "From: $name <$email>";

        # Send the email.
        $success = mail($mail_to, $subject, $content, $headers);
        if ($success) {
            # Set a 200 (okay) response code.
            http_response_code(200);
            echo "success mailing";
            // echo '<p class="alert alert-success">Gracias! Tu mensaje ha sido enviado.</p>';
        } else {
            # Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "fail mailing";
            // echo '<p class="alert alert-warning">Oops! Algo salió mal, no pudimos enviar tu mensaje.</p>';
        }
    }

} else {
    # Not a POST request, set a 403 (forbidden) response code.
    http_response_code(403);
    echo "problem in request";
    // echo '<p class="alert alert-warning">Ha habído un problema con tu envio, por favor inténtelo de nuevo.</p>';
}