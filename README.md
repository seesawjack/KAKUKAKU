# KAKUKAKU - 日文歌學習網站

透過將日文歌詞自動標註平假名及羅馬字，及多元的操作介面，提供日文初階者更快上手日文歌。

## 製作動機

筆者喜歡唱日文歌但會遇到不熟悉的日文漢字，故希望製作一個能自由選擇歌曲及 MV，並且歌詞中漢字有標注平假名的學習平台，以便快速上手日文歌。

## 專案架構
- 此專案嘗試實踐 Atomic Design 理念，將各種功能拆分成組件，從 Atmos(原子)、 Molecules(分子)到 Organisms(組織)循序架構出單一頁面。
- 狀態管理則是選擇 pinia 分別處理不同需求的邏輯與功能，以及架構統一的請求方式與 API 方法或路徑。


## 使用技術

- 前端框架：vite + vue3
- 狀態管理：pinia
- 路由管理：vue-router 
- 資料庫：supabase
- 外部 API：
    |  名稱   | 用途  | 出處 |
    |  ----  | ----  | ----  |
    | youtube data api  | 調用 youtube 搜尋功能 | [連結](https://developers.google.com/youtube/v3/docs/search/list?hl=zh-tw) |
    | youtube ifram api  | 調用 youtube 播放器功能 | [連結](https://developers.google.com/youtube/iframe_api_reference?hl=zh-tw) |
    | ひらがな化API  | 將漢字轉換成平假名或片假名 | [連結](https://labs.goo.ne.jp/api/jp/hiragana-translation/) |
    | WanaKana  | 將漢字轉換成羅馬注音 | [連結](https://github.com/WaniKani/WanaKana) |
    | diff-match-patch  | 比對文本內容差異 | [連結](https://github.com/google/diff-match-patch) |

## 技術應用

- 搜尋影片：調用 youtube data api 取得使用者搜尋的歌曲(取得歌曲、資料換頁)
- 將日文歌曲中的漢字標注平假名：
    - 調用 ひらがな化API 將歌曲全轉換成平假名
    - 調用 diff-match-patch 比對原始狀態歌詞及全平假名歌詞的差異，產生 ruby 格式的漢字有標注平假名的日文歌詞
- 將日文歌曲中的漢字轉換成羅馬注音：調用 WanaKana 將全平假名歌詞轉換成羅馬注音
- 客製化影片功能：
    - 調用 youtube ifram api
    - 時間戳記：記錄單一歌詞在影片的時間點
    - 單句重播：將當下影片進度移動到該歌詞的時間點

## 待優化功能

- 歌詞能依據「間奏狀態」及「歌曲結束」來取消顯示輪播狀態及樣式
- 降低漢字標注平假名時會錯位的問題

## 預計新增功能

- 歌曲編輯頁
    - 訂歌曲狀態(歌名、歌手名、中文歌詞出處及個人心得)
    - 新增標籤功能
    - 可新增中文歌詞
- 歌曲列表頁
    - 過濾標籤
    - 已收藏列表
- 歌曲頁
    - 留言功能
    - 收藏功能




