import { defineStore } from "pinia";
import { ref } from "vue";
import { diff_match_patch }from 'diff-match-patch';
import { toRomaji } from 'wanakana';

export const useHiraganaStore = defineStore('hiragana',()=>{
    const resultLyrics = ref([])
    const hiraganaLyrics = ref([])
    const romajiLyrics = ref([])
    const requsetData =ref({
        app_id:import.meta.env.VITE_HIRAGANA_API_KEY,
        output_type:"hiragana",
        sentence:'',
    });

    function updateLyricsInput(inputData){
        requsetData.value.sentence = inputData
        return requsetData.value
    }

    async function kanjiLabelHiragana(apiData,lyrics){
        await lyrics.split('\n').map((sentence,i)=>{
            furigana(sentence,apiData[i])
        })
        hiraganaLyrics.value = apiData;
        romajiLyrics.value = hiraganaLyrics.value.map(i=>toRomaji(i))
    }

    function furigana(lyrics, hiraganaLyrics) {
        const dmp = new diff_match_patch();
        const diff = dmp.diff_main(lyrics,hiraganaLyrics);
        diff.push([0,'']) //  每句結尾加 [0,''] 防止沒判斷到最後為漢字的狀況
      
        let html = '';
        diff.reduce((acc,[kind,text])=>{  
          if(kind === 0){
            if(acc.kanji){
              html += !acc.kanji?.match(/[a-zA-Z]+/gm) ?`<ruby>${acc.kanji}<rp>(</rp><rt>${acc.hiragana || ''}</rt><rp>)</rp></ruby>`: acc.kanji;
              acc.kanji = null;
              acc.hiragana = null;
            };
            html += text;
            return acc
          }else{
              acc[kind === 1 ? 'hiragana' : 'kanji'] = text; 
              return acc;
          };
        },{ kanji: null,hiragana: null});
      
        resultLyrics.value.push(`<p>${html}</p>`);
        return;
    }

    return{
        requsetData,
        resultLyrics,
        hiraganaLyrics,
        romajiLyrics,
        kanjiLabelHiragana,
        updateLyricsInput,
    }
})