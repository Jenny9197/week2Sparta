module.exports = {
  nickAuth: (nickname) => {
    const nickRegexp = /^[a-zA-Z0-9]{3,}$/;
    const validateNickname = nickRegexp.test(nickname);
    if (!validateNickname) {
      console.log("닉네임 형식은 모든 알파벳과 숫자 포함 3자 이상입니다");
      return false;
    }
    return true;
  },
  pwAuth: (password1, password2) => {
    const pwRegexp = /^[a-zA-Z0-9]{4,}$/;
    const validatePw = pwRegexp.test(password1);
    if (!validatePw) {
      console.log("다음과 같은 패스워드는 닉네임 값 제외 및 4자 이상입니다");
      return false;
    } else if (password1 !== password2) {
      console.log("비밀번호가 일치하지 않습니다");
      return false;
    }
    return true;
  },
};
