import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { diff_match_patch } from "diff-match-patch";
import { toRomaji } from "wanakana";
import { useRequestStore } from "../request";

export const useLyricStore = defineStore("lyric", () => {
  const { request } = useRequestStore();

  const initLyrics = ref([]);
  const resultLyrics = ref([]);
  const hiraganaLyrics = ref([]);
  const romajiLyrics = ref([]);
  const songInfo = ref({});
  const timeStampState = ref([]);
  const lyricTimeStamp = ref({});
  const songState = reactive({ show: true, message: '' });

  //轉換成全平假名
  async function toHiraganaLyrics(lyric) {
    const requsetData = ref({
      app_id: import.meta.env.VITE_HIRAGANA_API_KEY,
      output_type: "hiragana",
      sentence: lyric,
    });

    return await request({
      url: "https://labs.goo.ne.jp/api/hiragana",
      method: "POST",
      sendData: requsetData.value,
    });
  }
  //轉換成全羅馬字
  function toRomajiLyrics(hiragana) {
    if (Array.isArray(hiragana)) {
      return hiragana.map((i) => {
        if (/^[A-Za-z\s',]+$/.test(i)) return "";

        return i
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
      });
    } else {
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
  }

  const spaceIndex = ref([]);
  async function tolyrics(lyric) {
    resultLyrics.value.length = 0; //初始化

    initLyrics.value = lyric;
    localStorage.setItem("initLyrics", JSON.stringify(lyric));

    const haveEnglishLyric = ref(/\w/g.test(lyric));
    let requestLyric, onlyEnglish, result;

    if (haveEnglishLyric.value) {
      requestLyric = lyric.replace(/\n/g, "||").replace(/[\w']/g, "※");
      onlyEnglish = lyric
        .replace(/[^\w']/g, "#")
        .replace(/\#{1,}/g, ",")
        .replace(/^,/, "")
        .split(",");
    } else {
      requestLyric = lyric.replace(/\n/g, "||");
    }

    const requestLyrics = await toHiraganaLyrics(requestLyric);

    if (haveEnglishLyric.value) {
      let index = 0;
      result = requestLyrics.converted
        .replace(/\※{2,}/g, "※")
        .replace(/\※/g, () => "@" + onlyEnglish[index++] + "@")
        .replace(/\s+/g, "")
        .replace(/@/g, " ")
        .replace(/\s{2,}/g, " ")
        .replace(/ , /g, ",")
        .split("||")
        .map((i) => i.trim());
    } else {
      result = requestLyrics.converted
        .replace(/[\s](?!\s)/gm, "")
        .replace(/\s{2,}/g, " ")
        .split("||")
        .map((i) => i.trim());
    }

    result = result.filter((lyric, index) => {
      if (lyric === "") {
        spaceIndex.value.push(index - spaceIndex.value.length);
      }
      return lyric !== "";
    });

    const filtetLyric = lyric.split("\n").filter((i) => i !== "");
    kanjiLabelHiragana(result, filtetLyric);
  }

  async function kanjiLabelHiragana(hiragana, lyrics) {
    spaceIndex.value = spaceIndex.value.filter(
      (spaceIndex, i, arr) => spaceIndex - 1 !== arr[i - 1]
    );
    hiraganaLyrics.value = hiragana;
    romajiLyrics.value = toRomajiLyrics(hiragana);
    await lyrics.map((sentence, i) => {
      furigana(sentence, hiragana[i], i);
    });
  }

  function furigana(lyrics, hiraganaLyrics, index) {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(lyrics, hiraganaLyrics);
    diff.push([0, ""]); //  每句結尾加 [0,''] 防止沒判斷到最後為漢字的狀況

    let html = "";
    diff.reduce(
      (acc, [kind, text]) => {
        if (kind === 0) {
          if (acc.kanji) {
            html +=
              acc.kanji.match(/\s$/g) || acc.kanji.match(/[a-zA-Z]+/gm)
                ? acc.kanji
                : `<ruby class="hanji-word hover:underline hover:cursor-pointer" data-index="${index}">${acc.kanji
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

    resultLyrics.value.push(html);
    return;
  }

  //▾歌詞結果頁功能
  const lyricConfiguration = reactive({
    fontSize: {
      big: {
        id: "big",
        name: "大",
        class: ["text-2xl", "leading-9"],
      },
      middle: {
        id: "middle",
        name: "中",
        class: ["text-xl", "leading-[2.4rem]"],
      },
      small: {
        id: "small",
        name: "小",
        class: ["text-base", "leading-[2.4rem]"],
      },
    },
    selected: {
      fontSize: "middle",
      labelType: "rubi",
      fixedVideo: false,
      timeStamp: false,
      loopLyric: false,
      dramaMode: false,
      isRecommend: {
        state: false,
        recommender: ''
      }
    },
  });

  function selectedSong(info) {
    songInfo.value = info;
    localStorage.setItem("songInfo", JSON.stringify(info));
  }

  function removeLocal() {
    localStorage.removeItem("songInfo");
    localStorage.removeItem("initLyrics");
  }
  function selectedFontStyle(style) {
    lyricConfiguration.selected.fontSize = style;
  }

  //編輯功能
  function editLyric({ init, edit, index }) {
    //修改平假名跑位
    resultLyrics.value[index] = resultLyrics.value[index].replace(init, edit);
    //平假名錯誤調整
    hiraganaLyrics.value[index] = hiraganaLyrics.value[index].replace(
      init,
      edit
    );
    //羅馬字錯誤調整
    romajiLyrics.value[index] = toRomajiLyrics(
      hiraganaLyrics.value[index].replace(init, edit)
    );
  }

  return {
    initLyrics,
    resultLyrics,
    hiraganaLyrics,
    romajiLyrics,
    lyricConfiguration,
    songInfo,
    timeStampState,
    lyricTimeStamp,
    spaceIndex,
    songState,
    kanjiLabelHiragana,
    tolyrics,
    selectedSong,
    selectedFontStyle,
    removeLocal,
    editLyric,
  };
});
