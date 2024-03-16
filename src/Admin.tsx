import { useCookies } from "react-cookie";
import "./Admin.css"
import { t } from "i18next";
import { Button, FluentProvider, Input, Label, webLightTheme } from "@fluentui/react-components";

const Admin = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['username', 'session_id', 'user_type']);
    
    if(cookies.user_type != "administrators"){
        window.location.href = "/";
        return (<></>);
    }

    return (
        <div>
            <FluentProvider theme={webLightTheme}>
                <h2>{t('Create an account')}</h2>
                <div>
                    <Label>
                        {t('Username')}
                    </Label>
                    <Input className="account-register-input" />
                </div>
                <div className="account-register">
                    <Label>
                        {t('Password')}
                    </Label>
                    <Input className="account-register-input" type="password"/>
                </div>
                <div className="account-register">
                    <Button appearance="primary">{t('Create')}</Button>
                </div>
            </FluentProvider>
        </div>
    )
};

export default Admin;