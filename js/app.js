var body = jQuery("body"),
st = 0,
lastSt = 0,
navText = ['<i class="mdi mdi-chevron-left"></i>', '<i class="mdi mdi-chevron-right"></i>'],
iconspin = '<i class="fa fa-spinner fa-spin"></i> ',
iconcheck = '<i class="fa fa-check"></i> ',
iconwarning = '<i class="fa fa-warning "></i> ',
is_tencentcaptcha = !1;
function open_signup_popup() {
	var e = $("#popup-signup"),
	t = e.html();
	Swal.fire({
		html: t,
		showConfirmButton: !1,
		width: 340,
		padding: "0",
		focusConfirm: !1,
		onBeforeOpen: () =>{
			$(".swal2-container .swal2-input").remove(),
			$(".swal2-container .swal2-file").remove(),
			$(".swal2-container .swal2-range").remove(),
			$(".swal2-container .swal2-select").remove(),
			$(".swal2-container .swal2-radio").remove(),
			$(".swal2-container .swal2-checkbox").remove(),
			$(".swal2-container .swal2-textarea").remove(),
			$(".swal2-container .swal2-validation-message").remove(),
			e.empty()
		},
		onClose: () =>{
			e.html(t)
		}
	})
}
function ajax_getpost() {
	"use strict";
	$(".home-cat-nav-wrap ul li button").on("click",
	function() {
		var e = $(this),
		t = e.html();
		e.html(iconspin + t);
		var a = e.data("id");
		$.post(caozhuti.ajaxurl, {
			action: "ajax_getcat_post",
			paged: 1,
			cat: a
		},
		function(n) {
			e.parents(".site-main").find(".posts-wrapper").html(n),
			e.html(t),
			0 == a ? ($(".infinite-scroll-action").show(), $(".navigation").show(), $(".numeric-pagination").show()) : ($(".infinite-scroll-action").hide(), $(".navigation").hide(), $(".numeric-pagination").hide())
		})
	})
}
function ajax_searc() {
	"use strict";
	$(".home_search_input").bind("input propertychange",
	function(e) {
		var t = $(".home_search_input").val();
		t && $.post(caozhuti.ajaxurl, {
			action: "ajax_search",
			text: t
		},
		function(e) {
			e=JSON.parse(e);
			var t = $(".home-search-results");
			if (0 == e.length) t.empty().show().append("<li><strong>没有搜到相关内容，切换关键词试试。</strong></li>");
			else {
				t.empty().show();
				for (var a = 0; a < e.length; a++) t.append('<li><a class="focus" target="_blank" href="' + e[a].url + '"><img class="" src="' + e[a].img + '"></a><h2><a target="_blank" href="' + e[a].url + '">' + e[a].title + "</a></h2></li>")
			}
		}),
		$(document).click(function(e) {
			var t = $(".home-search-results");
			t.is(e.target) || 0 !== t.has(e.target).length || t.hide()
		})
	})
}
function signup_popup() {
	"use strict";
	$(".login-btn").on("click",
	function(e) {
		e.preventDefault(),
		open_signup_popup()
	}),
	$(".must-log-in a").on("click",
	function(e) {
		e.preventDefault(),
		open_signup_popup()
	}),
	$(".comment-reply-login").on("click",
	function(e) {
		e.preventDefault(),
		open_signup_popup()
	}),
	$(document).on("click", ".nav-tabs a",
	function(e) {
		e.preventDefault();
		var t = $(this),
		a = t.data("toggle"),
		n = t.parent(),
		i = $(".tab-content #signup"),
		o = $(".tab-content #login");
		n.addClass("active"),
		n.siblings().removeClass("active"),
		"login" == a && (o.addClass("active"), o.siblings().removeClass("active")),
		"signup" == a && (i.addClass("active"), i.siblings().removeClass("active"))
	}),
	$(document).on("click", ".go-login",
	function(e) {
		var t = $(this),
		a = t.text(); (t.html(iconspin + a), 1 == caozhuti.tencent_captcha.is) ? new TencentCaptcha(caozhuti.tencent_captcha.appid,
		function(e) {
			console.log(e),
			0 === e.ret && $.post(caozhuti.ajaxurl, {
				action: "tencentcaptcha",
				appid: caozhuti.tencent_captcha.appid,
				Ticket: e.ticket,
				Randstr: e.randstr
			},
			function(e) {
				$.post(caozhuti.ajaxurl, {
					action: "user_login",
					username: $("input[name='username']").val(),
					password: $("input[name='password']").val(),
					rememberme: $("input[name='rememberme']").val()
				},
				function(e) {
					1 == e.status ? (t.html(iconcheck + e.msg), setTimeout(function() {
						location.reload()
					},
					1e3)) : (t.html(iconwarning + e.msg), setTimeout(function() {
						t.html(a)
					},
					2e3))
				})
			})
		}).show() : $.post(caozhuti.ajaxurl, {
			action: "user_login",
			username: $("input[name='username']").val(),
			password: $("input[name='password']").val(),
			rememberme: $("input[name='rememberme']").val()
		},
		function(e) {
			1 == e.status ? (t.html(iconcheck + e.msg), setTimeout(function() {
				location.reload()
			},
			1e3)) : (t.html(iconwarning + e.msg), setTimeout(function() {
				t.html(a)
			},
			2e3))
		})
	}),
	$(document).on("click", ".go-register",
	function(e) {
		var t = $(this),
		a = t.text(),
		n = $("input[name='user_name']").val(),
		i = $("input[name='user_email']").val(),
		o = $("input[name='user_pass']").val(),
		s = $("input[name='user_pass2']").val(),
		r = $("input[name='captcha']").val();
		if (t.html(iconspin + a), !is_check_name(n)) return t.html(iconwarning + "用户名格式错误"),
		setTimeout(function() {
			t.html(a)
		},
		2e3),
		!1;
		if (!is_check_mail(i)) return t.html(iconwarning + "邮箱格式错误"),
		setTimeout(function() {
			t.html(a)
		},
		2e3),
		!1;
		if (!is_check_pass(o, s)) return t.html(iconwarning + "两次密码输入不一致"),
		setTimeout(function() {
			t.html(a)
		},
		2e3),
		!1;
		1 == caozhuti.tencent_captcha.is ? new TencentCaptcha(caozhuti.tencent_captcha.appid,
		function(e) {
			console.log(e.ret),
			0 === e.ret && $.post(caozhuti.ajaxurl, {
				action: "user_register",
				user_name: n,
				user_email: i,
				user_pass: o,
				user_pass2: s,
				captcha: r
			},
			function(e) {
				1 == e.status ? (t.html(iconcheck + e.msg), setTimeout(function() {
					location.reload()
				},
				1e3)) : (t.html(iconwarning + e.msg), setTimeout(function() {
					t.html(a)
				},
				2e3))
			})
		}).show() : $.post(caozhuti.ajaxurl, {
			action: "user_register",
			user_name: n,
			user_email: i,
			user_pass: o,
			user_pass2: s,
			captcha: r
		},
		function(e) {
			1 == e.status ? (t.html(iconcheck + e.msg), setTimeout(function() {
				location.reload()
			},
			1e3)) : (t.html(iconwarning + e.msg), setTimeout(function() {
				t.html(a)
			},
			2e3))
		})
	}),
	$(document).on("click", ".go-mpweixin",
	function(e) {
		e.preventDefault();
		var t = $(this),
		a = t.html();
		if (t.html(iconspin), is_in_weixin()) return window.location.href = t.attr("href"),
		!0;
		$.post(caozhuti.ajaxurl, {
			action: "get_mpweixin_qr"
		},
		function(e) {
			e=JSON.parse(e); 
			if (1 == e.status) {
				t.parents(".tab-content").find("form").html('<p style="margin:0;">请使用微信扫码关注登录</p><img src="' + e.ticket_img + '">');
				var n = setInterval(function() {
					$.post(caozhuti.ajaxurl, {
						action: "check_mpweixin_qr",
						scene_id: e.scene_id
					},
					function(e) {
						e=JSON.parse(e); 
						1 == e.status && (clearInterval(n), Swal.fire({
							type: "success",
							title: "扫码成功，即将刷新",
							showConfirmButton: !1,
							timer: 1500,
							onClose: () =>{
								location.reload()
							}
						}))
					})
				},
				5e3)
			} else alert(e.ticket_img);
			t.html(a)
		})
	}),
	$(document).on("click", ".bind-mpweixin",
	function(e) {
		e.preventDefault();
		var t = $(this);
		t.html();
		if (is_in_weixin()) return window.location.href = t.attr("href"),
		!0;
		Swal.fire({
			type: "warning",
			title: "请在微信内使用账号密码登录后进入个人中心绑定",
			showConfirmButton: !1,
			timer: 1e4,
			onClose: () =>{}
		})
	})
}
function share_pop() {
	$('[etap="share"]').on("click",
	function() {
		if ($(".article-content img:first").length) var e = $(".article-content img:first").attr("src");
		var t = document.URL,
		a = e,
		n = document.title || "",
		i = $('meta[name="description"]').length ? $('meta[name="description"]').attr("content") : "",
		o = $(this),
		s = "";
		switch (o.data("share")) {
		case "qq":
			s = "http://connect.qq.com/widget/shareqq/index.html?url=" + t + "&desc=" + i + "&summary=" + n + "&site=" + caozhuti.site_name + "&pics=" + a;
			break;
		case "weibo":
			s = "http://service.weibo.com/share/share.php?title=" + n + "&url=" + t + "&source=bookmark&pic=" + a
		}
		o.attr("href") || o.attr("target") || o.attr("href", s).attr("target", "_blank")
	}),
	$(".btn-bigger-cover").on("click",
	function(e) {
		e.preventDefault();
		var t = $(this),
		a = t.html();
		t.html(iconspin),
		$.post(caozhuti.ajaxurl, {
			action: "get_bigger_img",
			id: t.data("id")
		},
		function(e) {
			Swal.fire({
				html: e,
				showConfirmButton: !1,
				width: 380,
				padding: 0,
				background: "#fff",
				showCloseButton: !0,
				onBeforeOpen: () =>{
					setTimeout(function() {
						html2canvas(document.getElementById("poster-html"), {
							scale: 2,
							useCORS: !0,
							scrollY: 0,
							backgroundColor: null
						}).then(function(e) {
							var t = e.toDataURL("image/png");
							jQuery(".poster-canvas").html('<img src="' + t + '">'),
							jQuery(".poster-html").remove(),
							jQuery(".poster-down").html(iconcheck + " 下载海报"),
							jQuery(".poster-down").attr("href", t)
						})
					},
					1e3)
				},
				onClose: () =>{
					t.html(a)
				}
			})
		})
	})
}
function userinit() {
	"use strict";
	$('[etap="submit_info"]').on("click",
	function() {
		var e = $(this),
		t = e.text(),
		a = $("input[name='email']").val(),
		n = $("input[name='nickname']").val(),
		i = $("input[name='user_avatar_type']:checked").val(),
		o = $("input[name='phone']").val(),
		s = $("input[name='qq']").val(),
		r = $("textarea[name='description']").val(),
		c = $("input[name='edit_email_cap']").val();
		e.html(iconspin + t),
		$.post(caozhuti.ajaxurl, {
			nickname: n,
			email: a,
			phone: o,
			qq: s,
			description: r,
			user_avatar_type: i,
			captcha: c,
			action: "edit_user_info"
		},
		function(a) {
			"1" == a ? (e.html(t), Swal.fire({
				type: "success",
				title: "修改成功",
				showConfirmButton: !1,
				timer: 1500
			}), setTimeout(function() {
				location.reload()
			},
			1e3)) : (e.html(t), swal.fire({
				type: "error",
				title: a
			}))
		})
	}),
	$("#addPic").change(function(e) {
		var t = $(this).data("nonce"),
		a = e.currentTarget.files[0],
		n = new FormData;
		n.append("nonce", t),
		n.append("action", "update_avatar_photo"),
		n.append("file", a);
		const i = Swal.mixin({
			toast: !0,
			showConfirmButton: !1,
			timer: 3e3
		});
		$.ajax({
			url: caozhuti.ajaxurl,
			type: "POST",
			cache: !1,
			data: n,
			processData: !1,
			contentType: !1
		}).done(function(e) {
			1 == e.status ? (i.fire({
				type: "success",
				title: e.msg
			}), setTimeout(function() {
				location.reload()
			},
			1e3)) : i.fire({
				type: "error",
				title: e.msg
			})
		}).fail(function(e) {
			i.fire({
				type: "error",
				title: "网络错误"
			})
		})
	}),
	$(".edit_email_cap").on("click",
	function() {
		var e = $(this),
		t = e.text(),
		a = $("input[name='email']").val();
		if (e.html(iconspin + t), !is_check_mail(a)) return Swal.fire({
			type: "error",
			title: "邮箱格式错误"
		}),
		!1;
		$.post(caozhuti.ajaxurl, {
			action: "captcha_email",
			user_email: a
		},
		function(a) {
			1 == a.status ? (e.html(t), Swal.fire({
				type: "success",
				title: a.msg,
				showConfirmButton: !1,
				timer: 1500
			}), e.attr("disabled", "true")) : (e.html(t), Swal.fire({
				type: "error",
				title: a.msg
			}))
		})
	}),
	$(document).on("click", ".go-captcha_email",
	function(e) {
		var t = $(this),
		a = t.text(),
		n = $("input[name='user_email']").val();
		if (t.html(iconspin + a), t.attr("disabled", "true"), !is_check_mail(n)) return t.html(iconwarning + "邮箱错误"),
		setTimeout(function() {
			t.html(a),
			t.removeAttr("disabled")
		},
		3e3),
		!1;
		$.post(caozhuti.ajaxurl, {
			action: "captcha_email",
			user_email: n
		},
		function(e) {
			1 == e.status ? (t.html(iconcheck + "发送成功"), setTimeout(function() {
				t.html(a)
			},
			3e3)) : (t.html(iconwarning + e.msg), setTimeout(function() {
				t.html(a),
				t.removeAttr("disabled")
			},
			3e3))
		})
	}),
	$(".unset-bind").on("click",
	function() {
		var e = $(this),
		t = e.text(),
		a = $(this).data("id");
		e.html(iconspin + t),
		Swal.fire({
			title: "确定解绑？",
			text: "解绑后需要重新绑定",
			type: "warning",
			showCancelButton: !0,
			confirmButtonText: "确定",
			cancelButtonText: "取消"
		}).then(n =>{
			n.value && $.post(caozhuti.ajaxurl, {
				action: "unset_open_oauth",
				unsetid: a
			},
			function(a) {
				1 == a ? (e.html(t), Swal.fire("解绑成功", "", "success"), setTimeout(function() {
					location.reload()
				},
				1e3)) : (e.html(t), Swal.fire("解绑失败", "", "error"))
			})
		})
	}),
	$(".payvip-box .vip-info").on("click",
	function() {
		var e = $(this),
		t = e.data("id"),
		a = e.data("price");
		e.parents(".payvip-box").find(".vip-info").removeClass("active"),
		e.addClass("active"),
		$("input[name='pay_id']").val(t),
		$(".go-payvip").removeAttr("disabled"),
		$(".click-payvip").data("price", a)
	}),
	$(".go-payvip").on("click",
	function() {
		var e = $(this),
		t = $("input[name='pay_id']").val(),
		a = e.data("nonce"),
		n = e.html();
		e.html(iconspin + n),
		$.post(caozhuti.ajaxurl, {
			nonce: a,
			pay_id: t,
			action: "pay_vip"
		},
		function(t) {
			"1" == t.status ? (e.html(n), Swal.fire("", t.msg, "success").then(e =>{
				e.value && location.reload()
			})) : (e.html(n), Swal.fire("", t.msg, "warning"))
		})
	}),
	$("#charge_num").bind("input propertychange",
	function(e) {
		var t = $("#rmbnum").data("rate"),
		a = $("#charge_num").val() / t;
		$("#rmbnum b").text(a),
		a > 0 ? $(".go-charge").removeAttr("disabled") : $(".go-charge").attr("disabled", "true")
	}),
	$(".amounts ul li").on("click",
	function() {
		var e = $("#rmbnum").data("rate");
		$(this).find("p").addClass("selected"),
		$(this).siblings($(".amounts ul li")).find("p").removeClass("selected");
		var t = $(this).data("price") / e;
		$("input[name='charge_num']").val($(this).data("price")),
		$("#rmbnum b").text(t),
		$(".go-charge").removeAttr("disabled")
	}),
	$(".go-cdk").on("click",
	function() {
		var e = $(this),
		t = $("input[name='cdkcode']").val(),
		a = e.data("nonce"),
		n = e.html();
		e.html(iconspin + n),
		Swal.fire({
			allowOutsideClick: !1,
			width: 200,
			timer: 6e4,
			onBeforeOpen: () =>{
				Swal.showLoading(),
				$.post(caozhuti.ajaxurl, {
					action: "cdk_pay",
					cdkcode: t,
					nonce: a
				},
				function(t) {
					1 == t.status ? (e.html(n), Swal.fire("", t.msg, "success").then(e =>{
						e.value && location.reload()
					})) : (e.html(n), Swal.fire("", t.msg, "error"))
				})
			}
		})
	}),
	$("input[name='pay_type']").change(function() {
		$(this);
		var e = $("#yuecz"),
		t = $("#kamidiv");
		3 == $("input[name='pay_type']:checked").val() ? (e.hide(), t.show(), $(".go-charge").attr("disabled", "true")) : (t.hide(), e.show(), $(".go-charge").removeAttr("disabled"))
	}),
	$(".go-charge").on("click",
	function() {
		var e = $(this),
		t = $("input[name='charge_num']").val(),
		a = $("input[name='pay_type']:checked").val(),
		n = e.data("nonce"),
		i = e.html();
		e.html(iconspin + i),
		Swal.fire({
			allowOutsideClick: !1,
			width: 200,
			timer: 6e4,
			onBeforeOpen: () =>{
				Swal.showLoading(),
				$.post(caozhuti.ajaxurl, {
					action: "charge_pay",
					charge_num: t,
					pay_type: a,
					nonce: n
				},
				function(t) {
					1 == t.status ? 2 == t.type ? "h5" == t.qrcode ? Swal.fire({
						title: "跳转到微信APP支付",
						text: "支付中切勿关闭此页面",
						type: "success",
						allowOutsideClick: !1,
						showCloseButton: !0,
						showCancelButton: !0,
						confirmButtonColor: "#3085d6",
						cancelButtonColor: "#d33",
						confirmButtonText: "前往支付",
						cancelButtonText: "放弃"
					}).then(e =>{
						e.value && (check_order_status(0, t.num), window.open(t.rurl))
					}) : window.location.href = t.rurl: 3 == t.type ? "undefined" == typeof WeixinJSBridge ? document.addEventListener ? document.addEventListener("WeixinJSBridgeReady", onBridgeReady, !1) : document.attachEvent && (document.attachEvent("WeixinJSBridgeReady", onBridgeReady), document.attachEvent("onWeixinJSBridgeReady", onBridgeReady)) : (check_order_status(0, t.num), WeixinJSBridge.invoke("getBrandWCPayRequest", t.msg,
					function(e) {
						e.err_msg,
						location.reload()
					})) : (e.html(i), Swal.fire({
						html: t.msg,
						showConfirmButton: !1,
						width: 300,
						padding: "0",
						background: "rgb(224, 224, 224)",
						allowOutsideClick: !1,
						showCloseButton: !0,
						animation: !0
					}), check_order_status(0, t.num)) : (e.html(i), Swal.fire("", t.msg, "error"))
				})
			}
		})
	});
	var e = document.getElementById("refurl");
	if (e) {
		var t, a = $("#refurl").data("clipboard-text"); (t = new ClipboardJS(e)).on("success",
		function(e) {
			Swal.mixin({
				toast: !0,
				showConfirmButton: !1,
				timer: 3e3
			}).fire({
				type: "success",
				title: "复制成功：" + a
			})
		}),
		t.on("error",
		function(e) {
			Swal.mixin({
				toast: !0,
				showConfirmButton: !1
			}).fire({
				type: "error",
				title: "复制失败：" + a
			})
		})
	}
	if ($(".go-add_reflog").on("click",
	function() {
		var e = $(this),
		t = e.html(),
		a = $("input[name='refmoney']").val(),
		n = ($("input[name='qr_weixin']").val(), $("input[name='qr_alipay']").val(), e.data("max")),
		i = e.data("nonce");
		return e.html(iconspin + t),
		a ? a > n ? (e.html(t), Swal.fire("", "可提现金额不足", "warning"), !1) : void $.post(caozhuti.ajaxurl, {
			action: "add_reflog",
			money: a,
			nonce: i
		},
		function(a) {
			1 == a.status ? (e.html(t), Swal.fire("", a.msg, "success").then(e =>{
				e.value && location.reload()
			})) : (e.html(t), Swal.fire("", a.msg, "warning"))
		}) : (e.html(t), Swal.fire("", "请输入提现金额", "warning"), !1)
	}), $(".go-add_reflog2").on("click",
	function() {
		var e = $(this),
		t = e.html(),
		a = $("input[name='refmoney']").val(),
		n = ($("input[name='qr_weixin']").val(), $("input[name='qr_alipay']").val(), e.data("max")),
		i = e.data("nonce");
		return e.html(iconspin + t),
		a ? a > n ? (e.html(t), Swal.fire("", "可提现金额不足", "warning"), !1) : void $.post(caozhuti.ajaxurl, {
			action: "add_reflog2",
			money: a,
			nonce: i
		},
		function(a) {
			1 == a.status ? (e.html(t), Swal.fire("", a.msg, "success").then(e =>{
				e.value && location.reload()
			})) : (e.html(t), Swal.fire("", a.msg, "warning"))
		}) : (e.html(t), Swal.fire("", "请输入提现金额", "warning"), !1)
	}), $('[etap="submit_qr"]').on("click",
	function() {
		var e = $(this),
		t = e.html(),
		a = $("input[name='qr_alipay']").val(),
		n = $("input[name='qr_weixin']").val();
		return e.html(iconspin + t),
		"" == a ? (e.html(t), Swal.fire("", "支付宝收款码不正确", "warning"), !1) : "" == n ? (e.html(t), Swal.fire("", "微信收款码不正确", "warning"), !1) : void $.post(caozhuti.ajaxurl, {
			qr_alipay: a,
			qr_weixin: n,
			action: "edit_user_qr"
		},
		function(a) {
			"1" == a ? (e.html(t), Swal.fire("", "保存成功", "success").then(e =>{
				e.value && location.reload()
			})) : (e.html(t), Swal.fire("", "上传失败", "error"))
		})
	}), $(".go-repassword").on("click",
	function(e) {
		e.preventDefault();
		var t = $(this),
		a = t.html(),
		n = $("input[name='password']").val(),
		i = $("input[name='new_password']").val(),
		o = $("input[name='re_password']").val();
		return t.html(iconspin + a),
		n && i && o ? i != o ? (t.html(a), Swal.fire("", "两次输入新密码不一致", "warning"), !1) : void $.post(caozhuti.ajaxurl, {
			password: n,
			new_password: i,
			re_password: o,
			action: "edit_repassword"
		},
		function(e) {
			"1" == e ? (t.html(a), Swal.fire("", "修改成功", "success").then(e =>{
				e.value && location.reload()
			})) : (t.html(a), Swal.fire("", e, "error"))
		}) : (t.html(a), Swal.fire("", "请输入完整密码", "warning"), !1)
	}), $(document).on("click", '[etap="star"]',
	function(e) {
		e.preventDefault();
		var t = $(this),
		a = t.html(),
		n = t.data("postid");
		t.html(iconspin),
		$.post(caozhuti.ajaxurl, {
			action: "fav_post",
			post_id: n
		},
		function(e) {
			e=JSON.parse(e);
			if (1 == e.status) {
				t.html(a),
				Swal.mixin({
					toast: !0,
					showConfirmButton: !1,
					timer: 1e3
				}).fire({
					type: "success",
					title: e.msg
				}),
				t.attr("disabled", "true"),
				t.toggleClass("ok")
			} else {
				t.html(a),
				Swal.mixin({
					toast: !0,
					showConfirmButton: !1,
					timer: 2e3
				}).fire({
					type: "error",
					title: e.msg
				})
			}
		})
	}), $(".click-qiandao").on("click",
	function() {
		var e = $(this),
		t = e.html();
		e.html(iconspin + "签到中..."),
		$.post(caozhuti.ajaxurl, {
			action: "user_qiandao"
		},
		function(a) {
			1 == a.status ? (e.html(t), Swal.fire(a.msg, "", "success"), setTimeout(function() {
				location.reload()
			},
			1e3)) : (e.html(t), Swal.fire(a.msg, "", "warning"))
		})
	}), (t = new ClipboardJS(".cop-codecdk")).on("success",
	function(e) {
		Swal.mixin({
			toast: !0,
			showConfirmButton: !1,
			timer: 3e3
		}).fire({
			type: "success",
			title: "卡密复制成功"
		})
	}), t.on("error",
	function(e) {
		Swal.mixin({
			toast: !0,
			showConfirmButton: !1
		}).fire({
			type: "error",
			title: "复制失败"
		})
	}), document.getElementById("editor")) {
		$("select[name='cao_status']").change(function() {
			var e = $(this).val();
			"free" == e && $(".hide1,.hide2,.hide3,.hide4,.hide5").hide(),
			"fee" == e && ($(".hide5").hide(), $(".hide1,.hide2,.hide3,.hide4").show()),
			"hide" == e && ($(".hide3,.hide4").hide(), $(".hide1,.hide2,.hide5").show())
		});
		var n = new(0, window.wangEditor)("#editor");
		n.customConfig.uploadImgServer = caozhuti.ajaxurl,
		n.customConfig.uploadImgMaxSize = 2097152,
		n.customConfig.uploadImgParams = {
			nonce: $(".go-write_post").data("nonce"),
			action: "update_img"
		},
		n.customConfig.uploadFileName = "file",
		n.create(),
		n.txt.html($("#editor_c").html()),
		$("#editor_c").remove()
	}
	$(".go-write_post").on("click",
	function(e) {
		e.preventDefault();
		var t = $(this),
		a = t.html(),
		i = $("input[name='post_title']").val(),
		o = ($("#post_content_ifr").contents().find("#tinymce"), n.txt.html()),
		s = $("select[name='post_cat']").val(),
		r = $("select[name='cao_status']").val(),
		c = $("input[name='cao_price']").val(),
		l = $("textarea[name='post_excerpt']").val(),
		u = $("input[name='cao_vip_rate']").val(),
		d = $("input[name='cao_pwd']").val(),
		m = $("input[name='cao_downurl']").val(),
		h = t.data("status"),
		p = t.data("edit_id") ? t.data("edit_id") : 0;
		t.data("nonce");
		if (t.html(iconspin + a), i.length < 6) return t.html(a),
		Swal.fire("", "标题最低6个字符", "warning"),
		!1;
		if ("" == o) return t.html(a),
		Swal.fire("", "请输入文章内容", "warning"),
		!1;
		if ("free" != r) {
			if (c <= 0) return t.html(a),
			Swal.fire("", "请输入正确价格（整数）", "warning"),
			!1;
			if (u > 1 || u < 0) return t.html(a),
			Swal.fire("", "折扣区间必须是：0.1~1", "warning"),
			!1
		}
		if ("fee" == r && m.length < 5) return t.html(a),
		Swal.fire("", "请输入下载地址", "warning"),
		!1;
		console.log(l),
		$.post(caozhuti.ajaxurl, {
			post_title: i,
			post_content: o,
			post_excerpt: l,
			post_cat: s,
			cao_status: r,
			cao_price: c,
			cao_vip_rate: u,
			cao_pwd: d,
			cao_downurl: m,
			post_status: h,
			edit_id: p,
			action: "cao_write_post"
		},
		function(e) {
			1 == e.status ? (t.html(a), Swal.fire({
				html: e.msg,
				type: "success"
			}).then(e =>{
				e.value && location.reload()
			})) : (t.html(a), Swal.fire("", e.msg, "warning"))
		})
	})
}
function to_pay_post(e, t, a, n, i) {
	Swal.fire({
		allowOutsideClick: !1,
		width: 200,
		timer: 6e4,
		onBeforeOpen: () =>{
			Swal.showLoading(),
			$.post(caozhuti.ajaxurl, {
				action: "go_post_pay",
				post_id: a,
				post_vid: i,
				pay_type: e,
				order_type: t,
				nonce: n
			},
			function(e) {
				1 == e.status ? 2 == e.type ? "h5" == e.qrcode ? Swal.fire({
					title: "跳转到微信APP支付",
					text: "支付中切勿关闭此页面",
					type: "success",
					allowOutsideClick: !1,
					showCloseButton: !0,
					showCancelButton: !0,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "前往支付",
					cancelButtonText: "放弃"
				}).then(t =>{
					t.value && (check_order_status(a, e.num), window.open(e.rurl))
				}) : window.location.href = e.rurl: 3 == e.type ? "undefined" == typeof WeixinJSBridge ? document.addEventListener ? document.addEventListener("WeixinJSBridgeReady", onBridgeReady, !1) : document.attachEvent && (document.attachEvent("WeixinJSBridgeReady", onBridgeReady), document.attachEvent("onWeixinJSBridgeReady", onBridgeReady)) : WeixinJSBridge.invoke("getBrandWCPayRequest", e.msg,
				function(e) {
					e.err_msg,
					location.reload()
				}) : (Swal.fire({
					html: e.msg,
					showConfirmButton: !1,
					width: 300,
					padding: "0",
					background: "rgb(224, 224, 224)",
					allowOutsideClick: !1,
					showCloseButton: !0,
					animation: !0,
					onClose: () =>{
						location.reload()
					}
				}), check_order_status(a, e.num)) : Swal.fire("", e.msg, "error")
			})
		}
	})
}
function check_order_status(e, t) {
	var a = setInterval(function() {
		$.post(caozhuti.ajaxurl, {
			action: "check_pay",
			num: t,
			post_id: e
		},
		function(e) {
			1 == e.status && (clearInterval(a), Swal.fire({
				type: "success",
				title: e.msg,
				showConfirmButton: !1,
				timer: 1500,
				onClose: () =>{
					location.reload()
				}
			}))
		})
	},
	3e3)
}
function to_yecpay_post(e, t, a, n) {
	$(this),
	e = e,
	n = n,
	t = t,
	a = a;
	Swal.fire({
		text: "购买此资源将消耗【" + a + "】",
		type: "question",
		showCancelButton: !0,
		confirmButtonText: "购买",
		cancelButtonText: "取消",
		reverseButtons: !0
	}).then(a =>{
		a.value && Swal.fire({
			allowOutsideClick: !1,
			width: 200,
			timer: 6e4,
			onBeforeOpen: () =>{
				Swal.showLoading(),
				$.post(caozhuti.ajaxurl, {
					action: "add_pay_post",
					post_id: e,
					post_vid: n,
					nonce: t
				},
				function(e) {
					1 == e.status ? Swal.fire({
						title: e.msg,
						type: "success"
					}).then(e =>{
						e.value && location.reload()
					}) : Swal.fire({
						type: "warning",
						html: e.msg
					})
				})
			}
		})
	})
}
function widget_ri() {
	"use strict";
	$(".click-pay").on("click",
	function() {
		$(this).html();
		var e = $(this).data("postid"),
		t = $("input[name='pay_id']").val(),
		a = $(this).data("nonce"),
		n = $(this).data("price");
		Swal.fire({
			title: "请选择支付方式",
			html: caozhuti.pay_type_html.html,
			showConfirmButton: !1,
			width: 300,
			showCloseButton: !0,
			onBeforeOpen: () =>{
				const i = Swal.getContent(),
				o = i.querySelector.bind(i),
				s = o("#alipay"),
				r = o("#weixinpay"),
				c = o("#yecpay");
				s && s.addEventListener("click", () =>{
					to_pay_post(caozhuti.pay_type_html.alipay, "other", e, a, t)
				}),
				r && r.addEventListener("click", () =>{
					to_pay_post(caozhuti.pay_type_html.weixinpay, "other", e, a, t)
				}),
				c && c.addEventListener("click", () =>{
					to_yecpay_post(e, a, n, t)
				})
			},
			onClose: () =>{}
		})
	}),
	$(".go-down").one("click",
	function() {
		var e = $(this),
		t = e.html(),
		a = e.text(),
		n = e.data("id");
		e.html(iconspin + a),
		Swal.fire({
			allowOutsideClick: !1,
			width: 200,
			timer: 6e4,
			onBeforeOpen: () =>{
				Swal.showLoading(),
				$.post(caozhuti.ajaxurl, {
					action: "user_down_ajax",
					post_id: n
				},
				function(a) {
					1 == a.status ? (e.html(t), Swal.fire({
						title: "下载地址获取成功",
						type: "success",
						showCancelButton: !0,
						confirmButtonColor: "#3085d6",
						cancelButtonColor: "#d33",
						confirmButtonText: "立即下载",
						cancelButtonText: "关闭"
					}).then(e =>{
						e.value ? (window.open(a.msg), location.reload()) : location.reload()
					})) : (e.html(t), Swal.fire({
						type: "warning",
						html: a.msg
					}).then(e =>{
						location.reload()
					}))
				})
			}
		})
	})
}
function navbar() {
	"use strict";
	st = jQuery(window).scrollTop();
	var e = jQuery(".ads.before_header").outerHeight(),
	t = jQuery(".site-header").height(),
	a = jQuery(".navbar-sticky_transparent.with-hero"),
	n = jQuery(".navbar-sticky.ads-before-header, .navbar-sticky_transparent.ads-before-header"),
	i = jQuery(".navbar-sticky.navbar-slide, .navbar-sticky_transparent.navbar-slide");
	st > t + e ? a.addClass("navbar-sticky") : a.removeClass("navbar-sticky"),
	st > e ? n.addClass("stick-now") : n.removeClass("stick-now"),
	st > lastSt && st > t + e + 100 ? i.addClass("slide-now") : st + jQuery(window).height() < jQuery(document).height() && i.removeClass("slide-now"),
	lastSt = st
}
function carousel() {
	"use strict";
	jQuery(".carousel.module").owlCarousel({
		autoHeight: !0,
		dots: !1,
		margin: 30,
		nav: !0,
		navSpeed: 500,
		navText: navText,
		responsive: {
			0 : {
				items: 1
			},
			768 : {
				items: 3
			},
			992 : {
				items: 4
			}
		}
	})
}
function slider() {
	"use strict";
	var e = {
		autoplay: !0,
		autoplaySpeed: 800,
		loop: !0
	},
	t = jQuery(".slider.big.module"),
	a = {
		animateOut: "fadeOut",
		dots: !0,
		items: 1,
		nav: !1,
		navText: navText
	};
	t.each(function(t, n) {
		if (jQuery(n).hasClass("autoplay")) {
			var i = Object.assign(e, a);
			jQuery(n).owlCarousel(i)
		} else jQuery(n).owlCarousel(a)
	});
	var n = jQuery(".slider.center.module"),
	i = {
		center: !0,
		dotsSpeed: 800,
		loop: !0,
		margin: 20,
		responsive: {
			0 : {
				items: 1
			},
			768 : {
				items: 2
			}
		}
	};
	n.each(function(t, a) {
		if (jQuery(a).hasClass("autoplay")) {
			var n = Object.assign(e, i);
			jQuery(a).owlCarousel(n)
		} else jQuery(a).owlCarousel(i)
	});
	var o = jQuery(".slider.thumbnail.module"),
	s = {
		dotsData: !0,
		dotsSpeed: 800,
		items: 1
	};
	o.each(function(t, a) {
		if (jQuery(a).hasClass("autoplay")) {
			var n = Object.assign(e, s);
			jQuery(a).owlCarousel(n)
		} else jQuery(a).owlCarousel(s)
	})
}
function tap_full() {
	"use strict";
	$('[etap="to_full"]').on("click",
	function() {
		var e = document.documentElement;
		$("body").hasClass("full-screen") ? (console.log(document), $("body").removeClass("full-screen"), $("#alarm-fullscreen-toggler").removeClass("active"), document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen()) : ($("body").addClass("full-screen"), $("#alarm-fullscreen-toggler").addClass("active"), e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen && e.msRequestFullscreen())
	})
}
function megaMenu() {
	"use strict";
	jQuery(".menu-posts").not(".owl-loaded").owlCarousel({
		items: 5,
		margin: 15
	});
	var e = $(".rollbar");
	$(window).scroll(function() {
		document.documentElement.scrollTop + document.body.scrollTop > 200 ? e.fadeIn() : e.fadeOut()
	}),
	$('[etap="to_top"]').on("click",
	function() {
		$("html,body").animate({
			scrollTop: 0
		},
		300)
	}),
	$(document).on("click", ".tap-dark",
	function(e) {
		var t = $(this),
		a = t.html();
		t.html(iconspin),
		$.ajax({
			url: caozhuti.ajaxurl,
			type: "POST",
			dataType: "html",
			data: {
				is_ripro_dark: !0 === $("body").hasClass("ripro-dark") ? "0": "1",
				action: "tap_dark"
			}
		}).done(function(e) {}),
		toggleDarkMode(),
		t.html(a)
	}),
	$(document).on("click", ".tap-blog-style",
	function(e) {
		var t = $(this),
		a = t.html(),
		n = t.data("id");
		t.html(iconspin),
		$.ajax({
			url: caozhuti.ajaxurl,
			type: "POST",
			dataType: "html",
			data: {
				is_blog_style: n,
				action: "blog_style"
			}
		}).done(function(e) {
			t.html(a),
			location.reload()
		})
	})
}
function toggleDarkMode() {
	$("body").toggleClass("ripro-dark")
}
function categoryBoxes() {
	"use strict";
	jQuery(".category-boxes").owlCarousel({
		dots: !1,
		margin: 30,
		nav: !0,
		navSpeed: 500,
		navText: navText,
		responsive: {
			0 : {
				items: 1
			},
			768 : {
				items: 2
			},
			992 : {
				items: 3
			},
			1230 : {
				items: 4
			}
		}
	})
}
function offCanvas() {
	"use strict";
	var e = jQuery(".burger"),
	t = jQuery(".canvas-close");
	jQuery(".main-menu .nav-list").slicknav({
		label: "",
		prependTo: ".mobile-menu"
	}),
	e.on("click",
	function() {
		body.toggleClass("canvas-opened"),
		body.addClass("canvas-visible"),
		dimmer("open", "medium")
	}),
	t.on("click",
	function() {
		body.hasClass("canvas-opened") && (body.removeClass("canvas-opened"), dimmer("close", "medium"))
	}),
	jQuery(".dimmer").on("click",
	function() {
		body.hasClass("canvas-opened") && (body.removeClass("canvas-opened"), dimmer("close", "medium"))
	}),
	jQuery(document).keyup(function(e) {
		27 == e.keyCode && body.hasClass("canvas-opened") && (body.removeClass("canvas-opened"), dimmer("close", "medium"))
	})
}
function search() {
	"use strict";
	var e = jQuery(".main-search"),
	t = e.find(".search-field");
	jQuery(".search-open").on("click",
	function() {
		body.addClass("search-open"),
		t.focus()
	}),
	jQuery(document).keyup(function(e) {
		27 == e.keyCode && body.hasClass("search-open") && body.removeClass("search-open")
	}),
	jQuery(".search-close").on("click",
	function() {
		body.hasClass("search-open") && body.removeClass("search-open")
	}),
	jQuery(document).mouseup(function(t) { ! e.is(t.target) && 0 === e.has(t.target).length && body.hasClass("search-open") && body.removeClass("search-open")
	})
}
function pagination() {
	"use strict";
	var e = jQuery(".posts-wrapper"),
	t = jQuery(".infinite-scroll-button"),
	a = {
		append: e.selector + " > *",
		debug: !1,
		hideNav: ".posts-navigation",
		history: !1,
		path: ".posts-navigation .nav-previous a",
		prefill: !0,
		status: ".infinite-scroll-status"
	};
	body.hasClass("pagination-infinite_button") && (a.button = t.selector, a.prefill = !1, a.scrollThreshold = !1, e.on("request.infiniteScroll",
	function(e, a) {
		t.html(caozhuti.infinite_loading)
	}), e.on("load.infiniteScroll",
	function(e, a, n) {
		t.html(caozhuti.infinite_load)
	})),
	(body.hasClass("pagination-infinite_button") || body.hasClass("pagination-infinite_scroll")) && body.hasClass("paged-next") && e.infiniteScroll(a)
}
function sidebar() {
	"use strict";
	var e = jQuery(".site-header").height();
	$(window).width() < 768 ? $("aside .widget.widget-pay").insertAfter($("#pay-single-box")) : (jQuery(".container .sidebar-column").theiaStickySidebar({
		additionalMarginTop: e + 0
	}), jQuery(".container .content-column").theiaStickySidebar({
		additionalMarginTop: e + 0
	}))
}
function fancybox() {
	"use strict";
	$(function() {
		if (0 == caozhuti.is_singular) return ! 1;
		$('.entry-content a[href*=".jpg"],.entry-content a[href*=".jpeg"],.entry-content a[href*=".png"],.entry-content a[href*=".gif"]').each(function() {
			0 == $(this).parents("a").length && $(this).attr("data-fancybox", "images")
		})
	})
}
function dimmer(e, t) {
	"use strict";
	var a = jQuery(".dimmer");
	switch (e) {
	case "open":
		a.fadeIn(t);
		break;
	case "close":
		a.fadeOut(t)
	}
}
function notify() {
	"use strict";
	$(function() {
		if (0 == caozhuti.site_notice.is) return ! 1;
		null == $.cookie("cao_notice_cookie") && Swal.fire({
			html: caozhuti.site_notice.html,
			background: caozhuti.site_notice.color,
			showConfirmButton: !1,
			width: 560,
			padding: "0",
			allowOutsideClick: !1,
			showCloseButton: !0
		}).then(e =>{
			$.cookie("cao_notice_cookie", "1", {
				expires: 1
			})
		})
	})
}
function is_check_name(e) {
	return /^[\w]{3,16}$/.test(e)
}
function is_check_mail(e) {
	return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(e)
}
function is_check_pass(e, t) {
	return ! (e.length < 6) && !(e = !t)
}
function is_in_weixin() {
	return "micromessenger" == navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
}
window.lazySizesConfig = window.lazySizesConfig || {},
window.lazySizesConfig.loadHidden = !1,
jQuery(function() {
	"use strict";
	carousel(),
	slider(),
	megaMenu(),
	categoryBoxes(),
	offCanvas(),
	search(),
	pagination(),
	sidebar(),
	fancybox(),
	userinit(),
	signup_popup(),
	share_pop(),
	widget_ri(),
	notify(),
	tap_full(),
	ajax_searc(),
	ajax_getpost()
}),
jQuery(window).scroll(function() {
	"use strict"; (body.hasClass("navbar-sticky") || body.hasClass("navbar-sticky_transparent")) && window.requestAnimationFrame(navbar)
}),
jQuery(".header-dropdown").hover(function() {
	$(this).addClass("active")
},
function() {
	$(this).removeClass("active")
}),
document.addEventListener("lazyloaded",
function(e) {
	var t = {
		disableParallax: /iPad|iPhone|iPod|Android/,
		disableVideo: /iPad|iPhone|iPod|Android/,
		speed: .1
	}; (jQuery(e.target).parents(".hero").length || jQuery(e.target).hasClass("hero")) && jQuery(e.target).jarallax(t),
	(jQuery(e.target).parent().hasClass("module") && jQuery(e.target).parent().hasClass("parallax") || jQuery(e.target).parent().hasClass("entry-navigation")) && jQuery(e.target).parent().jarallax(t)
});