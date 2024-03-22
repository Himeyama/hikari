const getDarkThemeStyle = () => {
    const styles = document.getElementsByTagName("style");
    let highlightDarkTheme = null;
    for(const style of styles){
        if(style.innerHTML.match(/Theme:\sGitHub\sDark/g)){
            highlightDarkTheme = style;
            break;
        }
    }
    return highlightDarkTheme;
}

const getLightThemeStyle = () => {
    const styles = document.getElementsByTagName("style");
    let highlightLightTheme = null;
    for(const style of styles){
        if(style.innerHTML.match(/Theme:\sGitHub\n/g)){
            highlightLightTheme = style;
            break;
        }
    }
    return highlightLightTheme;
}

const mql = window.matchMedia("(prefers-color-scheme: dark)");
const dynamicThemeChange = (e) => {
    const darkTheme = getDarkThemeStyle();
    const lightTheme = getLightThemeStyle();
    if(darkTheme && lightTheme){
        lightTheme.disabled = e.matches;
        darkTheme.disabled = !e.matches;
        return true;
    }
    return false;    
}

const initSetTheme = setInterval((e) => {
    if(dynamicThemeChange(e)){
        clearInterval(initSetTheme);
    }
}, 200, mql);

mql.addEventListener('change', (e) => {
    // console.log("CHANGE");
    dynamicThemeChange(e);
})
