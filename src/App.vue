<script setup>
import { ref,reactive,computed,watch } from 'vue';
import { diff_match_patch }from 'diff-match-patch';

const apiKey = import.meta.env.VITE_HIRAGANA_API_KEY;
const lyrics = ref('');
const lyricsArr = ref([]);

const reqData =ref({
  app_id:apiKey,
  sentence:'',
  output_type:"hiragana"
});

const requestOptions = ref({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: ''
})

const result = ref('')
async function postRequest(){
  try {
    reqData.value.sentence = lyrics.value.value.replace(/\n/gm,'||')
    requestOptions.value.body = JSON.stringify(reqData.value)
    const response = await fetch("https://labs.goo.ne.jp/api/hiragana", requestOptions.value)

    if(!response.ok){ throw new Error('Network response was not ok.') }
    const data = await response.json();
    const hiraganaLyrics = data.converted.split('||').map(i=>i.trim().replace(/[\s](?!\s)/mg,''))
    lyrics.value.value.split('\n').map((sentence,i)=>{
      furigana(sentence,hiraganaLyrics[i])
    })
    lyricsArr.value = lyricsArr.value.map(sentence => `<p>${sentence}</p>`).join('')
  } catch (error) {
    return error
  }
}

// 漢字加註平假名
function furigana(japanese, hiragana) {
  const dmp = new diff_match_patch();
  const diff = dmp.diff_main(japanese,hiragana);

  let html = '';
  diff.push([0,'']) //  每句結尾加 [0,''] 防止沒判斷到最後為漢字的狀況
  diff.reduce((acc,[kind,text],index)=>{
    if(index==0){
      console.log('%c 結果 ', 'background: #009393; color: #ffffff',japanese,hiragana);
    }
    console.log('%c 結果 ', 'background: #EA0000; color: #ffffff',kind,text);     

    if(kind === 0){
      if(acc.kanji || acc.hiragana){
        html += `<ruby>${acc.kanji}<rp>(</rp><rt>${acc.hiragana}</rt><rp>)</rp></ruby>`;
        acc.kanji = null;
        acc.hiragana = null;
      }
      html += text;
      return acc
    }else{
        acc[kind === 1 ? 'hiragana' : 'kanji'] = text; 
        return acc
    }
  },{ kanji: null,hiragana: null})
  lyricsArr.value.push(html);
  return lyricsArr.value;
}

async function filterKanji(){
  const kanjiArr = lyrics.value.value.split('\n').map(sentence=>sentence.replace(/[\u3040-\u309F\u30A0-\u30FF]|\n/gm,' ').split(' ').filter(i=>i.length !== 0))

  reqData.value.sentence = kanjiArr.join('||')
  requestOptions.value.body = JSON.stringify(reqData.value)
  const response = await fetch("https://labs.goo.ne.jp/api/hiragana", requestOptions.value)

  if(!response.ok){ throw new Error('Network response was not ok.') }
  const data = await response.json();
  const hriaganaArr = data.converted.split('||').map(sentence=>sentence.trim().split(',').map(i=>i.replace(/\s/,'')));

  lyrics.value.value.split('\n').map((sentence,index)=>{
      kanjiArr[index].map((kanji,i)=>{
        sentence = sentence.replace(kanji,`<ruby>${kanji}<rp>(</rp><rt>${hriaganaArr[index][i]}</rt><rp>)</rp></ruby>`);
      })
      lyricsArr.value.push(`<p>${sentence}</p>`)
  })
  lyricsArr.value = lyricsArr.value.join('')
}


function labelHiragana(kanji,hiragana){
  const testLyrics = lyrics.value.value.split('\n')
  testLyrics.map(sentence=>{
  // console.log(getMatchingPositions(sentence,kanji),kanji)
  })
}

function hasHiraganaPos(sentence,kanji){
  return kanji.reduce((matches, keyword, index) => {
    const pos = sentence.match(keyword);
    if (pos) {
      matches.push({ keyword, index, pos });
    }
    return matches;
  }, []);
}
function getMatchingPositions(sentence,kanji) {
  const matchingKeywords = hasHiraganaPos(sentence,kanji);
  return matchingKeywords.map(({ index }) => index);
}

</script>

<template>
  <div>
    <div>
      <label for="">歌詞</label>
      <textarea name="" id="" cols="100" rows="10" ref="lyrics"></textarea>
    </div>
    <template v-if="lyricsArr.length" >
      <div v-html="lyricsArr"></div>
    </template>
    <button @click="postRequest">點我</button>
    <button @click="filterKanji">過濾漢字</button>
    <button @click="labelHiragana">顯示標註漢字</button>
  </div>
</template>

<style scoped>

</style>
