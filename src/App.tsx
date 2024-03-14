import './Home'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Home from './Home';
import SignIn from './SignIn';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';


const App = () => {
  i18n.use(initReactI18next).init({
    resources: {
      ja: {
        translation: {
          "Sign in": "サインイン",
          "Sign out": "サインアウト",
          "Username": "ユーザー名",
          "Password": "パスワード",
          "Files": "ファイル",
          "New": "新規",
          "Save": "保存",
          "Export to Markdown": "マークダウンにエクスポート",
          "Export to PDF": "PDF にエクスポート",
          "Edit": "編集",
          "Help": "ヘルプ",
          "About this app": "このアプリについて",
          "Please enter a filename": "ファイル名を入力してください",
          "OK": "決定",
          "Close": "閉じる",
          "This app provide service to make documents": "このアプリはドキュメントを作成するサービスを提供しています"
        }
      }
    },
    lng: 'ja'
  });

  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
