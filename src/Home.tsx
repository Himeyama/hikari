import './Home.css';
import './Markdown.css'
import './MarkdownRenderer'

import * as react from '@monaco-editor/react';
import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { NewDocumentDialog, HelpDialog, NoFilenameDialog } from './Dialog';
import { Bread, FileList } from './Explorer';
import { EditMenu, HelpMenu, MainMenu } from './Menu';
import { ExplorerClick } from './SideMenu';
import { useCookies } from 'react-cookie';

let fileList = {
    filename: "root",
    children: []
};

const url = "http://localhost:8080/cgi-bin/document-structure";

let refreshSignal: boolean = true;
const Home = () => {
    const [editorText, setEditorText] = useState('');
    const explorerWidth = localStorage.getItem('openExplorer') == 'true' ? 274 : 0
    const [fileStyle, setFileStyle] = useState({ width: explorerWidth });
    const [saveName, setSaveName] = useState("");
    const [filenameErrorOpen, setFilenameErrorOpen] = useState(false);
    const [newDocumentDialogOpen, setNewDocumentDialogOpen] = useState(false);
    const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
    const [path, setPath] = useState('/');
    const [fileListPointer, setFileListPointer]: any[] = useState(fileList.children);
    const [cookies, setCookie, removeCookie] = useCookies(['username', 'session_id']);

    // 仮想ディレクトリの内容を取得
    if (refreshSignal) {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ username: cookies.username, session_id: cookies.session_id }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res: any) => {
            const json = res.json();
            json.then((json: any) => {
                if (json.status != "{}") {
                    fileList = json;
                    setFileListPointer(fileList.children);
                } else {
                    console.log("Get document structure failure");
                }
            })
        }).catch((err: any) => {
            console.log(err);
        });
        refreshSignal = false;
    }

    const OnAuth = () => {
        if(cookies.session_id == ""){
            console.log("Sign out");
            window.location.href = "/login";
            return;
        }

        if(!cookies.session_id){
            console.log("No session id");
            return;
        }

        return;
    }

    const handleEditorChange = (value: string | undefined, _ev: any) => {
        if (value)
            setEditorText(value);
    }

    OnAuth();

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const [theme, setTheme] = useState(mql.matches);
    mql.addEventListener("change", (e) => {
        setTheme(e.matches);
    });

    return (
        <FluentProvider theme={theme ? webDarkTheme : webLightTheme}>
            <NewDocumentDialog newDocumentDialogOpen={newDocumentDialogOpen} setNewDocumentDialogOpen={setNewDocumentDialogOpen} />
            <NoFilenameDialog filenameErrorOpen={filenameErrorOpen} setFilenameErrorOpen={setFilenameErrorOpen} />
            <HelpDialog aboutDialogOpen={aboutDialogOpen} setAboutDialogOpen={setAboutDialogOpen} />
            <div className="App">
                <div className="menu-navigations">
                    <div className='main-menu'>
                        <MainMenu setFilenameErrorOpen={setFilenameErrorOpen} setNewDocumentDialogOpen={setNewDocumentDialogOpen} />
                    </div>
                    <div className='edit-button'>
                        <EditMenu />
                    </div>
                    <div className='help-button'>
                        <HelpMenu setAboutDialogOpen={setAboutDialogOpen} />
                    </div>
                </div>
                <div className='editor-preview'>
                    <div className='menu'>
                        <div className='file' onClick={() => ExplorerClick(fileStyle, setFileStyle)}>
                            &#xE7C3;
                        </div>
                    </div>
                    <div className='menu-subpanel' style={fileStyle}>
                        <div className='menu-subpanel-area'>
                            <Bread setPath={setPath} setFileListPointer={setFileListPointer} fileList={fileList} path={path} setSaveName={setSaveName} />
                            <FileList fileListPointer={fileListPointer} setFileListPointer={setFileListPointer} path={path} setPath={setPath} setSaveName={setSaveName} />
                        </div>
                    </div>
                    <div className='editor'>
                        <div className="editor-card">
                            <react.Editor
                                className='monaco-editor'
                                defaultLanguage="markdown"
                                defaultValue=""
                                theme={theme ? "vs-dark" : "light"}
                                // onMount={handleEditorDidMount}
                                onChange={handleEditorChange} />
                        </div>
                    </div>

                    <div className='markdown-preview'>
                        <div className="preview-card">
                            <MarkdownRenderer markdown={editorText} />
                        </div>
                    </div>
                </div>
            </div>
        </FluentProvider>
    );
}

export default Home;