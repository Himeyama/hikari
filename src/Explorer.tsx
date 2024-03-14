import { Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, Tree, TreeItem, TreeItemLayout } from "@fluentui/react-components";

const Bread = (props: any) => {
    const dirs: string[] = ["/"].concat(props.path.split('/').slice(1, -1));
    return (
        <Breadcrumb>
            {
                dirs.map((value: string, index: number) => {
                    const divider = index == dirs.length - 1 ? <></> : <BreadcrumbDivider />
                    return (
                        <>
                        <BreadcrumbItem>
                            <BreadcrumbButton onClick={(e) => {
                                let button: any = e.target
                                const parent: any = button.parentElement;

                                let target = parent;
                                let node: any[] = [];
                                const limit = 20;
                                for(let i = 0; i < limit; i++){
                                    if(target == null) break;
                                    let txt = target.textContent;
                                    node.push(txt)
                                    target = target.previousElementSibling;
                                }
                                node = node.filter((e) => {return e != ""}).reverse().slice(1);

                                let fListPointer: any = props.fileList.children
                                for(let i = 0; i < node.length; i++){
                                    let target;
                                    for(const target_candidate of fListPointer){
                                        if(target_candidate.filename == node[i]){
                                            target = target_candidate;
                                            break;
                                        }
                                    }
                                    fListPointer = target.children;
                                }
                                if(node.length == 0){
                                    props.setPath('/');
                                }else{
                                    props.setPath("/" + node.join("/") + "/");
                                }
                                props.setFileListPointer(fListPointer);
                            }}>{value}</BreadcrumbButton>
                        </BreadcrumbItem>
                        {divider}
                        </>
                    );
                })
            }
        </Breadcrumb>)
}

const FileList = (props: any) => {
    const dirs = props.fileListPointer.filter((e: any) => {return e.children != null}).sort((a: any, b: any) => {return a.filename > b.filename ? 1 : 0});
    const files = props.fileListPointer.filter((e: any) => {return e.children == null}).sort((a: any, b: any) => {return a.filename > b.filename ? 1 : 0});
    const dirAndFiles = dirs.concat(files);
    return (
        <Tree>
        {
            dirAndFiles.map((value: any) => {
                if(value.children == null){
                    // ファイル
                    return (
                        <TreeItem itemType="leaf">
                            <TreeItemLayout onClick={() => {
                                    props.setSaveName(props.path + value.filename);
                                    console.log(props.path+ value.filename);
                                }}>
                                <div className='file-icon'>&#xE7C3;</div>
                                <div className='file-list-name'>{value.filename}</div>
                            </TreeItemLayout>
                        </TreeItem>
                    )
                }
                // ディレクトリ
                return (
                    <TreeItem itemType="leaf">
                        <TreeItemLayout onClick={() => {
                                console.log(value.filename);
                                const fullPath = props.path + value.filename + "/";
                                props.setPath(fullPath)
                            const newFileListPointer: object = 
                                (((dirName: string, flp: any[]) => {
                                    for (const dir of flp) {
                                        if (dir.filename == dirName)
                                            return dir
                                    }
                                })(value.filename, dirAndFiles)).children;
                                props.setFileListPointer(newFileListPointer);                                    
                            }}>
                            <div className='file-icon-list-name dir-icon'>
                                <div className='file-icon-fill'>&#xE188;</div>
                                <div className='file-icon'>&#xE8B7;</div>
                                <div className='file-list-name'>{value.filename}</div>
                            </div>
                        </TreeItemLayout>
                    </TreeItem>
                )
            })
        }
        </Tree>
    )
}

export { Bread, FileList };
