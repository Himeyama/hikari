import "./SignIn.css"
import { Button, Card, FluentProvider, Input, Label, webLightTheme } from "@fluentui/react-components";

const SignIn = () => {
    return (
        <div className="sign-in">
            <h1 className="page-title">Sign in</h1>
            <FluentProvider theme={webLightTheme}>
                <div className="input-area">
                    <Card>
                        <Label>Username</Label>
                        <Input />
                        <Label>Password</Label>
                        <Input type="password" />
                        <Button appearance="primary">Sign in</Button>
                    </Card>
                </div>
            </FluentProvider>
        </div>
    );
}

export default SignIn;