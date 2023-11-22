export function useRegex() {
  const passwordRegex = function (value) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/g.test(value);
  };

  const songTitleRegex = function (value) {
    return value
      .split(
        /[^\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf\w]/g
      )
      .map((i) => i.trim())
      .filter((i) => i != "");
  };

  const songIdRegex = function (value) {
    const result = value.match(/v=([a-zA-Z0-9_-]+)/);
    return result ? result[1] : false;
  };

  const urlSongIdChangeRegex = function (url, value) {
    return url.replace(/song_id=([a-zA-Z0-9_-]+)/, "song_id=" + value);
  };

  return {
    passwordRegex,
    songTitleRegex,
    songIdRegex,
    urlSongIdChangeRegex,
  };
}
