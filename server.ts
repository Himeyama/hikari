const path = require('path');
const fs = require('fs');

const makeTree = (path: string) => {
    let file_list: any = [];
    const files = fs.readdirSync(path);
    for (const filename of files) {
        const full_path = path + '/' + filename;
        if (fs.statSync(full_path).isFile()) {
            file_list.push({
                filename: filename,
                children: null
            });
        } else {
            file_list.push({
                filename: filename,
                children: makeTree(full_path)
            });
        }
    }
    return file_list;
}

const log = (text: string, subText: string = "", color: string = "") => {
    const colorCodes: { [key: string]: string; } = {
        "white": "",
        "red": "\x1b[31m",
        "green": "\x1b[32m",
        "yellow": "\x1b[33m",
        "blue": "\x1b[34m",
        "purple": "\x1b[35m",
        "cyan": "\x1b[36m"
    };

    let current_date = new Date();
    let date = current_date.getFullYear() + "-" + 
        ("0" + (current_date.getMonth() + 1)).slice(-2) + "-" + 
        ("0" + current_date.getDate()).slice(-2) + " " + 
        ("0" + current_date.getHours()).slice(-2) + ":" + 
        ("0" + current_date.getMinutes()).slice(-2) + ":" + 
        ("0" + current_date.getSeconds()).slice(-2);
    if(subText != "")
        subText = ` ${subText}`;

    if (/!$/.test(text) && color == "") {
        color = "red";
    }

    if (colorCodes.hasOwnProperty(color)) {
        text = `${colorCodes[color]}${text}\x1b[0m`;
    }

    console.log(`\x1b[32m[${date}${subText}]\x1b[0m ${text}`);
}

