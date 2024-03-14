import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Input } from "@fluentui/react-components";
import { t } from "i18next";
import { useTranslation } from "react-i18next";



const NewDocumentDialog = (props: any) => {
    const { t } = useTranslation();

    return (
        <Dialog open={props.newDocumentDialogOpen}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t('Please enter a filename')}</DialogTitle>
                    <DialogContent className='input-new-filename'>
                        <Input />
                        <Button appearance='primary'>{t('OK')}</Button>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={() => props.setNewDocumentDialogOpen(false)}>{t('Close')}</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>);
};

const HelpDialog = (props: any) => {
    return (
        <Dialog open={props.aboutDialogOpen}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t('About this app')}</DialogTitle>
                    <DialogContent>
                        <div>{t('This app provide service to make documents')}</div>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={() => props.setAboutDialogOpen(false)}>{t('Close')}</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>);
};

const NoFilenameDialog = (props: any) => {
    return (
        <Dialog open={props.filenameErrorOpen}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>エラー</DialogTitle>
                    <DialogContent>
                        ファイル名が入力されていません
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={() => props.setFilenameErrorOpen(false)}>閉じる</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>);
}

export { NewDocumentDialog, HelpDialog, NoFilenameDialog };
