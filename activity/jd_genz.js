/**
芥么赚豪礼
cron 37 0,11 * * * jd_genz.js
入口：芥么微信小程序-赚豪礼
没微信号测试，故没有抓到注册包，请登录一次小程序后方可执行脚本，只做部分任务.可换话费券和e卡
更新过新手任务，个别任务必须手动进入一次活动页面
*/
const $ = new Env("芥么赚豪礼");
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [], cookie = ''
let appid = "yX3KNttlA6GbZjHuDz0-WQ", typeid = "44782287613952";
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    let cookiesData = $.getdata('CookiesJD') || "[]";
    cookiesData = JSON.parse(cookiesData);
    cookiesArr = cookiesData.map(item => item.cookie);
    cookiesArr.reverse();
    cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
    cookiesArr.reverse();
    cookiesArr = cookiesArr.filter(item => !!item);
}
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    UUID = getUUID('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    for (let i = 0; i < cookiesArr.length; i++) {
        UA = `jdapp;iPhone;10.0.8;14.6;${UUID};network/wifi;JDEbook/openapp.jdreader;model/iPhone9,2;addressid/2214222493;appBuild/168841;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16E158;supportJDSHWK/1`;
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            await TotalBean();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            await main();
        }
    }
})().catch((e) => { $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '') }).finally(() => { $.done(); })

async function main() {
    $.reg = false;
    $.tasklist = [];
    await task('apTaskList', { "linkId": appid, "uniqueId": "" })
    await $.wait(500);
    await task('findPostTagList', { "typeId": typeid })
    if (!$.reg && $.tasklist) {
        await task('genzTaskCenter')
        if ($.genzTask) {
            $.log(`当前芥么豆：${$.totalPoints}`)
            for (const vo of $.genzTask) {
                if (!vo.completionStatus) {
                    $.log(`去完成：${vo.taskName}新手任务！`)
                    await task('genzDoNoviceTasks', { "taskId": vo.taskId, "completionStatus": 1 })
                }
            }
        }
        for (const vo of $.tasklist) {
            if (vo.taskType != "JOIN_INTERACT_ACT" && vo.taskType != "SHARE_INVITE") {
                $.log(`去完成：${vo.taskShowTitle}`)
                for (let x = 0; x < vo.taskLimitTimes; x++) {
                    if (vo.taskDoTimes != vo.taskLimitTimes) {
                        await $.wait(500);
                        await task('apDoTask', { "linkId": appid, "taskType": vo.taskType, "taskId": vo.id, "channel": "2", "itemId": vo.taskSourceUrl })
                    }
                }
            }
            if ($.taglist) {
                if (vo.taskType === "JOIN_INTERACT_ACT") {
                    let taglist = $.taglist[random(0, $.taglist.length)]
                    await task('findTagPosts', { "tagId": taglist.tagId, "tagCategoryId": taglist.typeId, "page": 1, "pageSize": 10 })
                    if ($.postlist) {
                        if (vo.taskShowTitle === '喜欢帖子') {
                            $.log("去完成点赞任务")
                            for (let x = 0; x < vo.taskLimitTimes; x++) {
                                if (vo.taskDoTimes != vo.taskLimitTimes) {
                                    PostId = [];
                                    likePostId = $.postlist[random(0, $.postlist.length)]
                                    PostId.push(likePostId.postId)
                                    PostIdx = PostId[random(0, PostId.length)]
                                    await task('likePosts', { "likePostId": PostIdx })
                                    await $.wait(500);
                                    await task('cancelLikePosts', { "likePostId": PostIdx })
                                }
                            }
                        }
                        if (vo.taskShowTitle === '关注芥么er') {
                            $.log("去完成关注任务")
                            for (let x = 0; x < vo.taskLimitTimes; x++) {
                                if (vo.taskDoTimes != vo.taskLimitTimes) {
                                    userId = [];
                                    likeuserId = $.postlist[random(0, $.postlist.length)]
                                    userId.push(likeuserId.userId)
                                    userIdx = userId[random(0, userId.length)]
                                    await task('followHim', { "forwardUserId": userIdx })
                                    await $.wait(500);
                                    await task('cancelFollowHim', { "forwardUserId": userIdx })
                                }
                            }
                        }
                    }
                }
            } else {
                $.log("没有获取到列表，不做此任务")
            }
            if (vo.taskDoTimes === vo.taskLimitTimes) {
                $.log(`任务：${vo.taskShowTitle}，已完成`)
            }
        }
    } else { console.log("未注册！请手动进入一次小程序任务\n入口：微信小程序-芥么-赚豪礼") } return;
}
function task(function_id, body) {
    return new Promise(resolve => {
        $.get(taskUrl(function_id, body), async (err, resp, data) => {
            try {
                if (err) {
                    $.log(err)
                } else {
                    data = JSON.parse(data);
                    switch (function_id) {
                        case 'apTaskList':
                            $.tasklist = data.data
                            break;
                        case 'apDoTask':
                            if (data.success) {
                                if (data.code === 0) {
                                    console.log("任务完成")
                                }
                            } else {
                                console.log(JSON.stringify(data));
                            }
                            break;
                        case 'findPostTagList':
                            if (data.code === 0) {
                                $.taglist = data.data;
                            } else if (data.code === 4001) {
                                $.reg = true;
                            } else {
                                console.log(JSON.stringify(data));
                            }
                            break;
                        case 'findTagPosts':
                            if (data.code === 0) {
                                $.postlist = data.data.list;
                            }
                            break;
                        case 'likePosts':
                            if (data.code === 0) {
                                console.log(data.data);
                            } else {
                                console.log(JSON.stringify(data));
                            }
                            break;
                        case 'cancelLikePosts':
                            if (data.code === 0) {
                                console.log(data.data);
                            } else {
                                console.log(JSON.stringify(data));
                            }
                            break;
                        case 'followHim':
                            if (data.code === 0) {
                                console.log("关注成功");
                            } else {
                                console.log(JSON.stringify(data));
                            }
                            break;
                        case 'cancelFollowHim':
                            if (data.code === 0) {
                                console.log("取消关注");
                            } else {
                                console.log(JSON.stringify(data));
                            }
                            break;
                        case 'genzTaskCenter':
                            $.genzTask = data.data.noviceTaskStatusList;
                            $.totalPoints = data.data.totalPoints;
                            break;
                        case 'genzDoNoviceTasks':
                            if (data.success) {
                                if (data.data) {
                                    console.log("任务完成");
                                } else {
                                    console.log(JSON.stringify(data));
                                }
                            } else {
                                console.log(JSON.stringify(data));
                            }
                            break;
                        default:
                            $.log(JSON.stringify(data))
                            break;
                    }
                }
            } catch (error) {
                $.log(error)
            } finally {
                resolve();
            }
        })
    })
}

