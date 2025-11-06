 // 引入各种公用JS库，配置统一路径
 (function() {
     var libs = [
         'jquery_SuperSlide.js',
         'swiper.js',
         'swiper_animate.js',
     ];
 baseURL = '/template/gh/images/hbzgh_202351/js/';

     for (var i = 0, lib; lib = libs[i++];) {
         document.write('<script type="text/javascript" src="' +baseURL+lib+'"></script>');
     }
 })();

 //判断ie
 var _IE = (function() {
     var v = 3,
         div = document.createElement('div'),
         all = div.getElementsByTagName('i');
     while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
     return v > 4 ? v : false;
 }());

 //页面操作
 $(document).ready(function() {
 //去br
     //首页、综合页、资讯信息列表标题
     //去除title中<br><br/><br />
     $("a").each(function () {
         $(this).prop('title',$(this).prop('title').replace(/<br\s*\/?>/,""));
     })
     $(".list-t li a").each(function(){
         $(this).html($(this).html().replace(/<br\s*\/?>/,""))
     });
     $(".list-b li a h4").each(function(){
         $(this).html($(this).html().replace(/<br\s*\/?>/,""))
     });
     //信息公开列表标题
     $(".info-list p a").each(function(){
         $(this).html($(this).html().replace(/<br\s*\/?>/,""))
     });
     //信息公开弹窗标题
     $(".info-mes").each(function(){
         $(this).html($(this).html().replace(/<br\s*\/?>/,""))
     });

     //IE版本6-8用layer弹提示升级浏览器
     if (_IE > 5 && _IE <= 8) {
         //弹提示层
         layer.confirm('<p class="tc"><strong>天呐！您还在使用石器时代的浏览器！</strong><br />为了更好的浏览体验，赶快升级，做回现代人吧！</p>', {
             title: '温馨提示',
             area: '500px',
             btn: ['<i class="mdi mdi-edge mdi-18px"></i>&ensp;升级IE', '<i class="mdi mdi-google-chrome mdi-18px"></i>&ensp;安装 Chrome', '继续做原始人&ensp;-_-|||'],
             btnAlign: 'c',
             btn1: function(index, layero) {
                 window.open("https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads"); //升级最新IE
                 return false;
             },
             btn2: function(index, layero) {
                 window.open("https://www.google.cn/chrome/"); //下载谷歌浏览器
                 return false;
             },
             btn3: function(index, layero) {
                 //啥都不做
             }
         });
     }

     //返回顶部
     $('.footer').append('<div id="backtop" class="backtop"></div>');
     $("#backtop").click(function() { $("html, body").animate({ scrollTop: 0 }, 500) });

     function backTop() {
         var st = $(document).scrollTop(),
             gt = 500;
         st > gt ? $("#backtop").fadeIn(300) : $("#backtop").fadeOut(300);
     }
     $(window).bind("load scroll resize", backTop);

     //移动端菜单
     $(".menu-btn,.mask").click(function() {
         $(".menu, .menu-btn, .mask").toggleClass("on");
         $("body").toggleClass("modal-open");
         $(".menu li").toggleClass("animated bounceInRight");
     });

     //移动端搜索交互
     $(".search-btn").click(function() {
         $(".search-box").toggle();
         $(this).toggleClass('close');
     });
 //切换无slide
    $('.tab a:not(.more)').mouseover(function (event) {
        $(this).addClass('current').siblings('a:not(.more)').removeClass('current');
        $(this).parents('.tab-pane').find('.pane').children('ul,div').hide().eq($(this).index()).addClass(
            'animated slideInRight').show();
    });

 });
 


 
    /*
    * 处理移动端加载更多
    * @param selector - 选择器
    * @exmple
    *       handleMobileEvent()// 无参数使用
    *       handleMobileEvent(".tab-pane1")// 有参数使用
    */
    function handleMobileEvent(selectorName) {
        if (!selectorName) {
            selectorName = ".tab-pane"
        }
 
        /**
         *  判断浏览器环境
         *  browser.isQQBrw && browser.isQQ QQ APP中
         *  browser.isQQBrw && !browser.isQQ QQ 浏览器中
         */
        var browserUtil = {
            versions: function () {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return {
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
                };
            }(),
        }
 
        $(selectorName + ' .tab a:not(.more)').each(function () {
            var $panel = $(this).parents(selectorName).find('.pane');
            var curIndex = $(this).index();
            var $curDom = $panel.children('div,ul').eq(curIndex);
            var curTagName = $curDom.prop('tagName');//获取元素名称，是 DIV 还是 UL
            
            var linkUrl = $(this).attr("href");// 获取地址
            if (linkUrl === "javascript:;") {
                linkUrl = $(this).attr("data-href")
            }
 
            if (browserUtil.versions.mobile) {
                // 如果是移动端
                $(this).attr("data-href", linkUrl);
                $(this).attr("href", "javascript:;");
                $(this).attr("target", "");
 
                var moreUlHtml = '<li class="panel-more tc"><a href="' + linkUrl + '" target="_blank">更多</a></li>';// 拼装 ul html
                var moreDivHtml = '<div class="panel-more tc"><a href="' + linkUrl + '" target="_blank">更多</a></div>';// 拼装 div html
 
                if (curTagName === "DIV") {
                    // 当元素是 div 时
                    if ($curDom.children(".panel-more").length === 0) {
                        $curDom.append(moreDivHtml);
                    }
                } else if (curTagName === "UL") {
                    // 当元素是 ul 时
                    if ($curDom.children(".panel-more").length === 0) {
                        $curDom.append(moreUlHtml);
                    }
                }
            } else {
                // 如果是桌面端
                $(this).attr("data-href", "");
                $(this).attr("href", linkUrl);
                $(this).attr("target", "_blank");
 
                if (curTagName === "DIV") {
                    // 当元素是 div 时
                    if ($curDom.children(".panel-more").length !== 0) {
                        $curDom.children(".panel-more").remove();
                    }
                } else if (curTagName === "UL") {
                    // 当元素是 ul 时
                    if ($curDom.children(".panel-more").length !== 0) {
                        $curDom.children(".panel-more").remove();
                    }
                }
            }
        })
    }
 
    // 改变窗口大小时触发
    $(window).resize(function () {
        handleMobileEvent();
    });
     
    //加载时触发
    $(document).ready(function () {
        handleMobileEvent();
    });
 