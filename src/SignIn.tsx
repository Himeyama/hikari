import { useState } from "react";
import "./SignIn.css"
import { Button, Card, FluentProvider, Input, Label, webLightTheme } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";

const SignIn = () => {
    const { t } = useTranslation();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(['username', 'session_id']);

    const OnSignIn = () => {
        fetch("http://localhost:8080/cgi-bin/login", {
            method: 'POST',
            body: JSON.stringify({username: username, password: password}),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res: any) => {
            const json = res.json();
            json.then((json: any) => {
                if(json.status == "OK"){
                    setCookie("username", json.username);
                    setCookie("session_id", json.session_id);
                    window.location.href = "/";
                }else{
                    console.log("Authentication failure");
                }
            })
        }).catch((err: any) => {
            console.log(err);
        });
    }

    const OnAuth = () => {
        if(!cookies.session_id){
            console.log("No session id");
            return;
        }

        fetch("http://localhost:8080/cgi-bin/auth", {
            method: 'POST',
            body: JSON.stringify({username: cookies.username, session_id: cookies.session_id}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res: any) => {
            const json = res.json();
            json.then((json: any) => {
                if(json.status == "OK"){
                    console.log("Session verification successful");
                    window.location.href = "/";
                }else{
                    console.log("Session validation failed");
                    setCookie("session_id", "");
                }
            })
        });
    }

    OnAuth();
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
                        <Button appearance="primary" onClick={() => {OnSignIn()}}>{t('Sign in')}</Button>
                    </Card>
                </div>
            </FluentProvider>
        </div>
    );
}

export default SignIn;