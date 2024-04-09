## load api

| Method | Destination   |
|:-------|:--------------|
|POST    | /cgi-bin/load |

### Algorithm
```mermaid
graph TB
    A([Client: Retrieve username and session ID from cookie])
    C(["Client: Send username, session ID, filename to Server"])
    D([Server: Authenticate using username and session ID])
    E([Server: If authentication is successful, proceed to next step])
    F([Server: If authentication fails, reply to Client with authentication failure])
    H([Server: Read data from file])
    G([Server: Encode Base64 data])
    I([Server: Reply data with successful])
    A --> C
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
        Server->>Server: Read data
        Server->>Server: Encode Base64 data
        Server->>Client: Reply encoded data with Successful message
    else Authentication failure
        Server->>Client: Reply "Authentication failed"
    end
```

