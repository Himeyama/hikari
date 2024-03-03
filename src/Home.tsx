import './Home.css';
import './MarkdownRenderer'

import * as react from '@monaco-editor/react';
import { useRef, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { Button, Card, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, FluentProvider, Input, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, webLightTheme, TreeItem, Tree, TreeItemLayout } from '@fluentui/react-components';


const Home = () => {
    const Mainmenu = () => {
        return (
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <Button>ファイル</Button>
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        <MenuItem onClick={onSaveClick}>保存</MenuItem>
                        <MenuItem onClick={onExportClick}>Markdown にエクスポート</MenuItem>
                        <MenuItem>PDF にエクスポート</MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>);
    }

    const NoFilenameDialog = () => {
        return (
            <Dialog open={filenameErrorOpen}>
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

    const [editorText, setEditorText] = useState('');
    const editorRef = useRef("");
    const [fileStyle, setFileStyle] = useState({ width: 0 });
    const [saveName, setSaveName] = useState("");
    const [filenameErrorOpen, setFilenameErrorOpen] = useState(false);

    const handleEditorDidMount = (editor: any, _monaco: any) => {
        editorRef.current = editor;
    }

    const handleEditorChange = (value: string | undefined, _ev: any) => {
        console.log(value)
        if (value)
            setEditorText(value);
    }

    const fileClick = () => {
        if (fileStyle.width == 0) {
            setFileStyle({ width: 274 });
        } else {
            setFileStyle({ width: 0 });
        }
    }

    const onSaveClick = () => {
        if (saveName == "") {
            // return ()
            setFilenameErrorOpen(true);
        }
        console.log(`保存: ${saveName}`);
    }

    const onExportClick = () => {
        if (saveName == "") {
            // return ()
            setFilenameErrorOpen(true);
        }
        console.log(`エクスポート: ${saveName}`);
    }

    const fileList = {
        filename: "root",
        children: [
            {
                filename: "tmp",
                children: null
            },
            {
                filename: "etc",
                children: [
                    {
                        filename: "environment",
                        children: null
                    }
                ]
            },
            {
                filename: "usr",
                children: [
                    {
                        filename: "bin",
                        children: [
                            {
                                filename: "ls",
                                children: null
                            },
                            {
                                filename: "echo",
                                children: null
                            }
                            ,
                            {
                                filename: "cat",
                                children: null
                            }
                        ]
                    }
                ]
            }]
    };

    const FileNodes = (props: any) => {
        const files = props.fileList.map((item: any) => {
            if(item.children == null){
                const filePath = (props.path ? props.path : "/") + item.filename;
                return (
                    <TreeItem itemType="leaf" onClick={(e) => setSaveName(filePath)}>
                        <TreeItemLayout>{item.filename}</TreeItemLayout>
                    </TreeItem>);
            }
            return FileNodes({fileList: item.children, filename: item.filename, path: (props.path ? props.path : "/") + item.filename + "/"});
        });

        const filename = () => {
            if(props.filename != null){
                return <TreeItemLayout>{props.filename}</TreeItemLayout>
            }else{
                return <></>
            }
        }
    
        const tree = (
            <TreeItem itemType='branch'>
                {
                    filename()
                }
                <Tree>
                    {files}
                </Tree>
            </TreeItem>
        );
        return tree;
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
                        <Input placeholder='保存名' style={{ width: '100%' }} onChange={(e) => setSaveName(e.target.value)} value={saveName} />
                    </div>
                    <div className='logout-button'>
                        <Button>サインアウト</Button>
                    </div>
                </div>
                <div className='editor-preview'>
                    <div className='menu'>
                        <div className='file' onClick={fileClick}>
                            &#xE7C3;
                        </div>
                    </div>
                    <div className='menu-subpanel' style={fileStyle}>
                        <div className='menu-subpanel-area'>
                            <FileNodes fileList={fileList.children} />
                            {/* <Tree>
                                <TreeItem itemType='branch'>
                                    <TreeItemLayout>dir</TreeItemLayout>

                                    <Tree>
                                        <TreeItem itemType="branch">
                                            <TreeItemLayout>dir2</TreeItemLayout>
                                        </TreeItem>

                                        <TreeItem itemType="leaf">
                                            <TreeItemLayout>file1</TreeItemLayout>
                                        </TreeItem>
                                    </Tree>
                                </TreeItem>

                                <TreeItem itemType="leaf">
                                    <TreeItemLayout>file2</TreeItemLayout>
                                </TreeItem>
                            </Tree> */}
                        </div>
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