<?php
  header("Content-Type: text/xml; charset=UTF-8");
  header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
  header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
  header("Cache-Control: no-store, no-cache, must-revalidate");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>
    <data><item>
    <error>false</error>
    <message>삭제완료</message>
  </item></data>
  ";
?>
