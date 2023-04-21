<script setup>
import { ref,reactive,computed,watch } from 'vue';
import { diff_match_patch }from 'diff-match-patch';
const lyricsArr = reactive([])

const initLyrics = `闇夜を駆け抜けて 何処へむかう
月明かりだけがただ一つの道標
痛みも悲しみも拭いきれず
されどこの胸の炎は消させない
誰が為に僕たちは
この想いを貫いて
闇を裂き 陽の下で
光さす日まで
解き放たれた心に宿した火よ
舞い上げ まとえ 今 夜明けの向こう側へ
君がいるこの世界もう一度愛せるまで
我が命 果てようとも 繋いで行こう
絆が紡いで生まれた奇跡を
喜怒哀楽 夢 揺らめいてる現世
互いの正義をまた繰り返し振りかざす
誰が為に繋ぐ命
交わりもつれる運命
蛇の道数多の罪
全て薙ぎ払え
解き放て今 僕らが起こした火を
舞い上げ走れば明日が変わるはず
君といるこの世界二度と離さずに
君と共に行く
瞼を閉じても想い出すあの日を
打ちのめされても焦がれた未来を
いつの日か君に捧げてみせよう
解き放たれた心に宿した火よ
舞い上げ まとえ 今 夜明けの向こうへ
解き放て今 僕らが起こした火を
舞い上げ走れば
明日が変わるはず
君がいたこの世界もう一度愛せるまで
我が命 果てようとも 繋げていくよ
絆が紡いで生まれた奇跡を`

const hiraganaLyrics = ['やみよを かけぬけて  どこへ むかう', 'つきあかりだけが ただ ひとつの どうひょう', 'いたみも かなしみも ぬぐいきれず', 'されど この むねの ほのおは けさせない', 'だれが ために ぼくたちは', 'この おもいを つらぬいて', 'やみを さき  ひの したで', 'ひかり さす ひまで', 'ときはなたれた こころに やどした ひよ', 'まいあげ  まとえ  いま  よあけの むこうがわへ', 'きみが いる この せかい もういちど あいせるまで', 'わが いのち   はてよう とも   つないでいこう', 'きずなが つむいで うまれた きせきを', 'きどあいらく  ゆめ  ゆらめいてる げんせ', 'たがいの せいぎを また くりかえし ふりかざす', 'だれが ために つなぐ いのち', 'まじわりも つれる うんめい', 'へびの どうすうたの つみ', 'すべて なぎはらえ', 'ときはなせて いま   ぼくらが おこした ひを', 'まいあげ はしれば あすが かわる はず', 'きみと いる この せかい にどと はなさずに', 'きみとともに いく', 'まぶたを とじても おもいだす あのひを', 'うちのめされても こがれた みらいを', 'いつの ひか きみに ささげてみせよう', 'ときはなたれた こころに やどした ひよ', 'まいあげ  まとえ  いま  よあけの むこうへ', 'ときはなせて いま   ぼくらが おこした ひを', 'まいあげ はしれば', 'あすが かわる はず', 'きみが いた この せかい もういちど あいせるまで', 'わが いのち   はてようとも  つなげていくよ', 'きずなが つむいで うまれた きせきを'].map(i=>i.replace(/[\s](?!\s)/mg,''))
function furigana(japanese, hiragana) {
  const dmp = new diff_match_patch();
  const diff = dmp.diff_main(japanese,hiragana);
        console.log('%c 結果 ', 'background: #EA0000; color: #ffffff',diff);

  let html = '';
  let ruby = {kanji: null, hiragana: null };
  diff.push([0,''])
  diff.map(([kind, text],index) => {
    if (kind == 0) {
      if (ruby.kanji || ruby.hiragana) {
        html += `<ruby>${ruby.kanji}<rp>(</rp><rt>${ruby.hiragana}</rt><rp>)</rp></ruby>`;
        ruby.kanji = null;
        ruby.hiragana = null;
      }
      html += text;
    } else {
      ruby[kind == 1 ? 'hiragana' : 'kanji'] = text;
    }
  });
  lyricsArr.push(html)
  return html
}
console.log('%c 結果 ', 'background: #009393; color: #ffffff',hiraganaLyrics);
console.log(furigana('闇夜を駆け抜けて 何処へむかう','やみよをかけぬけて どこへむかう'))
const apiKey = import.meta.env.VITE_HIRAGANA_API_KEY
const lyrics = ref('')
// const hiragana = ref('')
const chagneType = ref('')

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
    const changetype = initLyrics.split('\n')
    changetype.map((sentence,i)=>{
      furigana(sentence,hiraganaLyrics[i])
    })
    result.value = furigana(initLyrics,hiraganaLyrics)
    console.log('%c 結果 ', 'background: #EA0000; color: #ffffff',result.value);
    // reqData.value.sentence = lyrics.value.value
    // requestOptions.value.body = JSON.stringify(reqData.value)
    // const response = await fetch("https://labs.goo.ne.jp/api/hiragana", requestOptions.value)

    // if(!response.ok){ throw new Error('Network response was not ok.') }
    // const data = await response.json()
    // const hiraganaLyrics = data.converted.split('||').map(i=>i.trim());
    // console.log('%c 結果 ', 'background: #EA0000; color: #ffffff',data);
    // // lyrics.value.value.split('\n').map((sentence,i)=>{
    // //   furigana(sentence,hiraganaLyrics[i])
    // // })
    // console.log('%c 結果 ', 'background: #009393; color: #ffffff',lyricsArr);
    // // hiragana.value.value = data.converted	
  } catch (error) {
    return error
  }
}

</script>

<template>
  <div>
    <div>
      <label for="">歌詞</label>
      <textarea name="" id="" cols="100" rows="10" ref="lyrics"></textarea>
    </div>
    <div>
      <label for="">結果</label>
      <textarea name="" id="" cols="100" rows="10" ref="hiragana"></textarea>
    </div>
    <div v-if="lyricsArr.length">
      <p v-html="lyricsArr"></p>
    </div>
    <button @click="postRequest">點我</button>
  </div>
</template>

<style scoped>

</style>
