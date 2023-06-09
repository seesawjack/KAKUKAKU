import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { diff_match_patch } from 'diff-match-patch';
import { toRomaji } from 'wanakana';
import { useRequestStore } from '../request';

export const useLyricStore = defineStore('lyric', () => {
  const { request } = useRequestStore();

  const resultLyrics = ref([])
  const hiraganaLyrics = ref([])
  const romajiLyrics = ref([])

  async function generateHiraganaLyrics(lyric) {
    resultLyrics.value.length = 0; //初始化

    const requsetData = ref({
      app_id: import.meta.env.VITE_HIRAGANA_API_KEY,
      output_type: "hiragana",
      sentence: lyric.replace(/\n/g, "||")
    });

    const requestLyrics = await request({
      url: "https://labs.goo.ne.jp/api/hiragana",
      method: "POST",
      sendData: requsetData.value,
    });

    const allHiraganaLyrics = requestLyrics.converted.split('||').map(i => i.trim().replace(/[\s](?!\s)/mg, ''))
    kanjiLabelHiragana(allHiraganaLyrics, lyric);
  }

  async function kanjiLabelHiragana(apiData, lyrics) {
    await lyrics.split('\n').map((sentence, i) => {
      furigana(sentence, apiData[i])
    })
    hiraganaLyrics.value = apiData;
    romajiLyrics.value = hiraganaLyrics.value.map(i => toRomaji(i.split('').join(' '), { customRomajiMapping: { は: 'wa' } }));
  }

  function furigana(lyrics, hiraganaLyrics) {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(lyrics, hiraganaLyrics);
    diff.push([0, '']) //  每句結尾加 [0,''] 防止沒判斷到最後為漢字的狀況

    let html = '';
    diff.reduce((acc, [kind, text]) => {
      if (kind === 0) {
        if (acc.kanji) {
          html += !acc.kanji?.match(/[a-zA-Z]+/gm) ? `<ruby>${acc.kanji}<rp>(</rp><rt>${acc.hiragana || ''}</rt><rp>)</rp></ruby>` : acc.kanji;
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
      resultLyrics.value.push(`<p class="init">${html}</p>`);
    }
    return;
  }



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
      fixedVideo: false
    }
  })

  function selectedSong(songInfo) {
    localStorage.setItem('songInfo', JSON.stringify(songInfo));
  }
  const songInfo = computed(() => JSON.parse(localStorage.getItem('songInfo')));

  function selectedFontStyle(style) {
    lyricConfiguration.selected.fontSize = style;
  }
  function selectedLabelStyle(type) {
    lyricConfiguration.selected.labelType = type;
  }
  return {
    resultLyrics,
    hiraganaLyrics,
    romajiLyrics,
    lyricConfiguration,
    songInfo,
    kanjiLabelHiragana,
    generateHiraganaLyrics,
    selectedSong,
    selectedFontStyle,
    selectedLabelStyle
  }
})