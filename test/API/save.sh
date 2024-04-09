username="hikari"
session_id="e932356a-d3da-4d94-a8c8-317ae6b75414"
body="{\"username\": \"${username}\", \"session_id\": \"${session_id}\", \"data\": \"aG9nZWhvZ2U=\", \"file_path\": \"/README.md\"}"
curl -X POST -H "Content-Type: application/json" "http://localhost:8080/cgi-bin/save" -d "${body}"
