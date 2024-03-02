// 必要なファイルを読み込み
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// サーバーのtop directory定義
const topdir = './';

// mime type定義
const mime = {
    '.html': 'text/html',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript',
    '.png': 'image/png'
    // 必要に応じてmime typeを追加
};

// CGI実処理
function cgiHandler(reqPath) {
    // コマンド、query設定
    const command = reqPath.split('/')[2].split('?')[0];
    const queryString = reqPath.split('/')[2].split('?')[1];

    // これはpython3.6で実行するcommand限定
    const result = execSync(`cd ${topdir}cgi-bin; QUERY_STRING="${queryString}" python3.6 ${command}`).toString();
    const separateHeadBody = result.split('\n\n');

    let head, body;
    if (separateHeadBody.length === 1) {
        head = { 'content-Type': 'text/plain' };
        body = separateHeadBody[0];
    } else {
        head = parseHeader(separateHeadBody[0]);
        body = separateHeadBody[1];
    }

    return { head, body };
}

// cgiのレスポンスパース処理
function parseHeader(headerString) {
    const headerLines = headerString.split('\n');
    const header = {};
    for (const line of headerLines) {
        const [key, value] = line.split(': ');
        header[key] = value;
    }
    return header;
}

// ファイル読み込みじゃないURIの処理
function otherHandler(reqPath) {
    try {
        // html内のファイルなら読み込み
        let filePath = path.join(topdir, 'build', reqPath.split('?')[0]);
        if (filePath === path.join(topdir, 'build/')) {
            filePath = path.join(topdir, 'build/index.html');
        }
        const data = fs.readFileSync(filePath);
        const contentType = mime[path.extname(filePath)] || 'text/plain';
        return { status: 200, data, contentType };
    } catch (err) {
        // ファイルが無いならNot Foundにする
        return { status: 404, data: Buffer.from('404 Not Found\n'), contentType: 'text/plain' };
    }
}

// HTTPサーバーのリクエストハンドラ
const server = http.createServer((req, res) => {
    const reqPath = req.url;
    if (reqPath.startsWith('/cgi-bin')) {
        const { head, body } = cgiHandler(reqPath);
        res.writeHead(200, head);
        res.write(body);
    } else {
        const { status, data, contentType } = otherHandler(reqPath);
        res.writeHead(status, { 'Content-Type': contentType });
        res.write(data);
    }
    res.end();
});

// サーバーの起動
const port = 8080;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
