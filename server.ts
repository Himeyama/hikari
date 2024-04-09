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

const Server = (port: number) => {
    const crypto = require("crypto");
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database("test.db");

    const count_table_query = `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='users'`;
    db.get(count_table_query, (_err: any, row: any) => {
        const count = row["COUNT(*)"];
        if (count > 0) {
            console.log(`テーブルは存在します。`);
        } else {
            console.log(`テーブルは存在しません。`);
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

    const authenticate = (username: string, session_id: string, callback: (status: string) => void) => {
        const db = new sqlite3.Database("test.db");
        db.get(`SELECT * FROM users WHERE username = "${username}" AND session_id = "${session_id}"`, (_err: any, row: any) => {
            let status: string = "NG";
            if(row){
                status = "OK";
            }
            callback(status);
        })
        db.close();
    }

    const authenticate2 = async (username: string, session_id: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database("test.db");
            db.get(`SELECT * FROM users WHERE username = "${username}" AND session_id = "${session_id}"`, (_err: any, row: any) => {
                db.close();
                if (row) {
                    resolve("OK");
                } else {
                    reject("NG");
                }
            });
        });
    };

    app.post("/cgi-bin/auth", (req: any, res: any) => {
        const username: string = req.body.username;
        const session_id: string = req.body.session_id;
        console.log("\nPOST /cgi-bin/auth");
        console.log(`${username}@${session_id}`);
        authenticate(username, session_id, (status: string) => {
            res.type("application/json");
            res.send(JSON.stringify({status: status}));
        });
        // Invoke-WebRequest -Method Post -Uri "http://localhost:8080/cgi-bin/auth" -Body $(@{"username" = "hikari"; "session_id" = "hogehoge" } | ConvertTo-Json)
    })

    const getUUIDFromDatabase = (username: string, session_id: string, callback: (uuid: string | null) => void) => {
        const db = new sqlite3.Database("test.db");
        db.get(`SELECT * FROM users WHERE username = "${username}" AND session_id = "${session_id}"`, (_err: any, row: any) => {
            db.close();
            if (row) {
                callback(row.uuid);
            } else {
                callback(null);
            }
        });
    }

    const getUUIDFromDatabase2 = async (username: string, session_id: string): Promise<string | null> => {
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
            console.log("ユーザーディレクトリを作成しました。")
        }

        let tree = makeTree(dir);
        tree = {
            filename: "root",
            children: tree
        };
        const resTree = JSON.stringify(tree, null, 4);
        callback(resTree);
    }

    app.post("/cgi-bin/document-structure", (req: any, res: any) => {
        const username: string = req.body.username;
        const session_id: string = req.body.session_id;

        getUUIDFromDatabase(username, session_id, (uuid) => {
            if (uuid) {
                readDirectoryInfo(uuid, (resTree) => {
                    res.type("application/json");
                    res.send(resTree);
                });
            } else {
                res.type("application/json");
                res.send("{}");
            }
        });
    })

    app.post("/cgi-bin/save", (req: any, res: any) => {
        const username: string = req.body.username;
        const session_id: string = req.body.session_id;
        const base64data: string = req.body.data;
        const filePath: string = req.body.file_path;
        
        console.log("\nPOST /cgi-bin/save");
        console.log(`${username}@${session_id}`);
        console.log(req.body);

        authenticate(username, session_id, (status: string) => {
            let errorMessage = "";
            let error = false;
            res.type("application/json");
            
            res.send(((status) => {
                if(status == "OK"){
                    console.log("認証成功");
                    console.log(`base64data: ${base64data}`);
                    console.log(`filePath: ${filePath}`);
                    const content = Buffer.from(base64data, 'base64').toString('utf8');
                    console.log(`content: ${content}`);

                    getUUIDFromDatabase(username, session_id, (uuid) => {
                        if (uuid) {
                            let realFilePath = path.join("data", uuid);
                            realFilePath = path.join(realFilePath, filePath);
                            const dir = path.dirname(realFilePath);
                            if (!fs.existsSync(dir)){
                                fs.mkdirSync(dir, { recursive: true });
                            }
                            fs.writeFileSync(realFilePath, content);

                            console.log(realFilePath);
                            console.log(`uuid: ${uuid}`);

                        } else {
                            errorMessage = "Unable to get uuid";
                            error = true;
                        }
                    });
                }else{
                    console.log("認証失敗");
                    errorMessage = "Authentication Failed"
                    error = true;
                }

                if(!error){
                    JSON.stringify({status: status});
                }else{
                    JSON.stringify({status: status, errorMessage: errorMessage})
                }
            })(status));
        });
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
    
        console.log("\nPOST /cgi-bin/load");
        console.log(`${username}@${session_id}`);
        console.log(req.body);
    
        try {
            const status: string = await authenticate2(username, session_id);
            if (status !== "OK") {
                console.log("認証失敗");
                throw new Error("Authentication Failed");
            }
    
            console.log("認証成功");
            console.log(`filePath: ${filePath}`);
    
            const uuid = await getUUIDFromDatabase2(username, session_id);
            if (!uuid) {
                console.error("Unable to get uuid");
                throw new Error("Unable to get uuid");
            }
    
            let realFilePath = path.join("data", uuid);
            realFilePath = path.join(realFilePath, filePath);
    
            const base64data = await readFileAsBase64(realFilePath);
            console.log(`data: ${base64data}`);
            console.log(`uuid: ${uuid}`);
    
            res.type("application/json");
            res.send(JSON.stringify({status: status, data: base64data}));
        } catch (err: any) {
            console.error(err.message);
            res.type("application/json");
            res.send(JSON.stringify({status: "ERROR", error: err.message}));
        }
    });

    app.post("/cgi-bin/login", (req: any, res: any) => {
        const bcrypt = require('bcrypt');

        // Invoke-WebRequest http://localhost:8080/cgi-bin/login -Method Post -Body @{username="hikari"; password="pass"}
        const username: string = req.body.username;
        const password: string = req.body.password;
        console.log(`${username}:${password}`)
        console.log(req.body);

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
                    console.log("認証 OK")
                    status = "OK";
                    session_id = sessionUpdate(username);
                    user_type = row?.user_type;
                }else{
                    console.log("認証 NG")
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
        console.log("OK");
    });
};

Server(8080);
