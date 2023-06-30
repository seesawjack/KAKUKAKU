import { defineStore } from "pinia";
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { diff_match_patch } from 'diff-match-patch';
import { toRomaji } from 'wanakana';
import { useRequestStore } from '../request';

export const useLyricStore = defineStore('lyric', () => {
  const { request } = useRequestStore();

  const initLyrics = ref([]);
  const resultLyrics = ref([]);
  const hiraganaLyrics = ref([]);
  const romajiLyrics = ref([]);
  const songInfo = ref({});
  const timeStampState = ref([]);

  //轉換成全平假名
  async function toHiraganaLyrics(lyric) {
    const requsetData = ref({
      app_id: import.meta.env.VITE_HIRAGANA_API_KEY,
      output_type: "hiragana",
      sentence: lyric
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
      return hiragana.map(i => {
        if (/^[A-Za-z\s',]+$/.test(i)) return '';

        return i.split(' ').map(k => {
          if (k.match(/[^\w',]/)) {
            return toRomaji(k.split('').join(' '), { customRomajiMapping: { は: 'wa' } })
          }
          return k;
        }).join(' ');
      });
    } else {
      return hiragana.split(' ').map(k => {
        if (k.match(/[^\w',]/)) {
          return toRomaji(k.split('').join(' '), { customRomajiMapping: { は: 'wa' } })
        }
        return k;
      }).join(' ');
    }

  }

  async function tolyrics(lyric) {
    resultLyrics.value.length = 0; //初始化

    initLyrics.value = lyric;
    localStorage.setItem('initLyrics', JSON.stringify(lyric));

    const onlyJapanese = ref(/\w/g.test(lyric));
    let requestLyric, onlyEnglish, result

    if (onlyJapanese.value) {
      requestLyric = lyric.replace(/\n/g, "||").replace(/[\w']/g, "※");
      onlyEnglish = lyric.replace(/[^\w']/g, "#").replace(/\#{1,}/g, ',').replace(/^,/, '').split(',');
    } else {
      requestLyric = lyric.replace(/\n/g, "||");
    }

    const requestLyrics = await toHiraganaLyrics(requestLyric);

    if (onlyJapanese.value) {
      let index = 0;
      result = requestLyrics.converted
        .replace(/\※{2,}/g, '※')
        .replace(/\※/g, () => '@' + onlyEnglish[index++] + '@')
        .replace(/\s+/g, '')
        .replace(/@/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/ , /g, ',')
        .split('||')
        .map(i => i.trim());
    } else {
      result = requestLyrics.converted
        .replace(/[\s](?!\s)/mg, '')
        .replace(/\s{2,}/g, ' ')
        .split('||')
        .map(i => i.trim());
    }
    kanjiLabelHiragana(result, lyric);
  }

  async function kanjiLabelHiragana(hiragana, lyrics) {
    hiraganaLyrics.value = hiragana;
    romajiLyrics.value = toRomajiLyrics(hiragana)

    await lyrics.split('\n').map((sentence, i) => {
      furigana(sentence, hiragana[i], i)
    })
  }

  function furigana(lyrics, hiraganaLyrics) {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(lyrics, hiraganaLyrics);
    diff.push([0, '']) //  每句結尾加 [0,''] 防止沒判斷到最後為漢字的狀況

    let html = '';
    diff.reduce((acc, [kind, text]) => {
      if (kind === 0) {
        if (acc.kanji) {
          html += acc.kanji.match(/\s$/g) || acc.kanji.match(/[a-zA-Z]+/gm) ? acc.kanji : `<ruby>${acc.kanji}<rp>(</rp><rt>${acc.hiragana || '?'}</rt><rp>)</rp></ruby>`;
          acc.kanji = null;
          acc.hiragana = null;
        };
        html += text;
        return acc
      } else {
        acc[kind === 1 ? 'hiragana' : 'kanji'] = text;
        return acc;
      };
    }, { kanji: null, hiragana: null });

    if (lyrics === '') {
      resultLyrics.value.push('<p class="text-center">*************************</p>');
    } else {
      resultLyrics.value.push(html);
    }
    return;
  }


  //▾歌詞結果頁功能
  const lyricConfiguration = reactive({
    fontSize: {
      big: {
        id: 'big',
        name: "大",
        class: ["text-2xl", "leading-9"],
      },
      middle: {
        id: 'middle',
        name: "中",
        class: ["text-xl", "leading-[2.4rem]"],
      },
      small: {
        id: 'small',
        name: "小",
        class: ["text-base", "leading-[2.4rem]"],
      },
    },
    labelType: {
      none: {
        id: 'none',
        name: '無',
      },
      hiragana: {
        id: 'hiragana',
        name: '平假名',
      },
      romaji: {
        id: 'romaji',
        name: '羅馬字',
      }
    },
    selected: {
      fontSize: 'middle',
      labelType: 'hiragana',
      allHiragana: false,
      fixedVideo: false,
      timeStamp: false
    }
  })

  function selectedSong(info) {
    songInfo.value = info;
    localStorage.setItem('songInfo', JSON.stringify(info));
  }

  if (getCurrentInstance()) {
    onMounted(() => {
      songInfo.value = JSON.parse(localStorage.getItem('songInfo'));
      initLyrics.value = JSON.parse(localStorage.getItem('initLyrics'));
    })
  };

  function removeLocal() {
    localStorage.removeItem('songInfo');
    localStorage.removeItem('initLyrics');
  }
  function selectedFontStyle(style) {
    lyricConfiguration.selected.fontSize = style;
  }
  function selectedLabelStyle(type) {
    lyricConfiguration.selected.labelType = type;
  }

  //編輯功能
  function editLyric({ lyric, index }) {
    //修改平假名跑位
    resultLyrics.value[index] = lyric.mix;
    //平假名錯誤調整
    hiraganaLyrics.value[index] = lyric.pure;
    //羅馬字錯誤調整
    romajiLyrics.value[index] = toRomajiLyrics(lyric.pure);
  }

  return {
    initLyrics,
    resultLyrics,
    hiraganaLyrics,
    romajiLyrics,
    lyricConfiguration,
    songInfo,
    timeStampState,
    kanjiLabelHiragana,
    tolyrics,
    selectedSong,
    selectedFontStyle,
    selectedLabelStyle,
    removeLocal,
    editLyric
  }
})