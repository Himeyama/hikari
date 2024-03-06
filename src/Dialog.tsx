import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Input } from "@fluentui/react-components";

const NewDocumentDialog = (props: any) => {
    return (
        <Dialog open={props.newDocumentDialogOpen}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>ファイル名を入力してください</DialogTitle>
                    <DialogContent className='input-new-filename'>
                        <Input />
                        <Button appearance='primary'>決定</Button>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={() => props.setNewDocumentDialogOpen(false)}>閉じる</Button>
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
                    <DialogTitle>アプリについて</DialogTitle>
                    <DialogContent>
                        <div>このアプリはドキュメントを作成するサービスを提供しています</div>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={() => props.setAboutDialogOpen(false)}>閉じる</Button>
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
