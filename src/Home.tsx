import './Home.css';
import './MarkdownRenderer'

import * as react from '@monaco-editor/react';
import { useRef, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { Button, Card, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, FluentProvider, Input, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, webLightTheme } from '@fluentui/react-components';


const Home = () => {
    const [editorText, setEditorText] = useState('');
    const editorRef = useRef("");

    function handleEditorDidMount(editor: any, _monaco: any) {
        editorRef.current = editor;
    }

    function handleEditorChange(value: string | undefined, _ev: any) {
        console.log(value)
        
        if (value)
            setEditorText(value);
    }

    const [fileStyle, setFileStyle] = useState({ width: 0 });
    const [saveName, setSaveName] = useState("");

    const fileClick = () => {
        if(fileStyle.width == 0){
            setFileStyle({ width: 274 });
        }else{
            setFileStyle({ width: 0 });
        }
    }

    const saveClick = () => {
        if(saveName == ""){
            // return ()
            setFilenameErrorOpen(true);
        }
        console.log(`保存: ${saveName}`);
    }

    const exportClick = () => {
        if(saveName == ""){
            // return ()
            setFilenameErrorOpen(true);
        }
        console.log(`エクスポート: ${saveName}`);
    }

    const Mainmenu = () => {
        return (<Menu>
            <MenuTrigger disableButtonEnhancement>
            <Button>ファイル</Button>
            </MenuTrigger>

            <MenuPopover>
            <MenuList>
                <MenuItem onClick={saveClick}>保存</MenuItem>
                <MenuItem onClick={exportClick}>Markdown にエクスポート</MenuItem>
                <MenuItem>PDF にエクスポート</MenuItem>
            </MenuList>
            </MenuPopover>
        </Menu>);
    }

    const [filenameErrorOpen, setFilenameErrorOpen] = useState(false);
    const NoFilenameDialog = () => {
        return (<Dialog open={filenameErrorOpen}>
            <DialogSurface>
                <DialogBody>
                <DialogTitle>エラー</DialogTitle>
                <DialogContent>
                    ファイル名が入力されていません
                </DialogContent>
                <DialogActions>
                    <Button appearance="secondary" onClick={() => setFilenameErrorOpen(false)}>閉じる</Button>
                </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>);
    }

    return (
    <FluentProvider theme={webLightTheme}>
        <NoFilenameDialog />
        <div className="App">
            <div className="menu-navigations">
                <div className='main-menu'>
                    <Mainmenu />
                </div>
                <div className='savename'>
                    <Input placeholder='保存名' style={{width: '100%'}} onChange={(e) => setSaveName(e.target.value)}/>
                </div>
                <div className='logout-button'>
                    <Button>サインアウト</Button>
                </div>
            </div>
            <div className='editor-preview'>
                <div className='menu'>
                    <div className='file' onClick={fileClick} />
                </div>
                <div className='menu-subpanel' style={fileStyle}>

                </div>
                <div className='editor'>
                    <Card className="editor-card">
                        <react.Editor className='monaco-editor' defaultLanguage="markdown" defaultValue=""
                            onMount={handleEditorDidMount}
                            onChange={handleEditorChange} />
                    </Card>
                </div>

                <div className='markdown-preview'>
                    <Card className="preview-card">
                        <MarkdownRenderer markdown={editorText} />
                    </Card>
                </div>
            </div>
        </div>
    </FluentProvider>
    );
}

export default Home;