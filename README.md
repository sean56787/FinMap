# 金融地圖網 - FinMap
![FinMap](https://github.com/sean56787/FinMap/blob/main/demo_img/navbar.png)
## 網站簡介
此網站提供以下金融資訊:  `全球主要股市指數`、`即時匯率轉換`、`熱門國際新聞`

## 開發環境
| 名稱 | 版本 |
|------|------|
| jQuery | `3.7.1` |
| Bootstrap | `5.3.3` |
| Node.js | `10.2.4` |
| Mysql-MariaDB | `10.11.2` |
| Git | `2.37.1` |

## API&其他資源
| 名稱 | 用途 |
|------|------|
| yahoo-finance2 | 查詢指數現價 |
| https://www.exchangerate-api.com/ | 即時匯率轉換的API |
| https://techcrunch.com/ | TechCrunch 新聞網(提供即時新聞API) |
| https://www.wsj.com/ | 華爾街日報(提供即時新聞API) |

## 前置作業
| 說明 | 動作 |
|------|------|
| 開啟 Node.js Server | 在 FinMap/back 下使用指令 `node server.js` |
| 如要使用登入系統，須先建立資料庫 `finmap_db` | 資料表格式為 `CREATE TABLE users ( id INT AUTO_INCREMENT PRIMARY KEY, account VARCHAR(255) NOT NULL UNIQUE,password VARCHAR(255) NOT NULL);` |

# 各頁面介紹

## 全球主要股市指數
| 說明 |
|------|
| 顯示中國、美國、歐洲三大重要指數的即時現價 |

![全球主要股市指數](https://github.com/sean56787/FinMap/blob/main/demo_img/TGSI.png)

## 及時匯率轉換
| 說明 |
|------|
| 換匯小幫手，提供五國(TWD、CNY、USD、EUR、JPY)幣值轉換 |

![及時匯率轉換](https://github.com/sean56787/FinMap/blob/main/demo_img/Forex.png)

## 熱門國際新聞
| 說明 |
|------|
| 提供目前最新的熱門話題及新聞，此部分需要登入解鎖|

![登入後解鎖](https://github.com/sean56787/FinMap/blob/main/demo_img/news_locked.png)
![新聞1](https://github.com/sean56787/FinMap/blob/main/demo_img/NEWS01.png)
![新聞2](https://github.com/sean56787/FinMap/blob/main/demo_img/NEWS02.png)
![新聞3](https://github.com/sean56787/FinMap/blob/main/demo_img/NEWS03.png)

## 使用者註冊/登入
| 說明 |
|------|
| 登入以解鎖查看熱門新聞的功能，使用 JWT 來記錄使用者資訊 |

![使用者註冊/登入](https://github.com/sean56787/FinMap/blob/main/demo_img/login.png)

![使用者註冊/登入2](https://github.com/sean56787/FinMap/blob/main/demo_img/login02.png)



