import './Home.css';
import './MarkdownRenderer'

import * as react from '@monaco-editor/react';
import { useRef, useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { Button, Card, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, FluentProvider, Input, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, webLightTheme, TreeItem, Tree, TreeItemLayout, Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider } from '@fluentui/react-components';
// import '@fluentui/react-components';



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

    const [path, setPath] = useState('/');

    const Bread = () => {
        const dirs: string[] = ["root"].concat(path.split('/').slice(1, -1));
        return (
            <Breadcrumb>
                {
                    dirs.map((value: string, index: number) => {
                        const divider = index == dirs.length - 1 ? <></> : <BreadcrumbDivider />
                        return (
                            <>
                            <BreadcrumbItem>
                                <BreadcrumbButton>{value}</BreadcrumbButton>
                            </BreadcrumbItem>
                            {divider}
                            </>
                        );
                    })
                }
            </Breadcrumb>)
    }

    const [fileListPointer, setFileListPointer]: any[] = useState(fileList.children);

    const FileList = () => {
        return (
            <Tree>
            {
                fileListPointer.map((value: any, index: number) => {
                    if(value.children == null){
                        // ファイル
                        return (
                            <TreeItem itemType="leaf">
                                <TreeItemLayout onClick={() => {setSaveName(path + value.filename)}}>
                                    <div className='file-icon'>&#xE7C3;</div>
                                    <div className='file-list-name'>{value.filename}</div>
                                </TreeItemLayout>
                            </TreeItem>
                        )
                    }
                    // ディレクトリ
                    return (
                        <TreeItem itemType="leaf">
                            <TreeItemLayout onClick={(e) => {
                                    console.log(value.filename);
                                    const fullPath = path + value.filename + "/";
                                    setPath(fullPath)

                                    const newFileListPointer: object = (((dirName: string, fileListPointer: any[]) => { for(const dir of fileListPointer){if(dir.filename == dirName) return dir} })(value.filename, fileListPointer)).children;
                                    setFileListPointer(newFileListPointer);
                                    // console.log(newFileListPointer);
                                    // setFileListPointer(fileListPointer.children[value.filename].children)
                                    // const dirs: string[] = fullPath.split('/').slice(1, -1);
                                    // console.log(dirs)
                                    
                                }}>
                                <div className='file-icon'>&#xE8B7;</div>
                                <div className='file-list-name'>{value.filename}</div>
                            </TreeItemLayout>
                        </TreeItem>
                    )
                })
            }
            </Tree>
        )
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
                            <Bread />
                            <FileList />
                            {/* <FileNodes fileList={fileList.children} /> */}
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