const Server = (port: number) => {
    const crypto = require("crypto");
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database("test.db");

    const count_table_query = `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='users'`;
    db.get(count_table_query, (_err: any, row: any) => {
        const count = row["COUNT(*)"];
        if (count > 0) {
            log("Table does not exist");
        } else {
            db.run("CREATE TABLE users(uuid text, username text, encrypted_password text, session_id text, user_type text, totp text, email text)");
        }
    });
    db.close();

    const express = require("express");
    const app = express();
    
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static('./build'));

    app.get("/login", (_req: any, res: any) => {
        res.sendFile(__dirname + '/build/index.html')
    })

    app.get("/admin", (_req: any, res: any) => {
        res.sendFile(__dirname + '/build/index.html')
    })

    const sessionUpdate = (username: string): string => {
        const session_id = crypto.randomUUID();
        const db = new sqlite3.Database("test.db");
        db.run(`UPDATE users SET session_id = "${session_id}" WHERE username = "${username}"`);
        db.close();
        return session_id;
    }

    const authenticate = async (username: string, session_id: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database("test.db");
            db.get(`SELECT * FROM users WHERE username = "${username}" AND session_id = "${session_id}"`, (_err: any, row: any) => {
                db.close();
                if (row) {
                    log("Authentication Successful", "authenticate");
                    resolve("OK");
                } else {
                    log("Authentication Failure!", "authenticate");
                    reject("NG");
                }
            });
        });
    };

    app.post("/cgi-bin/auth", async (req: any, res: any) => {
        const username: string = req.body.username;
        const session_id: string = req.body.session_id;
        log("POST /cgi-bin/auth", "auth");
        log(`${username}@${session_id}`, "auth");
        try {
            const status = await authenticate(username, session_id);
            res.type("application/json");
            res.send(JSON.stringify({status: status}));
        } catch (error) {
            res.type("application/json");
            res.send(JSON.stringify({status: "NG"}));
        }
        // Invoke-WebRequest -Method Post -Uri "http://localhost:8080/cgi-bin/auth" -Body $(@{"username" = "hikari"; "session_id" = "hogehoge" } | ConvertTo-Json)
    })

    const getUUIDFromDatabase = async (username: string, session_id: string): Promise<string | null> => {
        const sqlite3 = require('sqlite3');
        const { open } = require('sqlite');
        const db = await open({ filename: 'test.db', driver: sqlite3.Database });
        const row = await db.get(`SELECT * FROM users WHERE username = ? AND session_id = ?`, [username, session_id]);
        if (row) {
            return row.uuid;
        } else {
            return null;
        }
    }

    // ディレクトリ情報を読み取る関数
    const readDirectoryInfo = (uuid: string, callback: (resTree: string) => void) => {
        const dir = `data/${uuid}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            log("User directory created", "readDirectoryInfo")
        }

        let tree = makeTree(dir);
        tree = {
            filename: "root",
            children: tree
        };
        const resTree = JSON.stringify(tree, null, 4);
        callback(resTree);
    }

    app.post("/cgi-bin/document-structure", async (req: any, res: any) => {
        const username: string = req.body.username;
        const session_id: string = req.body.session_id;
    
        try {
            const uuid = await getUUIDFromDatabase(username, session_id);
            if (uuid) {
                readDirectoryInfo(uuid, (resTree) => {
                    res.type("application/json");
                    res.send(resTree);
                });
            } else {
                res.type("application/json");
                res.send("{}");
            }
        } catch (error: any) {
            log(`${error.message}!`, "document-structure");
            res.type("application/json");
            res.send("{}");
        }
    });

    app.post("/cgi-bin/save", async (req: any, res: any) => {
        const username: string = req.body.username;
        const session_id: string = req.body.session_id;
        const base64data: string = req.body.data;
        const filePath: string = req.body.file_path;
    
        log("POST /cgi-bin/save", "save");
        log(`${username}@${session_id}`, "save");
        log(req.body, "save");
    
        try {
            const status: string = await authenticate(username, session_id);
            if (status !== "OK") {
                throw new Error("Authentication Failed");
            }

            log(`base64data: ${base64data}`, "save");
            log(`filePath: ${filePath}`, "save");
            const content = Buffer.from(base64data, 'base64').toString('utf8');
            log(`content: ${content}`, "save");
    
            const uuid = await getUUIDFromDatabase(username, session_id);
            if (!uuid) {
                log("Unable to get uuid!", "save");
                throw new Error("Unable to get uuid");
            }
    
            let realFilePath = path.join("data", uuid);
            realFilePath = path.join(realFilePath, filePath);
            const dir = path.dirname(realFilePath);
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(realFilePath, content);
    
            log(realFilePath, "save");
            log(`uuid: ${uuid}`, "save");
    
            res.type("application/json");
            res.send(JSON.stringify({status: status}));
    
        } catch (err: any) {
            log(`${err.message}!`, "save");
            res.type("application/json");
            res.send(JSON.stringify({status: "ERROR", error: err.message}));
        }
    });

    const readFileAsBase64 = (filePath: string): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            fs.access(filePath, fs.constants.F_OK, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    resolve('');
                } else {
                    fs.readFile(filePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data.toString('base64'));
                        }
                    });
                }
            });
        });
    }

    app.post("/cgi-bin/load", async (req: any, res: any) => {
        const username: string = req.body.username;
        const session_id: string = req.body.session_id;
        const filePath: string = req.body.file_path;

        log("POST /cgi-bin/load", "load");
        log(`${username}@${session_id}`, "load");
        log(req.body, "load");
    
        try {
            const status: string = await authenticate(username, session_id);
            if (status !== "OK") {
                throw new Error("Authentication Failed");
            }
    
            log(`filePath: ${filePath}`, "load");
    
            const uuid = await getUUIDFromDatabase(username, session_id);
            if (!uuid) {
                log("Unable to get uuid!", "load");
                throw new Error("Unable to get uuid");
            }
    
            let realFilePath = path.join("data", uuid);
            realFilePath = path.join(realFilePath, filePath);
    
            const base64data = await readFileAsBase64(realFilePath);
            log(`data: ${base64data}`, "load");
            log(`uuid: ${uuid}`, "load");
    
            res.type("application/json");
            res.send(JSON.stringify({status: status, data: base64data}));
        } catch (err: any) {
            log(`${err.message}!`, "load");
            res.type("application/json");
            res.send(JSON.stringify({status: "ERROR", error: err.message}));
        }
    });

    app.post("/cgi-bin/login", (req: any, res: any) => {
        const bcrypt = require('bcrypt');

        // Invoke-WebRequest http://localhost:8080/cgi-bin/login -Method Post -Body @{username="hikari"; password="pass"}
        const username: string = req.body.username;
        const password: string = req.body.password;
        log(`${username}:${password}`, "login")
        log(req.body, "login");

        // const sqlite3 = require('sqlite3').verbose();
        const db = new sqlite3.Database("test.db");
        db.get(`SELECT * FROM users WHERE username = '${username}'`, (_err: any, row: any) => {
            const encrypted_password = row?.encrypted_password;

            // UPDATE users SET session_id = "34ce5224-34bd-4c56-b0ac-61f23792354d" WHERE username = "hikari";
            bcrypt.compare(password, encrypted_password, (_errCompare: any, result: boolean) => {
                res.type("application/json");
                let session_id: string = "";
                let status = "NG";
                let user_type = "";
                if(result){
                    log("Authentication Successful", "log");
                    status = "OK";
                    session_id = sessionUpdate(username);
                    user_type = row?.user_type;
                }else{
                    log("Authentication failure", "log");
                }

                res.send(JSON.stringify({
                    username: username,
                    session_id: session_id,
                    status: status,
                    user_type: user_type
                }));
            });
        });
        db.close();
    });

    app.listen(port, () => {
        log("Listen");
    });
};

Server(8080);
