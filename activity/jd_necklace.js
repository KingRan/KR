/*
点点券，可以兑换无门槛红包（1元，5元，10元，100元，部分红包需抢购）
Last Modified time: 2021-07-23 10:27
活动入口：京东APP-领券中心/券后9.9-领点点券 [活动地址](https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html)
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
cron "20 0-20/4 * * *" jd_necklace.js
 */
const $ = new Env('点点券');
let allMessage = ``;
const notify = $.isNode() ? require('./sendNotify') : '';
const zooFaker = require('./utils/ZooFaker_Necklace').utils;
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const openUrl = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html%22%20%7D`
let message = '', joyToken = '', UA = '', uuid = '';
let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000);
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', hasSend = false;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = 'https://api.m.jd.com/api';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      await getToken();
      cookie = cookiesArr[i] + `joyytoken=50082${joyToken};`;
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n*******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      UA = `jdapp;iPhone;10.0.8;14.4.2;${randomString()};network/wifi;ADID/3F74A88A-71D3-404B-BBDF-8C0575E680EC;model/iPhone10,2;addressid/4091160336;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
      uuid = UA.split(';') && UA.split(';')[4] || ''
      await jd_necklace();
    }
  }
  if ($.isNode() && allMessage) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`, { url: openUrl })
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jd_necklace() {
  try {
    await necklace_homePage();
    await $.wait(2000)
    await doTask();
    await $.wait(2000)
    await sign();
    await $.wait(2000)
    await necklace_homePage();
    await $.wait(2000)
    await receiveBubbles();
    await $.wait(2000)
    await necklace_homePage();
    await $.wait(2000)
    if (formatInt($.totalScore)) {
      if (new Date().getDate() === 20 && (new Date().getMonth() + 1 === 6)) {
        //2021-06-21凌晨0点，点点券将要全部清零处理，故全部兑换
        await $.wait(2000)
        await necklace_exchangeGift(formatInt($.totalScore));//自动兑换多少钱的无门槛红包，1000代表1元，默认兑换全部点点券
      }
    }
    await showMsg();
  } catch (e) {
    $.logErr(e)
  }
}
function showMsg() {
  return new Promise(async resolve => {
    if (nowTimes.getHours() >= 20) {
      $.msg($.name, '', `京东账号${$.index} ${$.nickName || $.UserName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n点击弹窗即可去兑换(注：此红包具有时效性)`, { 'open-url': openUrl});
    }
    // 云端大于10元无门槛红包时进行通知推送
    // if ($.isNode() && $.totalScore >= 20000 && nowTimes.getHours() >= 20) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `京东账号${$.index} ${$.nickName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n点击链接即可去兑换(注：此红包具有时效性)\n↓↓↓ \n\n ${openUrl} \n\n ↑↑↑`, { url: openUrl })
    if ($.isNode() && nowTimes.getHours() >= 20 && (process.env.DDQ_NOTIFY_CONTROL ? process.env.DDQ_NOTIFY_CONTROL === 'false' : !!1)) {
      allMessage += `京东账号${$.index} ${$.nickName || $.UserName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n(京东APP->领券->左上角点点券.注：此红包具有时效性)${$.index !== cookiesArr.length ? '\n\n' : `\n\n↓↓↓ \n https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html \n\n ↑↑↑\n\n点点券将在每年 6月21日和11月14日 00:00 清空，请注意兑换`}`
    }
    resolve()
  })
}
async function doTask() {
  for (let item of $.taskConfigVos) {
    if (item.taskStage === 0) {
      console.log(`\n【${item.taskName}】 任务未领取,开始领取此任务`);
      const res = await necklace_startTask(item.id);
      await $.wait(2000);
      if (res && res.rtn_code !== 0) continue
      console.log(`【${item.taskName}】 任务领取成功,开始完成此任务`);
      await $.wait(2000);
      await reportTask(item);
      await $.wait(2000);
    } else if (item.taskStage === 2) {
      console.log(`【${item.taskName}】 任务已做完,奖励未领取`);
    } else if (item.taskStage === 3) {
      console.log(`${item.taskName}奖励已领取`);
    } else if (item.taskStage === 1) {
      console.log(`\n【${item.taskName}】 任务已领取但未完成,开始完成此任务`);
      await reportTask(item);
      await $.wait(2000);
    }
  }
}
async function receiveBubbles() {
  if ($.bubbles && $.bubbles.length) {
    console.log(`\n开始领取点点券`);
    for (let item of $.bubbles) {
      if (!item.id) continue;
      await necklace_chargeScores(item.id);
      await $.wait(2000)
    }
  } else {
    console.log(`\n当前暂无可领取点点券`);
  }
}
async function sign() {
  if ($.signInfo && $.signInfo.todayCurrentSceneSignStatus) {
    if ($.signInfo.todayCurrentSceneSignStatus === 1) {
      console.log(`\n开始每日签到`)
      await necklace_sign();
    } else {
      console.log(`已签到\n`)
    }
  } else {
    console.log(`未获取到签到信息\n`)
  }
}
async function reportTask(item = {}) {
  //普通任务
  if (item['taskType'] === 2) await necklace_startTask(item.id, 'necklace_reportTask');
  //逛很多商品店铺等等任务
  if (item['taskType'] === 6 || item['taskType'] === 8 || item['taskType'] === 5 || item['taskType'] === 9) {
    //浏览精选活动任务
    await necklace_getTask(item.id);
    $.taskItems = $.taskItems.filter(value => !!value && value['status'] === 0);
    for (let vo of $.taskItems) {
      console.log(`浏览精选活动 【${vo['title']}】`);
      await necklace_startTask(item.id, 'necklace_reportTask', vo['id']);
    }
  }
  //首页浏览XX秒的任务
  if (item['taskType'] === 3) await doAppTask('3', item.id);
  if (item['taskType'] === 4) await doAppTask('4', item.id);
}

/**
 * 将数字取整为10的倍数
 * @param {Number} num 需要取整的值
 * @param {Boolean} ceil 是否向上取整
 * @param {Number} prec 需要用0占位的数量
 */
function formatInt(num, prec = 1, ceil = false) {
  const len = String(num).length;
  if (len <= prec) { return num }
  const mult = Math.pow(10, prec);
  return ceil ? Math.ceil(num / mult) * mult : Math.floor(num / mult) * mult;
}
//每日签到福利
function necklace_sign() {
  return new Promise(async resolve => {
    const body = await zooFaker.getBody({ 'cookie': cookie, 'action': 'sign', 'joyToken': joyToken, 'uuid': uuid });
    $.post(taskPostUrl("necklace_sign", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                console.log(`签到成功，时间：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()}`)
                // $.taskConfigVos = data.data.result.taskConfigVos;
                // $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs;
              }
            } else if (data.rtn_code === 403) {
              console.log(`每日签到失败：活动太火爆了,还是去买买买吧~\n`);
            } else {
              console.log(`每日签到失败：${JSON.stringify(data)}\n`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
//兑换无门槛红包
function necklace_exchangeGift(scoreNums) {
  return new Promise(async resolve => {
    const body = await zooFaker.getBody({ 'cookie': cookie, 'action': 'exchangeGift', 'id': scoreNums, 'joyToken': joyToken, 'uuid': uuid });
    console.log(`\n使用${scoreNums}个点点券兑换${scoreNums / 1000}元无门槛红包`);
    $.post(taskPostUrl("necklace_exchangeGift", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                const { result } = data.data;
                message += `${result.redpacketTitle}：${result.redpacketAmount}元兑换成功\n`;
                message += `红包有效期：${new Date(result.endTime + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString('zh', {hour12: false})}`;
                console.log(message)
                if ($.isNode()) await notify.sendNotify($.name, message);
              }
            } else {
              console.log(`兑换失败：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
//领取奖励
function necklace_chargeScores(bubleId) {
  return new Promise(async resolve => {
    const body = await zooFaker.getBody({ 'cookie': cookie, 'action': 'chargeScores', 'id': bubleId, 'giftConfigId': $.giftConfigId, 'joyToken': joyToken, 'uuid': uuid });
    $.post(taskPostUrl("necklace_chargeScores", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(`领取点点券结果`, data);
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                console.log(`点点券领取成功,获得${data.data.result.giftScoreNum},当前共有${data.data.result.totalScoreNum}\n`)
                // $.giftScoreNum = data.data.result.giftScoreNum;
                $.totalScore = data.data.result.totalScoreNum;
              }
            } else {
              console.log(`领取点点券失败：${JSON.stringify(data)}\n`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function necklace_startTask(taskId, functionId = 'necklace_startTask', itemId = "") {
  return new Promise(async resolve => {
    let body = {
      taskId,
      currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
    }
    if (functionId === 'necklace_startTask') {
      body = await zooFaker.getBody({ 'id': taskId, 'cookie': cookie, 'action': 'startTask', 'joyToken': joyToken, 'uuid': uuid })
    }
    if (itemId && functionId === 'necklace_reportTask') body['itemId'] = itemId;
    $.post(taskPostUrl(functionId, body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                // $.taskConfigVos = data.data.result.taskConfigVos;
                // $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs;
              }
            } else if (data.rtn_code === 403) {
              console.log(`${functionId === 'necklace_startTask' ? '领取任务失败' : '做任务失败'}：活动太火爆了,还是去买买买吧~\n`);
            } else {
              console.log(`${functionId === 'necklace_startTask' ? '领取任务失败' : '做任务失败'}：${JSON.stringify(data)}\n`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function necklace_getTask(taskId) {
  return new Promise(resolve => {
    const body = {
      taskId,
      currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
    }
    $.taskItems = [];
    $.post(taskPostUrl("necklace_getTask", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                $.taskItems = data.data.result && data.data.result.taskItems;
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function necklace_homePage() {
  $.taskConfigVos = [];
  $.bubbles = [];
  $.signInfo = {};
  return new Promise(resolve => {
    $.post(taskPostUrl('necklace_homePage'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                $.taskConfigVos = data.data.result.taskConfigVos;
                $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs || [];
                $.lastRequestTime = data.data.result.lastRequestTime;
                $.bubbles = data.data.result.bubbles;
                $.signInfo = data.data.result.signInfo || {};
                $.totalScore = data.data.result.totalScore;
                const config = $.exchangeGiftConfigs.filter(item => item['giftType'] === 1);
                if (config && config[0]) {
                  $.giftConfigId = config[0]['id'];
                  console.log(`点点券兑换无门槛红包ID为：${$.giftConfigId}`);
                }
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

async function doAppTask(type = '3', id) {
  let functionId = ``
  let body = `area=1_2953_54044_0&body=%7B%22pageClickKey%22%3A%22CouponCenter%22%2C%22shshshfpb%22%3A%22xMvLenI90G5fXNwdmMLrZ9zcRvSKKKrp3twx2gniQsgkav01VHSjwfaIlRQEYYJ4lUh7i6BmZXDIqLmrcpFgFPw%3D%3D%22%2C%22eid%22%3A%22eidI10a1812352s2f8fFJhaZRAaygJavMzzPuH%5C/HxpE9QzhNJ2Cf5aWxpC%2Bi2hshw7jujEFX%5C/JQtTGYOL2wlDjPaiPMK0KbiFPDza4sbsufvPStkf1tM%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22lat%22%3A%2240.18191448804161%22%2C%22globalLat%22%3A%2240.18993%22%2C%22lng%22%3A%22117.0065653831892%22%2C%22globalLng%22%3A%22117.010071%22%7D&build=167741&client=apple&clientVersion=10.0.8&d_brand=apple&d_model=iPhone10%2C2&eid=eidI10a1812352s2f8fFJhaZRAaygJavMzzPuH/HxpE9QzhNJ2Cf5aWxpC%2Bi2hshw7jujEFX/JQtTGYOL2wlDjPaiPMK0KbiFPDza4sbsufvPStkf1tM&isBackground=N&joycious=95&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8548106a862f1fe7b4b84d3a16f7ffdcf47390de&osVersion=14.4.2&partner=apple&rfs=0000&scope=01&screen=1242%2A2208&sign=2c33f9e1230505e54632d18706b99d5c&st=1627058018278&sv=100&uemps=0-0&uts=0f31TVRjBStnWyWKh4kj%2BvuskvWGi54eyJH5cLJVT6QoOtzNpjyhH/ToU5X7LhKoleMMycwNk8t28%2BJhe0WWPZLkED4dnpAJv9MsudkLTd%2BKR8CJOEgC4PH/IFRT8y51lwtUBXR26fHwsk4aYqBSg0uiALvjv09TMPXJwxQIQ6gEdaaN2v%2B2PBvm1Obp5Nr0RMweFYy4mc1DamSX2mqF5g%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=a19cc6de09ae7d189d19659de2c95af6`
  await getCcTaskList('getCcTaskList', body, type);
  if (id === 229) {
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49441271645999%22%2C%22taskId%22%3A%22necklace_229%22%2C%22lng%22%3A%22118.1447713674174%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=57453a76ffe9440d7961b05405fb4f13&st=1624535165882&sv=110&uemps=0-0&uts=0f31TVRjBStsz%2BC9YKuTtbGZPv/xrvQQdSUKvavez1nEbzXO4dLo%2BXEvUHAXAd0VPmZqkUNAf2yO/fBM7ImhPYnyBrotzw06Kk7qP6mG42fhA1t5BkW3ZGLaQgPtiuosYOHPMyHpg%2BJ9ZQBP4g3zsSFq2DUWsTOZbb85I4ThMCgqvymyLl48ebUg7aQTle9CfTJVWu5gx0YZ/ScklgN9Pg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  } else if (id === 260) {
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22hRRVbEkLST%2BoqUB6fhir%2BfMoJS814u0eqASGoy8xq0vV1m9X9zKoAVYtaZjcO4UsQaWNyUrMVkZK5HBZ5aJo5zQ%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49435886957707%22%2C%22taskId%22%3A%22necklace_260%22%2C%22lng%22%3A%22118.144791637343%22%2C%22eid%22%3A%22eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm%5C/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY%22%7D&build=167568&client=apple&clientVersion=9.4.2&d_brand=apple&d_model=iPhone12%2C1&eid=eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY&isBackground=N&joycious=51&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=ebf4ce8ecbb641054b00c00483b1cee85660d196&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=93249982ced7ec850c69de8b3e859dab&st=1624610691429&sv=110&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJSTfJm3Nbyn7GqB7OtrJRuHoZMYV%2Bs0mkEZsSwjxzwlDPXLeepml5BnM5XPZQmPVomYBHlkSfLJWR5D1y0Ovgf60fpjMS2gXL5aLh50cNO3cmx2GvVTaTeYxvRUl%2BpaW7HXsuBhxJgA6pUzd01tBX9yiFih8xvToesg91Nl8KcWGYzXJ2/hWKXg%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  } else if (id === 267){
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.49437467152672%22%2C%22taskId%22%3A%22necklace_267%22%2C%22lng%22%3A%22118.1447981202065%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%7D&build=167707&client=apple&clientVersion=10.0.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=70&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=64e2361aa2a81068930c0c3325fd45ef&st=1624950832218&sv=111&uemps=0-0&uts=0f31TVRjBSsMGLCxYS3UIqlZl8dbXmnuZ4ayfhN43Ot1QaV41onc66czNm7agt5ZxuI/ZiEjTyLMd9C68bu6j250BhqFBz9aHYMZHRsZRt99av4Tsia77GOWxlDaSYf5ixm0pZhBRR4OQ%2BUBD6%2BPW4wCMOS5CO3/VI2cFHPfi%2BdGNinbfncIha86vGUGuGKiHSAf4rUFY4wrafX6Rksw7g%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  } else if (id === 273) {
    body = `area=16_1315_3486_59648&body=%7B%22shshshfpb%22%3A%22dPH6zeJy%5C/HFogCIf0ZGFYqSDOShGwmpjVOPM%5C/ViCGC5fgBLL9JoI9mjgUt46vjSFeSkmU9DZLEjFaeFTWBj4Axg%3D%3D%22%2C%22globalLng%22%3A%22118.1423%22%2C%22globalLat%22%3A%2224.49335%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2224.494383110087%22%2C%22taskId%22%3A%22necklace_273%22%2C%22lng%22%3A%22118.1447767134287%22%2C%22eid%22%3A%22eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY%5C/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0%5C/dGmOJzfbLuyNo%22%7D&build=167741&client=apple&clientVersion=10.0.8&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=71&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=c5f1773c699259a32596629ff17c77af&st=1627034890276&sv=101&uemps=0-0&uts=0f31TVRjBSuc9dw/M%2Bj%2BYjMPuoLDUbUPjPag%2BZ5OSbdXPyIGbVBxfPOWG8Z24KZdpryfyfoAUE5oYfYi1SuqGZ5atF1ARqzdFrPeo%2BZQVMmuwn/nYDGsLdj0Q9HcidhJXAaY1ti0j023Mv4f/ls51fJl5ypecBgw2sWtd8KiGQncYOe9GxCz6tlkHuSHDk3zN6hF%2BN0deRJOqJP8OOrJog%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
  } else if (id === 281) {
    body = `area=1_2953_54044_0&body=%7B%22shshshfpb%22%3A%22xMvLenI90G5fXNwdmMLrZ9zcRvSKKKrp3twx2gniQsgkav01VHSjwfaIlRQEYYJ4lUh7i6BmZXDIqLmrcpFgFPw%3D%3D%22%2C%22globalLng%22%3A%22117.010071%22%2C%22globalLat%22%3A%2240.18993%22%2C%22monitorSource%22%3A%22ccgroup_ios_index_task%22%2C%22monitorRefer%22%3A%22%22%2C%22taskType%22%3A%222%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22lat%22%3A%2240.18191448804161%22%2C%22taskId%22%3A%22necklace_281%22%2C%22lng%22%3A%22117.0065653831892%22%2C%22eid%22%3A%22eidI10a1812352s2f8fFJhaZRAaygJavMzzPuH%5C/HxpE9QzhNJ2Cf5aWxpC%2Bi2hshw7jujEFX%5C/JQtTGYOL2wlDjPaiPMK0KbiFPDza4sbsufvPStkf1tM%22%7D&build=167741&client=apple&clientVersion=10.0.8&d_brand=apple&d_model=iPhone10%2C2&eid=eidI10a1812352s2f8fFJhaZRAaygJavMzzPuH/HxpE9QzhNJ2Cf5aWxpC%2Bi2hshw7jujEFX/JQtTGYOL2wlDjPaiPMK0KbiFPDza4sbsufvPStkf1tM&isBackground=N&joycious=95&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8548106a862f1fe7b4b84d3a16f7ffdcf47390de&osVersion=14.4.2&partner=apple&rfs=0000&scope=01&screen=1242%2A2208&sign=53be7e8df676c891c8b7ffedd695c188&st=1627058033720&sv=122&uemps=0-0&uts=0f31TVRjBStnWyWKh4kj%2BvuskvWGi54eyJH5cLJVT6QoOtzNpjyhH/ToU5X7LhKoleMMycwNk8t28%2BJhe0WWPZLkED4dnpAJv9MsudkLTd%2BKR8CJOEgC4PH/IFRT8y51lwtUBXR26fHwsk4aYqBSg0uiALvjv09TMPXJwxQIQ6gEdaaN2v%2B2PBvm1Obp5Nr0RMweFYy4mc1DamSX2mqF5g%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=a19cc6de09ae7d189d19659de2c95af6`
  }
  console.log(`\n领券浏览任务：type:${type},id:${id}\n`);
  if (type === '4') {
    functionId = 'reportSinkTask'
    body = `&appid=XPMSGC2019&monitorSource=&uuid=16245525345801334814959&body=%7B%22platformType%22%3A%221%22%2C%22taskId%22%3A%22necklace_${id}%22%7D&client=m&clientVersion=4.6.0&area=16_1315_1316_59175&geo=%5Bobject%20Object%5D`
    console.log('需等待30秒')
    await $.wait(15000);
  } else {
    functionId = 'reportCcTask'
    console.log('需等待15秒')
  }
  await $.wait(15500);
  await getCcTaskList(functionId, body, type);
}
function getCcTaskList(functionId, body, type = '3') {
  let url = `https://api.m.jd.com/client.action?functionId=${functionId}`;
  if (functionId === 'reportSinkTask') {
    url += body
    body = ''
  }
  return new Promise(resolve => {
    const options = {
      url,
      body,
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Length": "63",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "api.m.jd.com",
        "Origin": "https://h5.m.jd.com",
        "Cookie": cookie,
        "Referer": "https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html",
        "User-Agent": UA,
      }
    }
    $.post((options), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            if (type === '3' && functionId === 'reportCcTask') console.log(`点击首页领券图标(进入领券中心浏览15s)任务:${data}`)
            if (type === '4' && functionId === 'reportSinkTask') console.log(`点击“券后9.9”任务:${data}`)
            data = JSON.parse(data);
            //异常情况：{"code":"600","echo":"signature verification failed"}
            if (data['code'] === '600' && !hasSend) {
              hasSend = true;
              $.msg(
                $.name,
                '',
                `${type === '3' ? '点击首页领券图标(进入领券中心浏览15s)任务' : '点击“券后9.9”任务'}ID已变更\n请联系作者等待更新`
              )
              if ($.isNode()) await notify.sendNotify(
                $.name,
                `${type === '3' ? '点击首页领券图标(进入领券中心浏览15s)任务' : '点击“券后9.9”任务'}ID已变更\n请联系作者等待更新`
              )
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function taskPostUrl(function_id, body = {}) {
  const time = new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000;
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=coupon-necklace&loginType=2&client=coupon-necklace&t=${time}&body=${escape(JSON.stringify(body))}&uuid=${uuid}`,
    // url: `${JD_API_HOST}?functionId=${function_id}&appid=jd_mp_h5&loginType=2&client=jd_mp_h5&t=${time}&body=${escape(JSON.stringify(body))}`,
    headers: {
      "accept": "*/*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-length": "0",
      "cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": UA
    }
  }
}
function randomString() {
  return Math.random().toString(16).slice(2, 10) +
    Math.random().toString(16).slice(2, 10) +
    Math.random().toString(16).slice(2, 10) +
    Math.random().toString(16).slice(2, 10) +
    Math.random().toString(16).slice(2, 10)
}
function getToken(timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://bh.m.jd.com/gettoken`,
        headers : {
          'Content-Type' : `text/plain;charset=UTF-8`
        },
        body : `content={"appname":"50082","whwswswws":"","jdkey":"","body":{"platform":"1"}}`
      }
      $.post(url, async (err, resp, data) => {
        try {
          data = JSON.parse(data);
          joyToken = data.joyytoken;
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
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
