<?php 
// error_reporting(E_ALL ^ E_NOTICE);

$nombreCliente = "";
$numeroCliente = "";
$correoCliente = "";
$mensajeCliente = "";
$problemaCliente = "";
$marcaCliente = "";

if (isset($_POST['clientName']) || isset($_POST['clientNumber']) || isset($_POST['clientMail']) || isset($_POST['clientMsg']) || isset($_POST['clientProblem']) || isset($_POST['clientBrand'])) {
    $nombreCliente = $_POST['clientName'];
    $numeroCliente = $_POST['clientNumber'];
    $correoCliente = $_POST['clientMail'];
    $mensajeCliente = $_POST['clientMsg'];
    $problemaCliente = $_POST['clientProblem'];
    $marcaCliente = $_POST['clientBrand'];

    echo "entró";
}

echo "El nombre del cliente es ";

$mailFrom = "serviciotecnico@911smartphones.com";
$mailTo = "oapm10@gmail.com";

$subject = "PHP Envio de Correo";
$message = "mensaje de jajaja";
$headers = "From: ". $mailFrom;


mail($mailTo, $subject, $message, $headers);

