import { defineStore } from "pinia";
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { diff_match_patch } from "diff-match-patch";
import { toRomaji } from "wanakana";
import { useFetch } from "../../composables/useFetch";

export const useLyricStore = defineStore("lyric", () => {
  const { fetchData } = useFetch();

  const initLyrics = ref([]);
  const furiganaLyrics = ref([]);
  const hiraganaLyrics = ref([]);
  const romajiLyrics = ref([]);
  const timeStampState = ref([]);
  const lyricTimeStamp = ref({});
  const songInfo = ref({});
  const songDisplay = reactive({ show: true, message: "" });

  // if (getCurrentInstance()) {
  //   onMounted(() => {
  //     songInfo.value = JSON.parse(localStorage.getItem("songInfo"));
  //     initLyrics.value = JSON.parse(localStorage.getItem("initLyrics"));
  //   });
  // }

  //發出轉換成平假名的請求
  async function getHiragana(lyric) {
    const requsetData = ref({
      app_id: import.meta.env.VITE_HIRAGANA_API_KEY,
      output_type: "hiragana",
      sentence: lyric,
    });

    return await fetchData({
      url: "https://labs.goo.ne.jp/api/hiragana",
      method: "POST",
      sendData: requsetData.value,
    });
  }

  //全部歌詞轉換成羅馬字
  function handleAllToRomaji(hiragana) {
    return hiragana.map((i) => {
      if (/^[A-Za-z\s',]+$/.test(i)) return ""; //英文歌詞不轉換
      return handleToRomaji(i);
    });
  }

  //單一歌詞轉換成羅馬字
  function handleToRomaji(hiragana) {
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

  const spaceIndex = ref([]);

  //日文歌詞轉換
  async function handleLyricTransform(lyric) {
    furiganaLyrics.value.length = 0; //初始化

    initLyrics.value = lyric; //網頁暫存最初歌詞型態
    localStorage.setItem("initLyrics", JSON.stringify(lyric));

    const haveEnglishLyrics = /\w/g.test(lyric);
    let requestLyrics, englishLyrics, result;

    //依據全部歌詞是否含有英文分別處理
    if (haveEnglishLyrics) {
      requestLyrics = lyric.replace(/\n/g, "||").replace(/\s/g, "★").replace(/[\w'-]+/g, "※");
      englishLyrics = lyric.match(/[\w'-]+/g);
    } else {
      requestLyrics = lyric.replace(/\n/g, "||").replace(/\s/g, "★");
    }

    const response = await getHiragana(requestLyrics);
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

    //計算平假名歌詞含有空白段落的位置，並返回不含空白段落的歌詞
    result = result.filter((sentence, index) => {
      if (sentence === "") {
        spaceIndex.value.push(index - spaceIndex.value.length);
      }
      return sentence !== "";
    });

    //空白段落調整計算
    spaceIndex.value = spaceIndex.value.filter(
      (space, i, arr) => space - 1 !== arr[i - 1]
    );

    hiraganaLyrics.value = result;
    romajiLyrics.value = handleAllToRomaji(result);

    const initArrLyrics = lyric.replace(/\n/g, "||").replace(/\s/g, " ").split("||").filter((i) => i !== "");

    handleLyricsLabel(result, initArrLyrics);
  }

  //產生振假名歌詞
  async function handleLyricsLabel(hiraganaArrLyrics, initArrLyrics) {
    furiganaLyrics.value = await initArrLyrics.map((sentence, i) => {
      return (sentence = handleToFurigana(sentence, hiraganaArrLyrics[i], i));
    });
  }

  //漢字標注平假名
  function handleToFurigana(sentence, hiraganaSentence, index) {
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

  //歌曲頁功能
  const songPageOption = reactive({
    lyricsFont: {
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
        recommender: "",
      },
    },
  });

  //已選歌曲
  function handleSongSelected(info) {
    songInfo.value = info;
    localStorage.setItem("songInfo", JSON.stringify(info));
  }

  //移除歌詞暫存資料
  function removeLocal() {
    localStorage.removeItem("songInfo");
    localStorage.removeItem("initLyrics");
  }

  //歌曲頁選項調整
  function handleSongState({
    furigana,
    hiragana,
    romaji,
    timeStamp,
    space,
    recommend,
    info,
  }) {
    furiganaLyrics.value = furigana;
    hiraganaLyrics.value = hiragana;
    romajiLyrics.value = romaji;
    lyricTimeStamp.value = timeStamp;
    spaceIndex.value = space;
    songPageOption.selected.isRecommend = recommend;
    songInfo.value = info;
  }

  function handleSongDisplay({ isShow, message }) {
    songDisplay.show = isShow;
    songDisplay.message = message;
  }

  //編輯功能
  function handleFuriganaEdit({ init, edit, index, html }) {
    //修改振假名
    const editSentenceHtml = html.replace(init, edit);
    furiganaLyrics.value[index] = furiganaLyrics.value[index].replace(
      html,
      editSentenceHtml
    );

    const editAllHirgana = furiganaLyrics.value[index]
      .replace(/<[^>]+>/g, "")
      .match(/[ぁ-んァ-ンー々〆〤a-zA-Z]+/g)
      .map((item) => (/[a-zA-Z]/.test(item) ? " " + item : item))
      .join("");

    //修改平假名
    hiraganaLyrics.value[index] = editAllHirgana;

    //修改羅馬字
    romajiLyrics.value[index] = handleToRomaji(editAllHirgana);
  }

  return {
    initLyrics,
    furiganaLyrics,
    hiraganaLyrics,
    romajiLyrics,
    songPageOption,
    songInfo,
    timeStampState,
    lyricTimeStamp,
    spaceIndex,
    songDisplay,
    handleLyricTransform,
    handleSongSelected,
    removeLocal,
    handleFuriganaEdit,
    handleSongState,
    handleSongDisplay,
  };
});
