import { diff_match_patch } from "diff-match-patch";
import { toRomaji } from "wanakana";

export default class Song {
    constructor(lyric) {
        this.initLyrics = lyric;
        this.furiganaLyrics = '';
        this.hiraganaLyrics = '';
        this.romajiLyrics = '';
        this.lyricSpaceIndex = [];
    }

    //全部歌詞轉換成羅馬字
    getAllRomajiLyric(hiragana) {
        return hiragana.map((i) => {
            if (/^[A-Za-z\s',]+$/.test(i)) {
                return "";//英文歌詞不轉換
            } else {
                return this.getSingleRomajiLyric(i);
            }
        });
    }

    //單句歌詞轉換成羅馬字
    getSingleRomajiLyric(hiragana) {
        return hiragana
            .split(" ")
            .map((k) => {
                if (k.match(/[^\w',]/)) {
                    return toRomaji(k.split("").join(" "), {
                        customRomajiMapping: { は: "wa" },
                    });
                }
                return k;
            })
            .join(" ");
    }

    //發出轉換成平假名的請求
    async getHiragana(lyric) {
        const requestData = JSON.stringify({
            app_id: import.meta.env.VITE_HIRAGANA_API_KEY,
            output_type: "hiragana",
            sentence: lyric,
        });

        try {
            const response = await fetch('https://labs.goo.ne.jp/api/hiragana', {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: requestData
            });
            if (!response.ok) {
                throw new Error(`${response.status}_請求失敗`);
            }
            const data = await response.json();
            return data
        } catch (error) {
            console.log(error)
        }
    }

    //取得平假名歌詞
    async getHiraganaLyric(lyric) {
        const haveEnglishLyrics = /\w/g.test(lyric);
        let requestLyrics, englishLyrics, result;

        //依據全部歌詞是否含有英文分別處理
        if (haveEnglishLyrics) {
            requestLyrics = lyric.replace(/\n/g, "||").replace(/\s/g, "★").replace(/[\w'-]+/g, "※");
            englishLyrics = lyric.match(/[\w'-]+/g);
        } else {
            requestLyrics = lyric.replace(/\n/g, "||").replace(/\s/g, "★");
        }
        const response = await this.getHiragana(requestLyrics);

        //依據全部歌詞是否含有英文分別處理
        if (haveEnglishLyrics) {
            let index = 0;
            result = response.converted
                .replace(/\※/g, () => englishLyrics[index++])
                .replace(/\s/g, "")
                .replace(/★/g, " ")
                .split("||")
                .map((i) => i.trim());
        } else {
            result = response.converted
                .replace(/\s/g, "")
                .replace(/★/g, " ")
                .split("||")
                .map((i) => i.trim());

        }
        return result;
    }

    //日文歌詞轉換
    async handleLyric() {
        localStorage.setItem("initLyrics", JSON.stringify(this.initLyrics));
        const result = await this.getHiraganaLyric(this.initLyrics)

        //計算歌詞含有空白段落的位置，並返回不含空白段落的歌詞
        this.hiraganaLyrics = result.filter((sentence, index) => {
            if (sentence === "") {
                this.spaceIndex.push(index - this.spaceIndex.length);
            }
            return sentence !== "";
        });

        //空白段落調整計算
        this.spaceIndex = this.spaceIndex?.filter(
            (space, i, arr) => space - 1 !== arr[i - 1]
        );

        this.romajiLyrics = this.getAllRomajiLyric(this.hiraganaLyrics);

        const initLyrics = this.initLyrics.replace(/\n/g, "||").replace(/\s/g, " ").split("||").filter((i) => i !== "");

        this.handleFuriganaLyric(this.hiraganaLyrics, initLyrics);
    }

    //產生振假名歌詞
    handleFuriganaLyric(hiraganaArrLyrics, initArrLyrics) {
        this.furiganaLyrics = initArrLyrics.map((sentence, i) => {
            return this.getFuriganaLyric(sentence, hiraganaArrLyrics[i], i);
        });
    }

    //漢字標注平假名
    getFuriganaLyric(sentence, hiraganaSentence, index) {
        const dmp = new diff_match_patch();
        const diff = dmp.diff_main(sentence, hiraganaSentence);
        diff.push([0, ""]); //  每句結尾加 [0,''] 防止沒判斷到最後為漢字的狀況
        let html = "";
        diff.reduce(
            (acc, [kind, text]) => {
                if (kind === 0) {
                    if (acc.kanji) {
                        html +=
                            acc.kanji.match(/\s$/g) || acc.kanji.match(/[a-zA-Z]+/gm)
                                ? acc.kanji
                                : `<ruby class="kanji-word" data-index="${index}">${acc.kanji
                                }<rp>(</rp><rt>${acc.hiragana || "?"}</rt><rp>)</rp></ruby>`;
                        acc.kanji = null;
                        acc.hiragana = null;
                    }
                    html += text;
                    return acc;
                } else {
                    acc[kind === 1 ? "hiragana" : "kanji"] = text;
                    return acc;
                }
            },
            { kanji: null, hiragana: null }
        );
        return html;
    }
}