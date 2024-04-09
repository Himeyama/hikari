username="hikari"
session_id="ba88015d-6899-486c-9f7b-ad541908cdd2"
body="{\"username\": \"${username}\", \"session_id\": \"${session_id}\", \"data\": \"aG9nZWhvZ2U=\", \"file_path\": \"/README.md\"}"
curl -X POST -H "Content-Type: application/json" "http://localhost:8080/cgi-bin/save" -d "${body}"