function taskUrl(function_id, body) {
    return {
        url: `https://api.m.jd.com/?functionId=${function_id}&body=${escape(JSON.stringify(body))}&_t=${new Date().getTime()}&appid=gen-z`,
        headers: {
            "Host": "api.m.jd.com",
            "Connection": "keep-alive",
            "content-type": "application/json",
            "Accept-Encoding": "gzip,compress,br,deflate",
            "User-Agent": UA,
            "Cookie": cookie,
            "Referer": "https://servicewechat.com/wx9a412175d4e99f91/42/page-frame.html",
        },
    }
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
// prettier-ignore
function getUUID(x = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", t = 0) { return x.replace(/[xy]/g, function (x) { var r = 16 * Math.random() | 0, n = "x" == x ? r : 3 & r | 8; return uuid = t ? n.toString(36).toUpperCase() : n.toString(36), uuid }) }
function TotalBean() { return new Promise(async e => { const n = { url: "https://wq.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2", headers: { Host: "wq.jd.com", Accept: "*/*", Connection: "keep-alive", Cookie: cookie, "User-Agent": UA, "Accept-Language": "zh-cn", Referer: "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&", "Accept-Encoding": "gzip, deflate, br" } }; $.get(n, (n, o, a) => { try { if (n) $.logErr(n); else if (a) { if (1001 === (a = JSON.parse(a))["retcode"]) return void ($.isLogin = !1); 0 === a["retcode"] && a.data && a.data.hasOwnProperty("userInfo") && ($.nickName = a.data.userInfo.baseInfo.nickname), 0 === a["retcode"] && a.data && a.data["assetInfo"] && ($.beanCount = a.data && a.data["assetInfo"]["beanNum"]) } else console.log("京东服务器返回空数据") } catch (e) { $.logErr(e) } finally { e() } }) }) }
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
