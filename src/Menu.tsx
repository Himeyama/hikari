import { Button, Menu, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";

const MainMenu = (props: any) => {
    const onSaveClick = () => {
        props.setFilenameErrorOpen(true);
        console.log(`保存`);
    }

    const onExportClick = () => {
        props.setFilenameErrorOpen(true);
        console.log(`エクスポート`);
    }

    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <Button className='MenuButton'>ファイル</Button>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={() => props.setNewDocumentDialogOpen(true)}>新規</MenuItem>
                    <MenuItem onClick={onSaveClick}>上書き保存</MenuItem>
                    <MenuItem onClick={onExportClick}>Markdown にエクスポート</MenuItem>
                    <MenuItem>PDF にエクスポート</MenuItem>
                    <MenuDivider />
                    <MenuItem>サインアウト</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>);
}

const EditMenu = () => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <Button className='MenuButton'>編集</Button>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                </MenuList>
            </MenuPopover>
        </Menu>);
}

const HelpMenu = (props: any) => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <Button className='MenuButton'>ヘルプ</Button>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={() => props.setAboutDialogOpen(true)}>アプリについて</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>);
}

export { MainMenu, EditMenu, HelpMenu };