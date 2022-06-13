/*
6.13-6.20 时尚狂欢盛典
开卡脚本,一次性脚本


第一个账号助力作者 其他依次助力CK1
第一个CK失效会退出脚本
————————————————
入口：[ 6.13-6.20 时尚狂欢盛典 ]

请求太频繁会被黑ip
过10分钟再执行

cron:10 10 14-20 6 *
============Quantumultx===============
[task_local]
#6.13-6.20 时尚狂欢盛典
10 10 14-20 6 * jd_opencardL187.js, tag=6.13-6.20 时尚狂欢盛典, enabled=true

*/

const $ = new Env('6.13-6.20 时尚狂欢盛典');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
    cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

allMessage = ""
message = ""
$.hotFlag = false
$.outFlag = false
$.activityEnd = false
let lz_jdpin_token_cookie =''
let activityCookie =''
let cookies = []
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }

  $.activityId = "dz19181d9f4878be1fedb3c54e714b"
  $.shareUuid = "c8c01a5afba94550992fd2728369c3b3"
  console.log(`入口:\nhttps://lzdz1-isv.isvjcloud.com/dingzhi/june/fashionUnion/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`)
  let shareUuidArr = ["c8c01a5afba94550992fd2728369c3b3","7f9c998d38e4486495a62032865c9fea","73ed5a10ab844be18564f40bc4548337"]
  let s = Math.floor((Math.random()*3))
  let n = 0
  n = Math.floor((Math.random()*shareUuidArr.length))
  $.shareUuid = shareUuidArr[n] ? shareUuidArr[n] : $.shareUuid
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      message = ""
      $.bean = 0
      $.hotFlag = false
      $.nickName = '';
      console.log(`\n\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      await getUA()
      await run();
			await $.wait(3000)
      if(i == 0 && !$.actorUuid) break
      if($.outFlag || $.activityEnd) break
    }
  }
  if($.outFlag) {
    let msg = '此ip已被限制，请过10分钟后再执行脚本'
    $.msg($.name, ``, `${msg}`);
    if ($.isNode()) await notify.sendNotify(`${$.name}`, `${msg}`);
  }
  if(allMessage){
    $.msg($.name, ``, `${allMessage}`);
    // if ($.isNode()) await notify.sendNotify(`${$.name}`, `${allMessage}`);
  }
  console.log($.toStr(cookies))
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


async function run() {
  try {
    $.joinShopStatus = true
    $.hasEnd = true
    $.endTime = 0
    lz_jdpin_token_cookie = ''
    $.Token = ''
    $.Pin = ''
    let flag = false
    await takePostRequest('isvObfuscator');
    if($.Token == ''){
      console.log('获取[token]失败！')
      return
    }
    await getCk()
    if (activityCookie == '') {
      console.log(`获取cookie失败`); return;
    }
    if($.activityEnd === true){
      console.log('活动结束')
      return
    }
    if($.outFlag){
      console.log('此ip已被限制，请过10分钟后再执行脚本\n')
      return
    }
    if(!$.shopId || !$.venderId) await takePostRequest('getSimpleActInfoVo');
    await takePostRequest('getMyPing');
    if(!$.Pin){
      console.log('获取[Pin]失败！')
      return
    }
    if($.hotFlag) return

    await takePostRequest('accessLogWithAD');
    await takePostRequest('getUserInfo');
    await takePostRequest('activityContent');
    if($.hotFlag) return
    if(!$.actorUuid){
      console.log('获取不到[actorUuid]退出执行，请重新执行')
      return
    }
    if($.hasEnd === true || Date.now() > $.endTime){
      $.activityEnd = true
      console.log('活动结束')
      return
    }
		console.log($.actorUuid)
    await takePostRequest('drawContent');
    await $.wait(1000)
    $.openList = []
    $.allOpenCard = false
    await takePostRequest('checkOpenCard');
    // return
		if($.allOpenCard == false){
      console.log('开卡任务')
      for(o of $.openList){
        $.openCard = false
        if(o.openStatus == 0){
          flag = true
          $.shopactivityId = ''
          $.joinVenderId = o.venderId
          await getshopactivityId()
          for (let i = 0; i < Array(5).length; i++) {
            if (i > 0) console.log(`第${i}次 重新开卡`)
            await joinShop()
						await $.wait(500)
            if ($.errorJoinShop.indexOf('活动太火爆，请稍后再试') == -1) {
              break
            }
          }
          if ($.errorJoinShop.indexOf('活动太火爆，请稍后再试') > -1) {
            console.log("开卡失败❌ ，重新执行脚本")
            allMessage += `【账号${$.index}】开卡失败❌ ，重新执行脚本\n`
          } else {
            $.joinStatus = true
          }
          await takePostRequest('activityContent');
          await takePostRequest('drawContent');
          await takePostRequest('checkOpenCard');
          await $.wait(1000)
        }
      }
    }else{
      console.log('已全部开卡')
    }

    $.log("关注: " + $.followShop)
    if(!$.followShop && !$.outFlag){
      flag = true
      await takePostRequest('followShop');
    }
    $.log("关注频道: " + $.followPeony)
    if(!$.followPeony && !$.outFlag){
      flag = true
      await takePostRequest('followPeony');
    }
    $.log("加购: " + $.skuAddCart)
    if(!$.skuAddCart && !$.outFlag){
        flag = true
        await takePostRequest('addSku');
        await $.wait(parseInt(Math.random() * 2000 + 1000, 10))
    }
    if(flag){
      await takePostRequest('activityContent');
    }
    console.log(`${$.score}值`)
      $.runFalag = true
      let count = parseInt($.score/1)
      console.log(`抽奖次数为:${count}`)
      for(m=1;count--;m++){
        console.log(`第${m}次抽奖`)
        await takePostRequest('抽奖');
        if($.runFalag == false) break
        if(Number(count) <= 0) break
        if(m >= 1){
          console.log("抽奖太多次，多余的次数请再执行脚本")
          break
        }
      }

    await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
    //await takePostRequest('getDrawRecordHasCoupon');
    //await takePostRequest('getShareRecord');
    if($.outFlag){
      console.log('此ip已被限制，请过10分钟后再执行脚本\n')
      return
    }
    console.log($.actorUuid)
    console.log(`当前助力:${$.shareUuid}`)
    if($.index == 1){
      $.shareUuid = $.actorUuid
      console.log(`后面的号都会助力:${$.shareUuid}`)
    }
      if($.index % 3 == 0) console.log('休息一下，别被黑ip了\n可持续发展')
      if($.index % 3 == 0) await $.wait(parseInt(Math.random() * 5000 + 10000, 10))
  } catch (e) {
    console.log(e)
  }
}

async function takePostRequest(type) {
  if($.outFlag) return
  let domain = 'https://lzdz1-isv.isvjcloud.com';
  let body = ``;
  let method = 'POST'
  let admJson = ''
  switch (type) {
    case 'isvObfuscator':
      url = `https://api.m.jd.com/client.action?functionId=isvObfuscator`;
      body = `body=%7B%22url%22%3A%22https%3A//lzdz1-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&uuid=66e3681131700de71385967326bf41cf9fc5e163&client=apple&clientVersion=10.1.4&st=1647872191952&sv=120&sign=af51071ecb7198d560b138c8528642f1`;
      break;
      case 'getSimpleActInfoVo':
        url = `${domain}/dz/common/getSimpleActInfoVo`;
        body = `activityId=${$.activityId}`;
        break;
      case 'getMyPing':
        url = `${domain}/customer/getMyPing`;
        body = `userId=${$.shopId || $.venderId || ''}&token=${$.Token}&fromType=APP`;
        break;
      case 'accessLogWithAD':
        url = `${domain}/common/accessLogWithAD`;
        let pageurl = `${domain}/dingzhi/june/fashionUnion/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`
        body = `venderId=${$.shopId || $.venderId || ''}&code=99&pin=${encodeURIComponent($.Pin)}&activityId=${$.activityId}&pageUrl=${encodeURIComponent(pageurl)}&subType=app&adSource=`
        break;
      case 'getUserInfo':
        url = `${domain}/wxActionCommon/getUserInfo`;
        body = `pin=${encodeURIComponent($.Pin)}`;
        break;
      case 'activityContent':
        url = `${domain}/dingzhi/june/fashionUnion/activityContent`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&pinImg=${encodeURIComponent($.attrTouXiang)}&nick=${encodeURIComponent($.nickname)}&cjyxPin=&cjhyPin=&shareUuid=${$.shareUuid}`
        break;
      case 'drawContent':
        url = `${domain}/dingzhi/taskact/common/drawContent`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
        break;
      case 'checkOpenCard':
        url = `${domain}/dingzhi/june/fashionUnion/initOpenCard`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}&shareUuid=${$.shareUuid}`
        break;
      case 'info':
        url = `${domain}/dingzhi/linkgame/task/opencard/info`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}`
        break;
      case 'startDraw':
        url = `${domain}/joint/order/draw`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}&drawType=1`
        break;
      case 'followShop':
        url = `${domain}/dingzhi/june/fashionUnion/saveTask`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}&shareUuid=${$.shareUuid}&taskType=23&taskValue=23`
        break;
      case 'sign':
      case 'addCart':
      case 'browseGoods':
        url = `${domain}/dingzhi/opencard/${type}`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
        if(type == 'browseGoods') body += `&value=${$.visitSkuValue}`
        break;
      case '邀请':
      case '助力':
        if(type == '助力'){
          url = `${domain}/dingzhi/linkgame/assist`;
        }else{
          url = `${domain}/dingzhi/linkgame/assist/status`;
        }
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&shareUuid=${$.shareUuid}`
        break;
      case 'viewVideo':
      case 'visitSku':
      case 'toShop':
      case 'followPeony':
      case 'addSku':
        url = `${domain}/dingzhi/june/fashionUnion/saveTask`;
        let taskType = ''
        let taskValue = ''
        if(type == 'viewVideo'){
          taskType = 31
          taskValue = 31
        }else if(type == 'visitSku'){
          taskType = 5
          taskValue = $.visitSkuValue || 5
        }else if(type == 'toShop'){
          taskType = 14
          taskValue = $.toShopValue || 14
        }else if(type == 'followPeony'){
          taskType = 6
          taskValue = 6
        }else if(type == 'addSku'){
          taskType = 21
          taskValue = 21
        }
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}&taskType=${taskType}&taskValue=${taskValue}`
        break;
      case 'getDrawRecordHasCoupon':
        url = `${domain}/dingzhi/taskact/common/getDrawRecordHasCoupon`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}`
        break;
      case 'getShareRecord':
        url = `${domain}/dingzhi/taskact/common/getShareRecord`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}`
        break;
      case '抽奖':
        url = `${domain}/dingzhi/june/fashionUnion/draw`;
        body = `activityId=${$.activityId}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.Pin)}`
        break;
      default:
        console.log(`错误${type}`);
    }
    let myRequest = getPostRequest(url, body, method);
    // console.log(myRequest)
    return new Promise(async resolve => {
      $.post(myRequest, (err, resp, data) => {
        try {
          setActivityCookie(resp)
          if (err) {
            if(resp && typeof resp.statusCode != 'undefined'){
              if(resp.statusCode == 493){
                console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                $.outFlag = true
              }
            }
            console.log(`${$.toStr(err,err)}`)
            console.log(`${type} API请求失败，请检查网路重试`)
          } else {
            dealReturn(type, data);
          }
        } catch (e) {
          // console.log(data);
          console.log(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }

async function dealReturn(type, data) {
  let res = ''
  try {
    if(type != 'accessLogWithAD' || type != 'drawContent'){
      if(data){
        res = JSON.parse(data);
      }
    }
  } catch (e) {
    console.log(`${type} 执行任务异常`);
    console.log(data);
    $.runFalag = false;
  }
  try {
    switch (type) {
      case 'isvObfuscator':
        if(typeof res == 'object'){
          if(res.errcode == 0){
            if(typeof res.token != 'undefined') $.Token = res.token
          }else if(res.message){
            console.log(`isvObfuscator ${res.message || ''}`)
          }else{
            console.log(data)
          }
        }else{
          console.log(data)
        }
        break;
      case 'getSimpleActInfoVo':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            if(typeof res.data.shopId != 'undefined') $.shopId = res.data.shopId
            if(typeof res.data.venderId != 'undefined') $.venderId = res.data.venderId
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'getMyPing':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            if(res.data && typeof res.data.secretPin != 'undefined') $.Pin = res.data.secretPin
            if(res.data && typeof res.data.nickname != 'undefined') $.nickname = res.data.nickname
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'getUserInfo':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            if(res.data && typeof res.data.yunMidImageUrl != 'undefined') $.attrTouXiang = res.data.yunMidImageUrl || "https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png"
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'activityContent':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            $.endTime = res.data.endTime || (res.data.activityVo && res.data.activityVo.endTime) || res.data.activity.endTime || 0
            $.hasEnd = res.data.hasEnd || false
            $.score = res.data.score || 0
            $.actorUuid = res.data.actorUuid || ''
            $.followShop = res.data.allFollowShop || false
            $.skuAddCart = res.data.skuAddCart || false
            $.followPeony = res.data.followPeony || false
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'info':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            // $.drawCount = res.data.drawCount || 0
            $.addCart = res.data.addCart || false
            // $.followShop = res.data.followShop || false
            // $.sign = res.data.isSignStatus || false
            // $.visitSku = res.data.visitSku || false
            // $.visitSkuList = res.data.visitSkuList || []
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'checkOpenCard':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            let cardList1 = res.data.cardList1 || []
            let cardList2 = res.data.cardList2 || []
            let cardList = res.data.cardList || []
            let openCardList = res.data.openCardList || []
            let openInfo = res.data.openInfo || []
            $.openList = [...cardList,...cardList1,...cardList2,...openCardList,...openInfo]
            $.allOpenCard = res.data.allOpenCard || res.data.isOpenCardStatus || false
            $.openCardScore1 = res.data.score1 || 0
            $.openCardScore2 = res.data.score2 || 0
            $.drawScore = res.data.score || 0
            if(res.data.beans || res.data.addBeanNum) console.log(`开卡获得:${res.data.beans || res.data.addBeanNum}豆`)
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'startDraw':
      case 'followShop':
      case 'viewVideo':
      case 'visitSku':
      case 'followPeony':
      case 'toShop':
      case 'addSku':
      case 'sign':
      case 'addCart':
      case 'browseGoods':
      case '抽奖':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            if(typeof res.data == 'object'){
              let msg = ''
              let title = '抽奖'
              if(res.data.taskbeanNum){
                msg = `${res.data.taskbeanNum}京豆`
              }
              if(res.data.addPoint){
                msg += ` ${res.data.addPoint}游戏机会`
              }
              if(type == 'followShop'){
                title = '关注'
                if(res.data.beanNumMember && res.data.assistSendStatus){
                  msg += ` 额外获得:${res.data.beanNumMember}京豆`
                }
              }else if(type == 'addSku' || type == 'addCart'){
                title = '加购'
              }else if(type == 'viewVideo'){
                title = '热门文章'
              }else if(type == 'toShop'){
                title = '浏览店铺'
              }else if(type == 'followPeony'){
                title = '关注频道'
              }else if(type == 'visitSku' || type == 'browseGoods'){
                title = '浏览商品'
              }else if(type == 'sign'){
                title = '签到'
              }else{
                msg = res.data.wdsrvo.drawOk == true && (res.data.wdsrvo.name || '空气💨')
              }
              if(!msg){
                msg = '空气💨'
              }
              console.log(`${title}获得:${msg || data}`)
            }else{
              console.log(`${type} ${data}`)
            }
          }else if(res.errorMessage){
            $.runFalag = false;
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'getDrawRecordHasCoupon':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            console.log(`我的奖品：`)
            let num = 0
            let value = 0
            for(let i in res.data){
              let item = res.data[i]
              if(item.infoName == '20京豆' && item.drawStatus && item.value){
                num++
                value = item.infoName.replace('京豆','')
              }else{
                console.log(`${item.infoName}`)
              }
            }
            if(num > 0) console.log(`邀请好友(${num}):${num*parseInt(value, 10) || 30}京豆`)
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'getShareRecord':
        if(typeof res == 'object'){
          if(res.result && res.result === true && res.data){
            $.ShareCount = res.data.length
            $.log(`=========== 你邀请了:${$.ShareCount}个\n`)
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case '邀请':
      case '助力':
        // console.log(data)
        if(typeof res == 'object'){
          if(res.data.status == 200){
            if(type == '助力'){
              console.log('助力成功')
            }else{
              $.yaoqing = true
            }
          }else if(res.data.status == 105){
            console.log('已经助力过')
          }else if(res.data.status == 104){
            console.log('已经助力其他人')
          }else if(res.data.status == 101){
            // console.log('已经助力过')
          }else{
            console.log(data)
          }
        }else{
          console.log(`${type} ${data}`)
        }

      case 'accessLogWithAD':
      case 'drawContent':
        break;
      default:
        console.log(`${type}-> ${data}`);
    }
    if(typeof res == 'object'){
      if(res.errorMessage){
        if(res.errorMessage.indexOf('火爆') >-1 ){
          $.hotFlag = true
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}

function getPostRequest(url, body, method="POST") {
  let headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-cn",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    "Cookie": cookie,
    "User-Agent": $.UA,
    "X-Requested-With": "XMLHttpRequest"
  }
  if(url.indexOf('https://lzdz1-isv.isvjcloud.com') > -1){
    headers["Referer"] = `https://lzdz1-isv.isvjcloud.com/dingzhi/june/fashionUnion/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`
    headers["Cookie"] = `${lz_jdpin_token_cookie && lz_jdpin_token_cookie || ''}${$.Pin && "AUTH_C_USER=" + $.Pin + ";" || ""}${activityCookie}`
  }
  // console.log(headers)
  // console.log(headers.Cookie)
  return  {url: url, method: method, headers: headers, body: body, timeout:30000};
}

