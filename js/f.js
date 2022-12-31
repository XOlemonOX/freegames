$.ajax({
    url: "conn/f.php?action=jssdk",
    type: 'post',
    data: { url: location.href.split('#')[0],action:"jssdk",pagetype:"",pageid:"0" },
    success:function(res){
    res=JSON.parse(res);
      wx.config({
        debug: false,
        appId: res.appid,
        timestamp: res.timestamp,
        nonceStr: res.nonceStr,
        signature: res.signature,
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ'
        ]
      }); 
      wx.ready(function () {
        var shareData = {
          title: document.title,
          desc: getDesc(),
          link: res.url,
          imgUrl: res.img
        };
        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareTimeline(shareData);
        wx.onMenuShareQQ(shareData);
      });
      wx.error(function (res) {
       
      });
    }
  });

  function getDesc() {
    var meta = document.getElementsByTagName("meta");
    for (var i=0;i<meta.length;i++){
      if(typeof meta[i].name!="undefined"&&meta[i].name.toLowerCase()=="description"){
        return meta[i].content;
      }
    }
};
