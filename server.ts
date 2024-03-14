const Server = (port: number) => {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database("test.db");

    const count_table_query = `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='users'`;
    db.get(count_table_query, (_err: any, row: any) => {
        const count = row["COUNT(*)"];
        if (count > 0) {
            console.log(`テーブルは存在します。`);
        } else {
            console.log(`テーブルは存在しません。`);
            db.run("CREATE TABLE users(uuid text, username text, encrypted_password text, totp text, email text)");
        }
    });

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

    app.post("/cgi-bin/login", (req: any, res: any) => {
        // Invoke-WebRequest http://localhost:8080/cgi-bin/login -Method Post -Body @{username="hikari"; password="pass"}
        const username: string = req.body.username;
        const password: string = req.body.password;
        res.send(`${username}:${password}`);
        console.log(`${username}:${password}`)
        console.log(req.body);
    });

    app.listen(port, () => {
        console.log("OK");
    });
};

Server(8080);
