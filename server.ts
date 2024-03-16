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
            db.run("CREATE TABLE users(uuid text, username text, encrypted_password text, session_id text, totp text, email text)");
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

    app.post("/cgi-bin/save/", (req: any, res: any) => {
        const encodedName: string = req.body.name;
        const encodedContent: string = req.body.content;

        const saveName: string = Buffer.from(encodedName, 'base64').toString('utf-8');
        const content: string = Buffer.from(encodedContent, 'base64').toString('utf-8');

        // Invoke-WebRequest http://localhost:8080/cgi-bin/save/ -Body @{name="L2hvbWUvaGlrYXJpL3Rlc3Q="; content="IyBIZWxsbywgd29ybGQh"} -Method POST
        // INSERT INTO users(uuid, username, encrypted_password) VALUES("f2d73df7-ca9f-462f-9a31-7d9515af3471", "hikari", "$2a$12$y/R.04k0y4gxe9iHyHBTvesmrGQsCS1XGGAjZ/Mnq2bw6C4lwsEua");

        res.send(`${content} ${saveName}`);
        
        // ソルト作成
        // [*[*?0..?9], *[*?a..?z], *[*?A..?Z], ?/, ?.].sample(22).join
    });

    const sessionUpdate = (username: string): string => {
        const session_id = crypto.randomUUID();
        const db = new sqlite3.Database("test.db");
        db.run(`UPDATE users SET session_id = "${session_id}" WHERE username = "${username}"`);
        db.close();
        return session_id;
    }

    app.post("/cgi-bin/auth", (req: any, res: any) => {
        const username: string = req.body.username;
        const session_id: string = req.body.session_id;

        const db = new sqlite3.Database("test.db");
        db.get(`SELECT * FROM users WHERE username = "${username}" AND session_id = "${session_id}"`, (_err: any, row: any) => {
            res.type("application/json");
            let status: string = "NG";
            if(row){
                status = "OK";
            }
            res.send(JSON.stringify({status: status}));
        })
        db.close();
        
    })

    app.post("/cgi-bin/login", (req: any, res: any) => {
        const bcrypt = require('bcrypt');

        // Invoke-WebRequest http://localhost:8080/cgi-bin/login -Method Post -Body @{username="hikari"; password="pass"}
        const username: string = req.body.username;
        const password: string = req.body.password;
        // res.send(`${username}:${password}`);
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
                if(result){
                    console.log("認証 OK")
                    status = "OK";
                    session_id = sessionUpdate(username);
                }else{
                    console.log("認証 NG")
                }

                res.send(JSON.stringify({
                    username: username,
                    session_id: session_id,
                    status: status
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
