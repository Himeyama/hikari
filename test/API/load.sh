username="hikari"
session_id="0ba21cf5-f108-4b46-b3bc-9886e4ac95e4"
body="{\"username\": \"${username}\", \"session_id\": \"${session_id}\", \"file_path\": \"/README.md\"}"
curl -X POST -H "Content-Type: application/json" "http://localhost:8080/cgi-bin/load" -d "${body}"
