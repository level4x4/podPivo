<?php
echo "HTTP_CLIENT_IP: " . getenv("HTTP_CLIENT_IP");
echo "<br>";
echo "HTTP_X_FORWARDED_FOR: " . getenv("HTTP_X_FORWARDED_FOR");
echo "<br>";
echo "HTTP_X_FORWARDED: " . getenv("HTTP_X_FORWARDED");
echo "<br>";
echo "HTTP_FORWARDED_FOR: " . getenv("HTTP_FORWARDED_FOR");
echo "<br>";
echo "HTTP_FORWARDED: " . getenv("HTTP_FORWARDED");
echo "<br>";
echo "REMOTE_ADDR: " . getenv("REMOTE_ADDR");
echo "<br>";
echo "HTTP_X_CLUSTER_CLIENT_IP: " . getenv("HTTP_X_CLUSTER_CLIENT_IP");
//echo "<br>";
//echo ": " . getenv("");
//echo "<br>";
//echo ": " . getenv("");
//echo "<br>";