function getCk() {
  return new Promise(resolve => {
    let get = {
      url:`https://lzdz1-isv.isvjcloud.com/dingzhi/june/fashionUnion/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`,
      followRedirect:false,
      headers: {
        "User-Agent": $.UA,
      },
      timeout:30000
    }
    $.get(get, async(err, resp, data) => {
      try {
        if (err) {
          if(resp && typeof resp.statusCode != 'undefined'){
            if(resp.statusCode == 493){
              console.log('此ip已被限制，请过10分钟后再执行脚本\n')
              $.outFlag = true
            }
          }
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} cookie API请求失败，请检查网路重试`)
        } else {
          let end = data.match(/(活动已经结束)/) && data.match(/(活动已经结束)/)[1] || ''
          if(end){
            $.activityEnd = true
            console.log('活动已结束')
          }
          setActivityCookie(resp)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function setActivityCookie(resp){
  let LZ_TOKEN_KEY = ''
  let LZ_TOKEN_VALUE = ''
  let lz_jdpin_token = ''
  let setcookies = resp && resp['headers'] && (resp['headers']['set-cookie'] || resp['headers']['Set-Cookie'] || '') || ''
  let setcookie = ''
  if(setcookies){
    if(typeof setcookies != 'object'){
      setcookie = setcookies.split(',')
    }else setcookie = setcookies
    for (let ck of setcookie) {
      let name = ck.split(";")[0].trim()
      if(name.split("=")[1]){
        // console.log(name.replace(/ /g,''))
        if(name.indexOf('LZ_TOKEN_KEY=')>-1) LZ_TOKEN_KEY = name.replace(/ /g,'')+';'
        if(name.indexOf('LZ_TOKEN_VALUE=')>-1) LZ_TOKEN_VALUE = name.replace(/ /g,'')+';'
        if(name.indexOf('lz_jdpin_token=')>-1) lz_jdpin_token = ''+name.replace(/ /g,'')+';'
      }
    }
  }
  if(LZ_TOKEN_KEY && LZ_TOKEN_VALUE) activityCookie = `${LZ_TOKEN_KEY} ${LZ_TOKEN_VALUE}`
  if(lz_jdpin_token) lz_jdpin_token_cookie = lz_jdpin_token
}

async function getUA(){
  $.UA = `jdapp;iPhone;10.1.4;13.1.2;${randomString(40)};network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}
function randomString(e) {
  e = e || 32;
  let t = "abcdef0123456789", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}

var OＯ0$='jsjiami.com.v6',OＯ0$_=['‮OＯ0$'],O00O=[OＯ0$,'XWPDumJk','LSFnwp3Clg==','wrtWw5DDvMOpw6TDsDckdlAMwoV5wpoqw63DvyfDicOpJXXCvDcHeMK/dcOswqPCqcO3fsKqLcO3PsOgw78twoXDni8EKcKpf8OhMsKew78Aw7I4wroBV3/Cl8OJwrLCrcKewrpHw6I/ZjkrwqHCtjZPwr/CnMO1w4/CjcK7wqNEw6lRwqnDksO1wqjDk0IZ','w5kRw6scw67Dhi/DrCvDiToqMXvCnTzCvcK1w7x4w7kPwrJJw4HCl1Avw77Cmjliw7pAw5NAZMOTESnCs8KODk/CkMKFwrk=','w6jCjjjCtF4=','w7bCkEfDlV4=','wojCjsKMYhs=','ck52wozDsg==','TMKARQZ+','aSNAIcOh','dMOuwpw=','wrooVsK/GQ==','w6HDsgE0ZA==','VTrCvMOFbQ==','w5vCugE=','Ok3Dj8KHSMKww5kTBA==','wpMdw6A=','QsKUP8OY','HG/DlmTCs8OnXyt8w6DDvMK76K2W5rKy5aem6LeF77+T6K2/5qKg5p2957+86LSM6YaN6K6R','wpgYbcKTPg==','w53Co0UYXQ==','VxEJwr/CqA==','w5/DnUB0wr0=','I8Knw446Vw==','XWPDumIb','IwzCnBvCuw==','YgzCm1PCjw==','SnxoNcKjwrQ=','XcK9acObNw==','UAslwr7Cp8OUwos=','dcK8Pg==','5YSs5Lyjwoc=','wroGwrLCpcK3YQ==','w4JewqvChsORfRRyw6dsZ8KKX8ODY0p2bw==','Sm3DnXTChcO8eyQuw4XDosKTw4zClQ==','XQc6ccKkwo3Dhy9hBMKQwrlGFQ==','wqrCp2Apw6tdRcOWUCgewoXCusKbCX1i','wpYcw7MQw7nDjSjDjj3DqTwvO1nDiXbDpw==','w5XCunvDsX1u','G1LCuS/DuWgFw7nCvmvDkMOBKEPDukHDoA==','w5MRNMKQw5zCqxLDvcOzw67Cqn1r','AsK7FXzCisO2','VWbDh3XCksOrSzEvw7PDmcKew4TCvMK+wpPCqw==','wpQEwosrRcKRw6bDiH3DjQpZw6k=','ZWnDuMOjVCA5M1LCjA==','wpkWfsK1JDg=','f0ZaRcOb','LUBnw7w=','DTk0HsKJNMOHwqDDnMOaVRrCisKYwqHDgcONwp3DncK0w4jDijvCm8OzO8KZw5/CiMOlw4E7WMOsEGAjw6paATjDhMK7w5w7PBrCr8OnGsKqwq/CgXYxw7wywrbCh1Qywqpnwo7DsMK7ccOhwocnwqtLI8KCKcO8w4HCmMKYwrMKTmTDgQPCjMOCB8K4bsK3Rxx8wozCvcKlbgBSw5HDvR4cwoDDscKBHB98wrhOw5VPwr/CsXTDl8OJGg7DlsO6w77CkMOEwrbDnybCp8Kfwq3Dm1AxEsOWUsOYGxzDjcO+wq8ZwoXDi8K7VTPCtMKXwqbCpgbDiA==','wqg0G8KQwoQ=','wojDr8OtYhs=','w6BnwpXCp8Ks','wpUewos+RMOOwrrCk2/DtA0Rw60KVzLCgz/DiwFxw5xWPQLDtsOo','wpsneG3DlcOFI8OXLFF7','VsKsA3jDmw==','worDosKmN8OC','EQQlwqXCt3ApXVo=','w7/CjQE0BQ==','w6jCkFnDi0A=','Yl3Dhlk=','PMOaOA==','wowGw7Ucw6XDjzLDnDc=','HlPCqg==','wpDDvVTCjQ==','BnRqBMKCwq8lwrfDiDUxdOiuouazsuWltui0lu+8juivpuahiuacuue+sei0vemHneitug==','dcK8PsKcZMOM','IcOuNznCtw==','asKMH8K1GA==','w5/DnUBqwqM=','wq/CrAnCuRo=','wpYwYWHDmMOU','fAzDpDI=','Fw54QA==','dMOtAcK1','w5Z5cRg=','VVvCvMOF','w6HCjWA0','w7bDr1nCtA==','fHPDpE0=','5reC5Yu65aSh54Gv54q9776s6K6n56qp5ZGr5Ya46K6T','ecOvwrfDkRXDp8OZw4pwCwYCUiM=','w5NfwqrCksOLcQ14w5R7SsKPSMOV','acKbbcKTwq4=','wp12Y8KywrY=','wo3DsCI=','w4zDicKQfMO0NwDDlcK1w4sBw4BAwrfDi8KkFw==','aFrCmG4afRPDgcKNZHDDnMK9TcKUNsK/fsOQwqtSJMKewoBhwpc+MMOJHB3CmSTDtkk=','e8O/wpzDkg7CssKGwrpuBgQQWjRxw7LDg8OUM8KeIMK0Vm/Du8KCKnw=','IcO4w7tjdMOFDMKTw4XDhCFmw7YgUcOpIGF2w6l8wrnCvD7DogRXU8OjIMKRwqjCl2XCq8Onwr3DjcOSM8KtwrQRD8K9w6nCh0p/HiPCgDQDwrXDglfCnnZ+w5xFwrfDlcOXLsOcwrUCURjCvsKhM8Orw4jCt8KIw6jCqGF6wphvR8KyWSY1w7PDksOVB8KWwqnDjC9uGzXDlsObA8KlewY+w6rCjsOUw4gFwrssU8KIw7jDqcK1wrY=','GFPCpCTDnWgYw6nCqEvDrMOJ','G8KQBjI=','GAnDrMKh','bUfDvCA=','YUZEJA==','P8KRNzk=','wqRJKcK/','UsKARRgB','wqgqZMKQwpo=','bVnDvCDCsQ==','wq49w4g6w4Q=','wrYqG8Ovwpo=','w5/Coj90wqM=','wpTDvMK4KcOC','Y8OFA8Oywr0=','YSBlMcKK','wpbDr8OzYhs=','wocywo7CgcOr','w4h5EBjChQ==','w7jCmlZEYw==','YmvChzfDvHo=','w5REwrbCmcOuUhZ5w6xNTMKEXQ==','TcKNOXTCoQ==','VXtgAMKwwqU2wrDCnh0VRBzDlA==','w5lbeMKTIiPCocK2w6sQw6YQw7fCrg==','asK7NsKpd8OdK8KJHlHChsO8L8KZ','wrLDtcKXwr5ZPcKBwrzCs8Ovw7cbVg==','wpUdw64bw53DjTXDnivDiQAn','QFx1wr/CsXgwckfCqcKLwoE=','wrHDnMKeCMKkwpRow6pCw7wow6Y=','wqUaAivCowTCukEgDhBAP07DlBHDqMOlMxIqMQvDg8OsL8Kpw4HCrMO7w75LUh1SOy48w4zDvsKHw71Jw6oYcsOkw6vCmSXCo2LCicKlGsOYwro3Dk7Cg0pEwqZa','KCjDr8OiQycjL3fDisKDb00Pw4A=','w5J4TcOidQ==','GGjDssK/aQ==','fcOFA8Oyw5w=','w6g6wrXCkEE=','VTrCvMOFEg==','ck4XwpLCjQ==','w4/Cq3zDtGIgHhJVMxZlw6rDkcKVJMOowr9fTyLCmw8sfMOeRGwWGsOhZkEFT3IFwpwdck7Co8OoMThywqPDuQE4E8OowodRw7DDgMKPI2UEwqvCnTYrTMO0wqV/wp7CqnfDmAFeJMOgXVbDsQ8fHsOJeCB4wpY=','w58xZ23DnsOOJMOyAEc1wrLCs8KPw5/DiRo7wpdpwoDDhRnCh8OXw5TCl8O2CcK2wowFwqbClsKwfsK5HcO6YMK+w7LChC9jw4HClA==','Q2PDpGJk','w7RYSMKFw6Q=','fHPCmzLDrg==','fzlERcOb','fgANw5Zp','wro2SMOAGQ==','w6BTVA==','wpxzw7XCvA==','wqxaw48f','w7/CjQFL','fAzDpFM=','wpwSw6vDgw==','YT5lMQ==','XWPChR0=','Ym3ChU0=','w5xXwrDClcO0','QcKUJsOew6U=','eMOid8KJbQ==','w6AGw7TCpw==','S0XCvMK6','w7VPD8Kk','wqBXw4fDr8O/wq3CrA==','BcKOBlM=','wpLChlsD','Mz8YwoM=','KyA8csK4','wrbDksKDBcKa','RBlaF8Og','QsOawqfDrQ==','woJtw6vDnQ==','VsKCCMKI','YMO+wovDgRjDu8Oa','XSBa','5YWD5LyJNQ==','w7VTUzzCph4=','asK7NsKpW8ObMsKCDUrCscOkFMKZw7nDj8K9OQ==','W1nCumbCux0Ow7LDjsKRMSJzw5I=','AVTCojrDqm4Cw6TCu1DDkcOUBGs=','Tm3DgGXCjMO6','wrLDncKDA8KAwpR1w7pUw5wUw67CoMO4TzJf','wrvCssKSwq5bLQ==','wpwXbcKVJC/CpMKrw6w7w5oYwrDDmMKKwqwy','MjM9AsKJLA==','PcKxPQbDuxzDgMKxwrFndsKIJhvChwsm','wqENwrXCtcKpcEw6ClXDoWMx','wo0Xw7QAw6fDnA==','Cx4jwqnCq3IzT1DDmcOEw4/CsQskBHc=','TMOSJMKfO8OJA1lGw5vDoADCpw==','wp4Rw7Mcw73DgS/DgwfDnw==','w5t8Qg==','w51ZwqM=','Ths1wq7Co8OAwp0=','wqbCu2Yjw6tyWcOLTSkDwobCrw==','H1nCvjnDqmoT','wrHCrGc5w7VM','XsKQIcOIw6Fh','w5fCq1cPfH4eeg==','a8K2KsKsesOK','LlDDm8Kab8K5w5Ya','LlDDm8KaasK+w4MB','aSNAIQ==','wrYdO0s=','PXPCnAU=','fG3ChTI=','5YeS5LyJ6I6S5b6NKg==','w6dAccKxVTrCvTV0HMOcXcO8Xg==','bcOCfS1Uw7Bcw4JZ','ERU0wqPCt3MMUk3DrsO1w4bCpyQ=','Y8KkHcOs','w5/Coj8V','f1fDhl41Ngw=','X1XCr0I=','wobCmMKuwpQ=','UsO/Wxg=','wqg0esOv','McKtOwzDuzPDnMKswqxma8KLMw==','w4l4YA==','SMOZI8KJKMOLFQ==','w69GZQ==','HMKxAQ==','cMKzEWDCgmk=','wpjChsKwwoo=','CXEHIQ==','wq/DjQnCuQ==','QMKaNQ==','PcOGw5A6','H8KFDsKN','fgANwrc=','wpIIwpUrVMKA','w4hnEAY=','Q2PDunw=','wrHDl8KoFcKawp52w5FKw6sMw6DCoMOG','QsOZJMKpIcODAGJFw7fDoCXCqcOifUnCh8O6dQ==','w4xXK8OeZg==','w5RQw7PDj8O9','w6JMw6s=','w5BpTGo8A14Vw7DCk0HDlMK+aUXDlC0=','wo8RNMKzGGbCrcK3wqQYwpJEw7vCrcOPwroowo0fw4bDmMODwowIKlzCoUNQw6rCoCzDlV9F','Tmd7AMKiw7xtw7bCmxwOTTjDlSpRZ2PCpMKyw47CuHTCgcOOwr9lfg==','YcKaKMOUw6F5MyPDpMKlw7TDqnM7AMKdaEUowp5+wosAKD3Du1wZwpgce8OUwqooNlYWw5wrZ1N5X8KQwrs+MsOwNcKEw7QLw5LCgkjDo8O9X8Oew7kCRBxOU8KdaMKdKMKfZcOIwoIoMcKvw4wuwpJPawI6f8OHwropw44Dwr3DphIRwqE2w6TDg8Khw6jClMK0X8ODCwbDqsOpOcOeQCfDoy/Ds1VFIg1vw74=','PcOYw446SQ==','QsOEwqfCkjI=','bVnDol/Crw==','Mz8Ywp3CiA==','bVnCg1/DkA==','U8KTRmrCvw==','YnPChVPDrg==','wq/Dk3bCuQQ=','XMOEw5jDrSw=','w5DCkcKPacK2cwHDgsKaw4NCwo4H','wqPCuMKIwrVhPMKKwqrCn8O5wpxF','UBDDrynDo2wYw6PCqFXCh8KXeT/CpR7CtjAxSAJfdAwcwqzCocKEw5fCkFtiwok=','S0XDncK6Eg==','XMOaw5jDsyw=','Y8KkYsKNw5w=','wqvDksKFFcKX','UIuHDEjWWsjnRXDDiafmXi.Mcom.v6=='];if(function(_0x36cd6a,_0x4d9566,_0x546309){function _0x49142e(_0x442c77,_0x205602,_0x691113,_0x248066,_0x4d2670,_0x1ad6b1){_0x205602=_0x205602>>0x8,_0x4d2670='po';var _0x1c4f4a='shift',_0x4ae97e='push',_0x1ad6b1='‮';if(_0x205602<_0x442c77){while(--_0x442c77){_0x248066=_0x36cd6a[_0x1c4f4a]();if(_0x205602===_0x442c77&&_0x1ad6b1==='‮'&&_0x1ad6b1['length']===0x1){_0x205602=_0x248066,_0x691113=_0x36cd6a[_0x4d2670+'p']();}else if(_0x205602&&_0x691113['replace'](/[UIuHDEWWnRXDDfXM=]/g,'')===_0x205602){_0x36cd6a[_0x4ae97e](_0x248066);}}_0x36cd6a[_0x4ae97e](_0x36cd6a[_0x1c4f4a]());}return 0xee359;};return _0x49142e(++_0x4d9566,_0x546309)>>_0x4d9566^_0x546309;}(O00O,0x13b,0x13b00),O00O){OＯ0$_=O00O['length']^0x13b;};function O0QQ(_0x84c5b0,_0x233c67){_0x84c5b0=~~'0x'['concat'](_0x84c5b0['slice'](0x1));var _0x4500e4=O00O[_0x84c5b0];if(O0QQ['QOOQ0O']===undefined){(function(){var _0x5a4201=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x3677ee='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x5a4201['atob']||(_0x5a4201['atob']=function(_0xae9dac){var _0x4ee905=String(_0xae9dac)['replace'](/=+$/,'');for(var _0x18a7f9=0x0,_0x48a9fc,_0x68f5d8,_0x17a6bf=0x0,_0x3eec67='';_0x68f5d8=_0x4ee905['charAt'](_0x17a6bf++);~_0x68f5d8&&(_0x48a9fc=_0x18a7f9%0x4?_0x48a9fc*0x40+_0x68f5d8:_0x68f5d8,_0x18a7f9++%0x4)?_0x3eec67+=String['fromCharCode'](0xff&_0x48a9fc>>(-0x2*_0x18a7f9&0x6)):0x0){_0x68f5d8=_0x3677ee['indexOf'](_0x68f5d8);}return _0x3eec67;});}());function _0x19623e(_0x2005ed,_0x233c67){var _0x267b07=[],_0x14c2fd=0x0,_0x1ab32f,_0x5ef107='',_0x3baee8='';_0x2005ed=atob(_0x2005ed);for(var _0xf9ef16=0x0,_0x4eec4e=_0x2005ed['length'];_0xf9ef16<_0x4eec4e;_0xf9ef16++){_0x3baee8+='%'+('00'+_0x2005ed['charCodeAt'](_0xf9ef16)['toString'](0x10))['slice'](-0x2);}_0x2005ed=decodeURIComponent(_0x3baee8);for(var _0x36ee68=0x0;_0x36ee68<0x100;_0x36ee68++){_0x267b07[_0x36ee68]=_0x36ee68;}for(_0x36ee68=0x0;_0x36ee68<0x100;_0x36ee68++){_0x14c2fd=(_0x14c2fd+_0x267b07[_0x36ee68]+_0x233c67['charCodeAt'](_0x36ee68%_0x233c67['length']))%0x100;_0x1ab32f=_0x267b07[_0x36ee68];_0x267b07[_0x36ee68]=_0x267b07[_0x14c2fd];_0x267b07[_0x14c2fd]=_0x1ab32f;}_0x36ee68=0x0;_0x14c2fd=0x0;for(var _0x3eef00=0x0;_0x3eef00<_0x2005ed['length'];_0x3eef00++){_0x36ee68=(_0x36ee68+0x1)%0x100;_0x14c2fd=(_0x14c2fd+_0x267b07[_0x36ee68])%0x100;_0x1ab32f=_0x267b07[_0x36ee68];_0x267b07[_0x36ee68]=_0x267b07[_0x14c2fd];_0x267b07[_0x14c2fd]=_0x1ab32f;_0x5ef107+=String['fromCharCode'](_0x2005ed['charCodeAt'](_0x3eef00)^_0x267b07[(_0x267b07[_0x36ee68]+_0x267b07[_0x14c2fd])%0x100]);}return _0x5ef107;}O0QQ['QOO000']=_0x19623e;O0QQ['O00O00']={};O0QQ['QOOQ0O']=!![];}var _0x8ec640=O0QQ['O00O00'][_0x84c5b0];if(_0x8ec640===undefined){if(O0QQ['O00OQO']===undefined){O0QQ['O00OQO']=!![];}_0x4500e4=O0QQ['QOO000'](_0x4500e4,_0x233c67);O0QQ['O00O00'][_0x84c5b0]=_0x4500e4;}else{_0x4500e4=_0x8ec640;}return _0x4500e4;};async function joinShop(){var OQQ0Q={'OOOQ':function(OOQOO){return OOQOO();},'Q0QO':function(OQ000,OQQQQ){return OQ000(OQQQQ);},'QOO0':function(OQQ0O,OQQQO){return OQQ0O==OQQQO;},'Q0QQ':O0QQ('‫0','oxbZ'),'OOQ0':function(OQ0Q0,Q000Q){return OQ0Q0!==Q000Q;},'Q00O':O0QQ('‮1','urqp'),'O0QO0':function(Q00QQ,Q000O){return Q00QQ===Q000O;},'QOOOQ':function(Q0OO0,O0OOO){return Q0OO0!==O0OOO;},'QQO0Q':O0QQ('‫2','$tN8'),'QOOOO':O0QQ('‮3','xwtR'),'OO00Q':O0QQ('‫4','hj(H'),'OO0QQ':function(O00QQ,O000O){return O00QQ==O000O;},'OOOO0':O0QQ('‫5','7uo$'),'OO00O':O0QQ('‫6','m!E]'),'OQO00':O0QQ('‫7','L8UR'),'OQOQ0':function(O00QO,QQQ0Q){return O00QO!==QQQ0Q;},'OO0QO':O0QQ('‫8','urqp'),'QQOQQ':O0QQ('‮9','oxbZ'),'QQO0O':O0QQ('‫a','@@Y*'),'QQOQO':O0QQ('‮b','TG]c'),'Q0QOQ':O0QQ('‮c','n]v]'),'Q00O0':function(QOQOO,QO0O0,QQQQQ){return QOQOO(QO0O0,QQQQQ);},'Q0QOO':O0QQ('‮d','u1(Y'),'QQQO0':function(QQ000,QQQ0O){return QQ000(QQQ0O);},'QOOQ0':O0QQ('‮e','L8UR'),'QOO00':O0QQ('‫f','OG(b'),'OOQ0Q':O0QQ('‮10','%eSV'),'OO000':O0QQ('‮11','@@Y*'),'OOQ0O':O0QQ('‮12','Xu1c')};if(!$[O0QQ('‫13','z@)y')])return;return new Promise(async OOQO0=>{var OQ0OQ={'QQQ0':function(QOQOQ){return OQQ0Q[O0QQ('‮14','uj&T')](QOQOQ);},'OQQ0':function(OQ0OO,OQQ00){return OQQ0Q[O0QQ('‫15','dOTP')](OQ0OO,OQQ00);},'Q00Q':function(OQQQ0,QQQQO){return OQQ0Q[O0QQ('‫16','Em8L')](OQQQ0,QQQQO);},'OO00':OQQ0Q[O0QQ('‮17','72]9')],'O0OO':function(QQ0Q0,Q0OOO){return OQQ0Q[O0QQ('‮18','a%uR')](QQ0Q0,Q0OOO);},'OQ00':OQQ0Q[O0QQ('‮19','hSZ7')],'O0OQ':function(Q0OOQ,O000Q){return OQQ0Q[O0QQ('‫1a','0ie1')](Q0OOQ,O000Q);},'QQO0':function(O0OO0,O0000){return OQQ0Q[O0QQ('‫1b','F)Rc')](O0OO0,O0000);},'QOOO':OQQ0Q[O0QQ('‫1c','Em8L')],'OO0O':OQQ0Q[O0QQ('‫1d','SEbb')],'OOQO':OQQ0Q[O0QQ('‫1e','F)Rc')],'OQOQ':function(O0QQQ,O0Q0Q){return OQQ0Q[O0QQ('‮1f','3SMd')](O0QQQ,O0Q0Q);},'OOOO':OQQ0Q[O0QQ('‮20','8^qf')],'QQQQ':function(O00Q0,Q0OQ0){return OQQ0Q[O0QQ('‫21','McKN')](O00Q0,Q0OQ0);},'O0O0':OQQ0Q[O0QQ('‫22','Dl2B')],'QQ0Q':OQQ0Q[O0QQ('‮23','vM!b')]};if(OQQ0Q[O0QQ('‮24','$daz')](OQQ0Q[O0QQ('‫25','hj(H')],OQQ0Q[O0QQ('‫26','S(bW')])){$[O0QQ('‮27','&03Q')](e,resp);}else{$[O0QQ('‫28','TG]c')]=OQQ0Q[O0QQ('‫29','EwF!')];let QOQQ0='';if($[O0QQ('‮2a','s%A4')])QOQQ0=O0QQ('‫2b','hSZ7')+$[O0QQ('‮2c','h0pm')];const QOQ00=O0QQ('‫2d','8DYQ')+$[O0QQ('‫2e','SEbb')]+O0QQ('‫2f','VBZ]')+$[O0QQ('‫30','8^qf')]+O0QQ('‫31','hj(H')+QOQQ0+O0QQ('‫32','7uo$');const QQ00Q={'appid':OQQ0Q[O0QQ('‫33','x[cQ')],'functionId':OQQ0Q[O0QQ('‮34','dOTP')],'clientVersion':OQQ0Q[O0QQ('‫35','McKN')],'client':'H5','body':JSON[O0QQ('‫36','[1Uj')](QOQ00)};const QQOO0=await OQQ0Q[O0QQ('‫37','7uo$')](getH5st,OQQ0Q[O0QQ('‮38','Wg%m')],QQ00Q);const QQ0QQ={'url':O0QQ('‫39','L8UR')+QOQ00+O0QQ('‮3a','oxbZ')+OQQ0Q[O0QQ('‮3b','%eSV')](encodeURIComponent,QQOO0),'headers':{'accept':OQQ0Q[O0QQ('‮3c','u1(Y')],'accept-encoding':OQQ0Q[O0QQ('‫3d','urqp')],'accept-language':OQQ0Q[O0QQ('‫3e','72]9')],'cookie':cookie,'origin':OQQ0Q[O0QQ('‫3f','phtI')],'user-agent':OQQ0Q[O0QQ('‫40','hSZ7')]}};$[O0QQ('‮41','hj(H')](QQ0QQ,async(OOO0Q,QO0OQ,OQQOQ)=>{var OQQOO={'OQQO':function(OOO0O,OQ0O0){return OQ0OQ[O0QQ('‮42','4Cl$')](OOO0O,OQ0O0);},'QQOO':function(OOOQQ,OOOQO){return OQ0OQ[O0QQ('‮43','YFnu')](OOOQQ,OOOQO);},'QOOQ':OQ0OQ[O0QQ('‮44','m!E]')],'OQQQ':function(QQ0QO,QQ00O){return OQ0OQ[O0QQ('‫45','urqp')](QQ0QO,QQ00O);}};try{if(OQ0OQ[O0QQ('‫46','4Cl$')](OQ0OQ[O0QQ('‫47','Dl2B')],OQ0OQ[O0QQ('‫48','%eSV')])){OQQOO[O0QQ('‫49','urqp')](OOQO0,OQQOQ);}else{OQQOQ=OQQOQ&&OQQOQ[O0QQ('‫4a','TG]c')](/jsonp_.*?\((.*?)\);/)&&OQQOQ[O0QQ('‫4b','McKN')](/jsonp_.*?\((.*?)\);/)[0x1]||OQQOQ;let O0QQO=$[O0QQ('‮4c','!1JJ')](OQQOQ,OQQOQ);if(O0QQO&&OQ0OQ[O0QQ('‮4d','TG]c')](typeof O0QQO,OQ0OQ[O0QQ('‫4e','7uo$')])){if(O0QQO&&OQ0OQ[O0QQ('‮4f','Mk@s')](O0QQO[O0QQ('‮50','4Cl$')],!![])){if(OQ0OQ[O0QQ('‮51','uj&T')](OQ0OQ[O0QQ('‮52',']uIN')],OQ0OQ[O0QQ('‫53','VBZ]')])){OQQOQ=OQQOQ&&OQQOQ[O0QQ('‫54','$tN8')](/jsonp_.*?\((.*?)\);/)&&OQQOQ[O0QQ('‮55','8^qf')](/jsonp_.*?\((.*?)\);/)[0x1]||OQQOQ;let QQ00=$[O0QQ('‮56','72]9')](OQQOQ,OQQOQ);if(QQ00&&OQQOO[O0QQ('‮57','@@Y*')](typeof QQ00,OQQOO[O0QQ('‫58','4Cl$')])){if(QQ00&&OQQOO[O0QQ('‮59','h0pm')](QQ00[O0QQ('‮5a','@@Y*')],!![])){console[O0QQ('‮5b','phtI')](O0QQ('‫5c','s%A4')+(QQ00[O0QQ('‫5d','hj(H')][O0QQ('‫5e','h0pm')][O0QQ('‫5f','urqp')]||''));$[O0QQ('‫60','z@)y')]=QQ00[O0QQ('‫61','Em8L')][O0QQ('‮62','8^qf')]&&QQ00[O0QQ('‮63','8DYQ')][O0QQ('‮64','hSZ7')][0x0]&&QQ00[O0QQ('‮65','X4Ux')][O0QQ('‮66','uj&T')][0x0][O0QQ('‮67','$daz')]&&QQ00[O0QQ('‫68','SEbb')][O0QQ('‫69','VBZ]')][0x0][O0QQ('‫6a','xwtR')][O0QQ('‮6b','SEbb')]||'';}}else{console[O0QQ('‫6c','Kc67')](OQQOQ);}}else{console[O0QQ('‮6d','TG]c')](O0QQO[O0QQ('‮6e','Wg%m')]);$[O0QQ('‫6f',']uIN')]=O0QQO[O0QQ('‮70','z@)y')];if(O0QQO[O0QQ('‫71',']uIN')]&&O0QQO[O0QQ('‫72','McKN')][O0QQ('‫73','m!E]')]){for(let O0Q00 of O0QQO[O0QQ('‮74','h0pm')][O0QQ('‮75','dOTP')][O0QQ('‮76','dOTP')]){if(OQ0OQ[O0QQ('‮77','s%A4')](OQ0OQ[O0QQ('‫78','oxbZ')],OQ0OQ[O0QQ('‫79','z@)y')])){OQ0OQ[O0QQ('‫7a','urqp')](OOQO0);}else{console[O0QQ('‮6d','TG]c')](O0QQ('‮7b','Kc67')+O0Q00[O0QQ('‮7c','x[cQ')]+O0Q00[O0QQ('‫7d','0ie1')]+O0Q00[O0QQ('‮7e','VBZ]')]);}}}}}else if(O0QQO&&OQ0OQ[O0QQ('‫7f','McKN')](typeof O0QQO,OQ0OQ[O0QQ('‫80','3SMd')])&&O0QQO[O0QQ('‫81','%eSV')]){if(OQ0OQ[O0QQ('‮82','&03Q')](OQ0OQ[O0QQ('‮83','8DYQ')],OQ0OQ[O0QQ('‮84','0ie1')])){OQ0OQ[O0QQ('‮85','F)Rc')](OOQO0);}else{$[O0QQ('‫86','uj&T')]=O0QQO[O0QQ('‮70','z@)y')];console[O0QQ('‮87','u1(Y')](''+(O0QQO[O0QQ('‫88','xwtR')]||''));}}else{console[O0QQ('‫89','x[cQ')](OQQOQ);}}else{console[O0QQ('‮8a','a%uR')](OQQOQ);}}}catch(QO000){$[O0QQ('‮8b','EwF!')](QO000,QO0OQ);}finally{if(OQ0OQ[O0QQ('‫8c','8DYQ')](OQ0OQ[O0QQ('‫8d','$tN8')],OQ0OQ[O0QQ('‫8e','pK2&')])){console[O0QQ('‮8f','McKN')](OQQOQ);}else{OQ0OQ[O0QQ('‮90','Xu1c')](OOQO0);}}});}});}async function getshopactivityId(){var QOQQQ={'QOO0Q':function(QQOOQ,QO0Q0){return QQOOQ===QO0Q0;},'QOO0O':O0QQ('‮91','n]v]'),'QQQOO':O0QQ('‫92','phtI'),'QOOQQ':function(QOQQO,QOQ0Q){return QOQQO==QOQ0Q;},'QQ0O0':O0QQ('‮93','YFnu'),'OO0OO':O0QQ('‮94','hj(H'),'OOQQ0':O0QQ('‮95','%eSV'),'OO0OQ':function(OQQO0){return OQQO0();},'OOQ00':O0QQ('‫96','8^qf'),'OQ0QQ':O0QQ('‮97','xwtR'),'OQ00Q':O0QQ('‫98','hSZ7'),'OQOO0':function(OOOQ0,OOO00,QQOOO){return OOOQ0(OOO00,QQOOO);},'OQ0QO':O0QQ('‫99','TG]c'),'OQ00O':function(Q0OQQ,Q0O0Q){return Q0OQQ(Q0O0Q);},'QOOQO':O0QQ('‫9a','$daz'),'Q0000':O0QQ('‫9b','Kc67'),'Q00Q0':O0QQ('‫9c','hSZ7'),'Q0QQO':O0QQ('‮9d','s%A4'),'O0OQ0':O0QQ('‫9e','McKN')};return new Promise(async O00OQ=>{var O0QQ0={'OQOOO':function(O0QOO,O0QOQ){return QOQQQ[O0QQ('‫9f','Xu1c')](O0QOO,O0QOQ);},'Q00OQ':QOQQQ[O0QQ('‮a0','@@Y*')],'Q00OO':QOQQQ[O0QQ('‮a1','Em8L')],'O0OQO':function(QO0QQ,QOOO0){return QOQQQ[O0QQ('‮a2','VBZ]')](QO0QQ,QOOO0);},'O0O0O':QOQQQ[O0QQ('‫a3','Em8L')],'Q0QQ0':QOQQQ[O0QQ('‮a4','EwF!')],'O0OQQ':QOQQQ[O0QQ('‮a5','urqp')],'Q0Q00':function(QO00Q,QO0QO){return QOQQQ[O0QQ('‮a6','pK2&')](QO00Q,QO0QO);},'O0O0Q':function(QO00O){return QOQQQ[O0QQ('‫a7','@@Y*')](QO00O);}};let OOOOQ=O0QQ('‮a8','OG(b')+$[O0QQ('‫a9','8DYQ')]+O0QQ('‮aa','z@)y');const OOOOO={'appid':QOQQQ[O0QQ('‮ab','7uo$')],'functionId':QOQQQ[O0QQ('‫ac','@@Y*')],'clientVersion':QOQQQ[O0QQ('‮ad','McKN')],'client':'H5','body':JSON[O0QQ('‮ae','8^qf')](OOOOQ)};const OQO0Q=await QOQQQ[O0QQ('‫af','%eSV')](getH5st,QOQQQ[O0QQ('‫b0','VBZ]')],OOOOO);const OQOQQ={'url':O0QQ('‮b1','4Cl$')+OOOOQ+O0QQ('‮b2','SEbb')+QOQQQ[O0QQ('‮b3','L8UR')](encodeURIComponent,OQO0Q),'headers':{'accept':QOQQQ[O0QQ('‮b4','L8UR')],'accept-encoding':QOQQQ[O0QQ('‫b5','vM!b')],'accept-language':QOQQQ[O0QQ('‮b6','Wg%m')],'cookie':cookie,'origin':QOQQQ[O0QQ('‫b7','0ie1')],'user-agent':QOQQQ[O0QQ('‫b8','s%A4')]}};$[O0QQ('‫b9','@@Y*')](OQOQQ,async(OQO0O,QQO00,OQOQO)=>{try{if(O0QQ0[O0QQ('‮ba','hSZ7')](O0QQ0[O0QQ('‫bb','m!E]')],O0QQ0[O0QQ('‮bc','7uo$')])){if(OQO0O){console[O0QQ('‮bd','S(bW')](JSON[O0QQ('‮be','dOTP')](OQO0O));console[O0QQ('‮bf','SEbb')]($[O0QQ('‮c0','McKN')]+O0QQ('‮c1','Em8L'));}else{}}else{OQOQO=OQOQO&&OQOQO[O0QQ('‮c2','hSZ7')](/jsonp_.*?\((.*?)\);/)&&OQOQO[O0QQ('‫c3','m!E]')](/jsonp_.*?\((.*?)\);/)[0x1]||OQOQO;let Q0QO0=$[O0QQ('‫c4','Wg%m')](OQOQO,OQOQO);if(Q0QO0&&O0QQ0[O0QQ('‮c5','3SMd')](typeof Q0QO0,O0QQ0[O0QQ('‮c6','Xu1c')])){if(O0QQ0[O0QQ('‮c7','%eSV')](O0QQ0[O0QQ('‫c8','z@)y')],O0QQ0[O0QQ('‫c9','urqp')])){$[O0QQ('‫ca','s%A4')](e,QQO00);}else{if(Q0QO0&&O0QQ0[O0QQ('‫cb','!1JJ')](Q0QO0[O0QQ('‮cc','Wg%m')],!![])){console[O0QQ('‫cd','h0pm')](O0QQ('‮ce','dOTP')+(Q0QO0[O0QQ('‮cf','$daz')][O0QQ('‮d0','TG]c')][O0QQ('‮d1','Em8L')]||''));$[O0QQ('‫d2','Dl2B')]=Q0QO0[O0QQ('‫71',']uIN')][O0QQ('‫d3',']uIN')]&&Q0QO0[O0QQ('‮74','h0pm')][O0QQ('‫d4','SEbb')][0x0]&&Q0QO0[O0QQ('‮d5','L8UR')][O0QQ('‫d6','z@)y')][0x0][O0QQ('‮d7','Mk@s')]&&Q0QO0[O0QQ('‫d8','a%uR')][O0QQ('‮d9','Em8L')][0x0][O0QQ('‮da','YFnu')][O0QQ('‫db','7uo$')]||'';}}}else{console[O0QQ('‮6d','TG]c')](OQOQO);}}}catch(O0Q0QO){$[O0QQ('‮dc','hSZ7')](O0Q0QO,QQO00);}finally{O0QQ0[O0QQ('‫dd','72]9')](O00OQ);}});});}function getH5st(O0Q00O,O00OOQ){var QOO00O={'QQ0OO':function(QOO0QQ,QOOOO0){return QOO0QQ!==QOOOO0;},'QQQ00':O0QQ('‫de','VBZ]'),'QQQQ0':function(O00OOO,QOO0QO){return O00OOO(QOO0QO);},'OO0O0':O0QQ('‮df','X4Ux'),'OOQOQ':function(QQQO0Q,QQQOQQ){return QQQO0Q*QQQOQQ;}};return new Promise(async QQQO0O=>{var QQQOQO={'Q0Q0Q':function(O00OQ0,QOOQQQ){return QOO00O[O0QQ('‫e0','F)Rc')](O00OQ0,QOOQQQ);},'O0OOQ':QOO00O[O0QQ('‫e1','vM!b')],'Q00QO':function(QOOQ0Q,O0QQQQ){return QOO00O[O0QQ('‫e2','TG]c')](QOOQ0Q,O0QQQQ);}};let O0Q000={'url':O0QQ('‫e3','YFnu'),'body':O0QQ('‮e4','oxbZ')+O0Q00O+O0QQ('‮e5','a%uR')+QOO00O[O0QQ('‫e6','8^qf')](encodeURIComponent,JSON[O0QQ('‮e7','VBZ]')](O00OOQ)),'headers':{'User-Agent':QOO00O[O0QQ('‫e8','m!E]')]},'timeout':QOO00O[O0QQ('‮e9','L8UR')](0x1e,0x3e8)};$[O0QQ('‫ea','%eSV')](O0Q000,(O0QQ0O,O0QQ0Q,O0QOOO)=>{try{if(O0QQ0O){console[O0QQ('‮eb','n]v]')](JSON[O0QQ('‫ec','SEbb')](O0QQ0O));console[O0QQ('‫ed','z@)y')]($[O0QQ('‮ee','pK2&')]+O0QQ('‮ef','s%A4'));}else{}}catch(QOO0Q0){$[O0QQ('‮f0','h0pm')](QOO0Q0,O0QQ0Q);}finally{if(QQQOQO[O0QQ('‮f1','a%uR')](QQQOQO[O0QQ('‫f2','xwtR')],QQQOQO[O0QQ('‫f3','3SMd')])){console[O0QQ('‮6d','TG]c')](O0QOOO);}else{QQQOQO[O0QQ('‫f4','pK2&')](QQQO0O,O0QOOO);}}});});};OＯ0$='jsjiami.com.v6';

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

