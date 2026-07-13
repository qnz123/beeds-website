<?php
/**
 * BEEDS booking mailer (HostGator / shared PHP hosting).
 *
 * Receives the booking form's JSON POST, emails the request to the studio, and
 * sends a confirmation to the visitor — both from the beedstu.com address.
 * Sits at the web root alongside the static site; the form POSTs to
 * /booking-submit.php (see BOOKING_ENDPOINT in BookingCalendar.tsx).
 */

header('Content-Type: application/json; charset=utf-8');

// --- Config -----------------------------------------------------------------
$STUDIO_EMAIL = 'booking@beedstu.com'; // must be a real mailbox on this domain
$FROM_NAME    = 'BEEDS';

// --- Method guard -----------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// --- Read input (JSON body, or form-encoded fallback) -----------------------
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

// --- Honeypot: silently accept bot submissions without emailing -------------
if (!empty($data['company'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// --- Sanitize (strip CR/LF to prevent header injection) ---------------------
function bd_clean($v) {
    return trim(str_replace(["\r", "\n", "\0"], ' ', (string) $v));
}
$name    = bd_clean($data['name']    ?? '');
$email   = bd_clean($data['email']   ?? '');
$service = bd_clean($data['service'] ?? '');
$date    = bd_clean($data['date']    ?? 'N/A');
$time    = bd_clean($data['time']    ?? 'N/A');
$message = trim((string) ($data['message'] ?? ''));

// --- Validate ---------------------------------------------------------------
if ($name === '' || $service === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Missing or invalid fields']);
    exit;
}

$fromHeader = "$FROM_NAME <$STUDIO_EMAIL>";

// --- Email 1: notify the studio (reply goes straight to the visitor) --------
$subjectStudio = "New session request — $service";
$bodyStudio =
    "Service: $service\n" .
    "Date: $date\n" .
    "Time: $time\n" .
    "Name: $name\n" .
    "Email: $email\n\n" .
    ($message !== '' ? "Note:\n$message\n" : "Note: —\n");
$headersStudio =
    "From: $fromHeader\r\n" .
    "Reply-To: $name <$email>\r\n" .
    "Content-Type: text/plain; charset=UTF-8\r\n";
$sentStudio = @mail($STUDIO_EMAIL, $subjectStudio, $bodyStudio, $headersStudio);

// --- Email 2: confirmation to the visitor -----------------------------------
$subjectVisitor = 'We’ve received your request — BEEDS';
$bodyVisitor =
    "Hi $name,\n\n" .
    "Thank you for reaching out to BEEDS. We’ve received your session request and " .
    "will be in touch.\n\n" .
    "Your request\n" .
    "Service: $service\n" .
    "Date: $date\n" .
    "Time: $time\n" .
    ($message !== '' ? "\nYour note\n$message\n" : '') .
    "\n— BEEDS\n$STUDIO_EMAIL\n";
$headersVisitor =
    "From: $fromHeader\r\n" .
    "Reply-To: $STUDIO_EMAIL\r\n" .
    "Content-Type: text/plain; charset=UTF-8\r\n";
$sentVisitor = @mail($email, $subjectVisitor, $bodyVisitor, $headersVisitor);

// --- Respond ----------------------------------------------------------------
// Success hinges on the studio actually being notified; the visitor copy is a
// best-effort extra.
if ($sentStudio) {
    echo json_encode(['ok' => true, 'confirmationSent' => (bool) $sentVisitor]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail send failed']);
}
