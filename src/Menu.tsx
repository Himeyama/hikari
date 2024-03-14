import { Button, Menu, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const MainMenu = (props: any) => {
    const { t } = useTranslation();
    
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
                <Button className='MenuButton'>{t('Files')}</Button>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={() => props.setNewDocumentDialogOpen(true)}>{t('New')}</MenuItem>
                    <MenuItem onClick={onSaveClick}>{t('Save')}</MenuItem>
                    <MenuItem onClick={onExportClick}>{t('Export to Markdown')}</MenuItem>
                    <MenuItem>{t('Export to PDF')}</MenuItem>
                    <MenuDivider />
                    <MenuItem>{t('Sign out')}</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>);
}

const EditMenu = () => {
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <Button className='MenuButton'>{t('Edit')}</Button>
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
                <Button className='MenuButton'>{t('Help')}</Button>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={() => props.setAboutDialogOpen(true)}>{t('About this app')}</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>);
}

export { MainMenu, EditMenu, HelpMenu };