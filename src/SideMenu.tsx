// エクスプローラーアイコンをクリック
const ExplorerClick = (fileStyle: any, setFileStyle: any) => {
    if (fileStyle.width == 0) {
        setFileStyle({ width: 274 });
        localStorage.setItem('openExplorer', "true");
    } else {
        setFileStyle({ width: 0 });
        localStorage.setItem('openExplorer', "false");
    }
}

export { ExplorerClick };