# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---  

# 状態コード表

◆状態コード仕様
利用モード番号-ランプ種類番号-点灯状態番号-点滅速度番号-ランプ色番号-通し番号

◆利用モード番号
親機: 01
メッシュ中継機またはメッシュ機能を利用しない中継機／子機: 02

◆ランプ種類番号
POWER : 01
ACTIVE: 02
2.4GHz: 03
5GHz  : 04
6GHz  : 05
MESH  : 06
OPTION: 07

◆点灯状態番号
消灯: 01
点滅: 02
点灯: 03

◆点滅速度番号
なし: 01
低速: 02
中速: 03
高速: 04

◆ランプ色番号
なし : 01
緑   : 02
橙   : 03
赤   : 04

◆通し番号
通し番号より前の部分が同じ値になって重複するものがあります。例えば、シートの5行目・6行目・7行目です。
通し番号より前の部分のパターンがはじめて出現した際は通し番号を001から始め、2回目以降に通し番号より前の部分のパターンが出現した場合は002、003…というように通し番号をインクリメントして付与します。
例としては、以下のとおり。
A2セル: 01-01-03-01-02-001
A5セル: 01-01-03-01-03-001
A6セル: 01-01-03-01-03-002
