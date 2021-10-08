//로그인 했을 경우, 로그인페이지로 이동
//로그인 하지 않을 경우, error창 뜨게 함
function callFunc() {
  $.ajax({
    type: "GET",
    url: "api/checkSign",
    success: function (response) {},
    error: function (error) {
      alert(error.responseJSON.errorMsg);
      window.location.href = "/signIn";
    },
  });
}

//로그인 한 후, 목록 조회 페이지로 이동
function uncallFunc() {
  $.ajax({
    type: "GET",
    url: "api/checkSign",
    success: function (response) {
      alert(response["success"]);
      window.location.href = "/list";
    },
    error: function (error) {},
  });
}
