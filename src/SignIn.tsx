import { useState } from "react";
import "./SignIn.css"
import { Button, Card, FluentProvider, Input, Label, webLightTheme } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

const SignIn = () => {
    const { t } = useTranslation();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const OnSignIn = () => {
        fetch("/cgi-bin/login", {
            method: 'POST',
            body: JSON.stringify({username: username, password: password}),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((e) => {
            console.log(e)
        });
    }

    return (
        <div className="sign-in">
            <h1 className="page-title">{t('Sign in')}</h1>
            <FluentProvider theme={webLightTheme}>
                <div className="input-area">
                    <Card>
                        <Label>{t('Username')}</Label>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                        <Label>{t('Password')}</Label>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                        <Button appearance="primary" onClick={() => OnSignIn()}>{t('Sign in')}</Button>
                    </Card>
                </div>
            </FluentProvider>
        </div>
    );
}

export default SignIn;