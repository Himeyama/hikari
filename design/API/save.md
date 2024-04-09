## save api

| Method | Destination   |
|:-------|:--------------|
|POST    | /cgi-bin/save |

### Algorithm
```mermaid
graph TB
    A([Client: Retrieve username and session ID from cookie])
    B([Client: Encode data to Base64])
    C(["Client: Send username, session ID, filename, and data (encoded) to Server"])
    D([Server: Authenticate using username and session ID])
    E([Server: If authentication is successful, proceed to next step])
    F([Server: If authentication fails, reply to Client with authentication failure])
    G([Server: Decode Base64 data])
    H([Server: Save data to filename])
    I([Server: Reply with successful save])
    A --> B
    B --> C
    C --> D
    D --> E
    D --> F
    E --> G
    G --> H
    H --> I
```

### Request body

```json
{
    "username": "USERNAME",
    "session_id": "SESSION_ID",
    "file_path": "FILEPATH",
    "data": "BASE64TEXT"
}
```

```mermaid
sequenceDiagram
    participant Client as Client side
    participant Server as Server side
    Client->>Client: Get user name and session ID from cookie
    Client->>Client: Encode data to Base64
    Client->>Server: Send username, session ID, file name, data (encoded)
    Server->>Server: Authenticate with username and session ID
    alt Authentication successful
        Server->>Server: Decode Base64 data
        Server->>Server: Save data
        Server->>Client: Reply "Save Successful"
    else Authentication failure
        Server->>Client: Reply "Authentication failed"
    end
```

