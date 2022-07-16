# -*- encoding:utf-8 -*-
"""
cron: 20 10 8-22/8 * *
new Env('京东试用');
目前需要完整版CK才能正常运行~
"""

import time
import os
import requests
import json
import re
import random
# from hyper.contrib import HTTP20Adapter


class jd:
    # 获取一些下面函数需要的数据数据
    price = 30  # 过滤价格
    page = 5  # 加载的页数
    tabId = ['212','201','209','208','204','203','206','211']  # 设置类别"tabList":[{"tabName":"精选","tabId":"200","sort":1},{"tabName":"抽奖试","tabId":"212","sort":2},{"tabName":"美妆","tabId":"201","sort":3},{"tabName":"母婴","tabId":"202","sort":4},{"tabName":"食品","tabId":"203","sort":5},{"tabName":"护肤","tabId":"204","sort":6},{"tabName":"洗护","tabId":"205","sort":7},{"tabName":"清洁","tabId":"206","sort":8},{"tabName":"健康","tabId":"207","sort":9},{"tabName":"电器","tabId":"208","sort":10},{"tabName":"手机通讯","tabId":"209","sort":11},{"tabName":"珠宝首饰","tabId":"210","sort":12},{"tabName":"更多惊喜","tabId":"211","sort":13}
    time_sleep = wd = random.randrange(5, 8)#延迟时间
    des = ["甲醛", "背心", "特惠", "海信", "拳击", "皮鞋", "一双", "膜", "手机壳", "职业装", "工装", "护腿", "胸罩", "背心", "流量卡", "文胸", "儿童",
           "牙刷头", "适配", "课", "手术", "一对一", "1对1", "游戏", "外教", "炒股", "资源", "万门", "小班", "优惠券", "学习", "辅导", "你拍", "自营",
           "眼科", "视频", "咨询", "日租卡", "腾讯大王", "5ML", "5ml", "10ml", "指南", "服务", "痔疮", "两片", "体验", "软件", "系统", "时时彩", "1粒",
           "1颗", "一粒", "一颗", "单片", "1片", "止泻药", "股票", "教学", "方案", "计划", "中国移动", "中国联通", "中国电信", "日租卡", "大王卡", "上网卡",
           "流量卡", "电话卡", "手机卡", "米粉卡", "会员卡", "验孕", "早早孕", "二维码", "口语", "教程", "三好网", "辅导", "数学", "语文", "化学", "物理", "视频",
           "试学", "脚气", "鸡眼", "勿拍", "在线", "四级", "六级", "四六级", "英语", "俄语", "佑天兰", "癣", "灰指甲", "远程", "评估", "手册", "家政", "妊娠",
           "编程", "足贴", "装修", "牙刷头", "手机壳", "保护", "卡", "钢化膜", "过滤", "刷子", "墨盒", "墨粉", "内裤", "文胸", "刷头", "镜片", "众福缘",
           "挂饰", "领带", "鞋垫", "牛角", "刮痧", "充电线", "滤芯", "挂架", "膜", "工装", "职业装", "西服", "工作服", "赠品", "一双", "帽子", "抵扣", "皮鞋",
           "拳击", "抹胸","奶粉"]
    # 申请的id数据
    applyId = []
    # 已经申请的id
    ary_id = []

    sqID = []
    sqID2 = {''}
    uuid = []
    # 需要申请的num
    sq_nym = []
    #过滤的cookie   例：pt_pin = 1324 多个用,分割
    jump_cookies=["111"]
    # 添加cookie  os.environ["JD_COOKIE"].split("&")
    cookie = os.environ["JD_COOKIE"].split("&")  # 青龙面板的cookie获取
    #cookie =['']
    # 本地设置cookie
    # cookie = [""]
    # 查询数据申请的标题和商品id
    def query_num(self, page, tabId):
        data2 = 'ext={"prstate":"0"}&appid=newtry&functionId=try_feedsList&uuid=0333464346265636-3653664323631603&clientVersion=10.5.0&client=wh5&osVersion=10&area=22_1930_49322_49429&networkType=wifi&body={"geo":{"lng":103.997301,"lat":30.517789},"tabId":' + str(
            tabId) + ',"page":' + str(page) + ',"version":2,"source":"default","client":"app","previewTime":""}'
        res = self.home(data2)
        if(res==''):
            return print("json返回为空")
        res_json = json.loads(res)
        feedList = res_json["data"]["feedList"]
        print(res_json)
        # 循环遍历数据，获取试用id和标题
        for i in range(0, len(feedList)):
            try:
                trialActivityId = feedList[i]["trialActivityId"]
                skuTitle = feedList[i]["skuTitle"]
                sku_price = float(feedList[i]["jdPrice"])
                sku = feedList[i]["sku"]
                tagList = feedList[i]["tagList"]

                self.filter(trialActivityId, skuTitle, sku_price, sku, tagList)
            except:
                print("没获取到")

    # 程序的主入口，都是基于这个api执行的
    def home(self, data):
        response = requests.post("https://api.m.jd.com/client.action HTTP/1.1", headers=self.header, data=data)
        # print(response.text)
        return response.text

    # 过滤商品和价格，并把要试用的商品添加到applyid
    def filter(self, trialActivityId, skuTitle, sku_price, sku, tagList):
        filter_id = []
        if (self.price > sku_price):
            # print("价格过滤"+skuTitle+str(sku_price)+"----"+str(trialActivityId))
            return ""
        elif (str(tagList) != '[]'):
            return ""
        else:
            # 循环过滤词
            for tel in self.des:
                # 如果在就过滤
                if (tel in skuTitle):
                    # print("过滤标题"+str(skuTitle)+"----"+str(trialActivityId))
                    filter_id.append(trialActivityId)
                    return ""
            goods_list = {"trialActivityId": trialActivityId, "skuTitle": skuTitle, "sku_price": sku_price, "sku": sku}
            self.sqID.append(goods_list)

    def gl_cookie(self,cookie,ck):
        for i in self.jump_cookies:
            if(i in cookie):
                return print("跳过"+i)
        ck.append(cookie)


    # 申请商品
    def apply_goods(self, goods_ids):
        for i in goods_ids:
            goods_id = i["trialActivityId"]
            print(i)
            u = 0
            ck = []
            for cookie in self.cookie:
                self.gl_cookie(cookie,ck)
            for c in ck:
                self.header["Cookie"] = c.strip()
                self.header["Referer"] = "https://pro.m.jd.com/mall/active/3mpGVQDhvLsMvKfZZumWPQyWt83L/index.html?activityId="+str(goods_id)
                apply_header = self.header
                # self.add_goods(c.strip(), i["sku"])
                try:
                    self.add_shop(c.strip(),goods_id)
                except:
                    print("收藏失败")
                data = 'appid=newtry&functionId=try_apply&uuid=0333464346265636-3653664323631603&clientVersion=10.5.2&client=wh5&osVersion=10&area=22_1930_49322_49429&networkType=wifi&body={"activityId":' + str(
                    goods_id) + ',"previewTime":""}'#"geo":{"lng":103.997301,"lat":30.517789},
                res = requests.post("https://api.m.jd.com/client.action HTTP/1.1", headers=apply_header, data=data)
                # print(res.text)
                patter = "pt_pin=(.*?);"
                patter_msg = '"message":(.*?),'
                pt_pin = re.compile(patter).findall(apply_header["Cookie"])
                time.sleep(self.time_sleep)
                message = re.compile(patter_msg).findall(res.text)
                u = u + 1
                while(str(message)=='[]'):
                    res = requests.post("https://api.m.jd.com/client.action HTTP/1.1", headers=apply_header, data=data)
                    message = re.compile(patter_msg).findall(res.text)
                print(i["skuTitle"] + "---" + str(pt_pin) + "---" + str(message))

    # 已申请商品的id
    def success_id(self):
        uuid = str(self.get_uuid())
        for i in range(0, 100):
            data = 'appid=newtry&functionId=try_MyTrials&uuid=0333464346265636-3653664323631603&clientVersion=10.5.0&client=wh5&osVersion=10&area=22_1930_49322_49429&networkType=wifi&body={"geo":{"lng":103.763375,"lat":30.949972},"page":' + str(
                i) + ',"selected":1,"previewTime":""}'
            res = requests.post("https://api.m.jd.com/client.action HTTP/1.1", headers=self.header, data=data)
            res_json = json.loads(res.text)
            for i in res_json["data"]["list"]:
                self.ary_id.append(i["actId"])

    # 设置uuid
    def get_uuid(self):
        uuid = ''.join(random.sample(
            ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
             'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'z'], 40))
        return uuid

    # 收藏商品
    def add_goods(self, cookie, sku):
        header = {
            ":authority": "wq.jd.com",
            ":scheme": "https",
            ":path": "/fav/comm/FavCommAdd?callback=addFavA&commId=" + str(sku) + "&sceneval=2&category=737_738_749&t=0.7921807027688994&appCode=msc588d6d5",
            "accept-encoding": "gzip, deflate, br",
            'Accept': '*/*',
            'Connection': 'keep-alive',
            "sec-fetch-mode": "no-cors",
            "Accept-Encoding": "gzip, deflate, br",
            "X-Requested-With": "com.jingdong.app.mall",
            "Sec-Fetch-Site": "same-site",
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
            "Referer": "https://item.m.jd.com/",
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36",
            "Cookie": cookie
        }
        time.sleep(1)
        url = "https://wq.jd.com/fav/comm/FavCommAdd"
        data = {
            "callback": "addFavA",
            "commId": str(sku),
            "sceneval": "2",
            "category": "14065_14070_14072",
            "t": "0.9003255587888168",
            "appCode": "msc588d6d5",
        }
        sessions = requests.session()
        sessions.mount(url, HTTP20Adapter())
        res = sessions.get(url, headers=header, data=data)
        print(res.text)

    # 关注店铺
    def add_shop(self,cookie, activityid):
        header = {
            'Host': 'api.m.jd.com',
            'Accept': 'application/json, text/plain, */*',
            'Connection': 'keep-alive',
            "Sec-Fetch-Mode": "cors",
            "Accept-Encoding": "gzip, deflate, br",
            "X-Requested-With": "com.jingdong.app.mall",
            "Sec-Fetch-Site": "same-site",
            "Origin": "https://prodev.m.jd.com",
            "Referer": 'https://home.m.jd.com/myJd/newhome.action',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'jdapp;android;10.5.0;;;appBuild/95837;ef/1;ep/%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1650000135503%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22sv%22%3A%22CJK%3D%22%2C%22ad%22%3A%22CNDuDQHsZWDtDWY0CtZrCK%3D%3D%22%2C%22od%22%3A%22CtqmCwYyEJOzCtO1DJGmCK%3D%3D%22%2C%22ov%22%3A%22Ctu%3D%22%2C%22ud%22%3A%22CNDuDQHsZWDtDWY0CtZrCK%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045745 Mobile Safari/537.36',
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cookie": cookie
        }
        time.sleep(1)
        data = 'appid=newtry&functionId=try_detail&uuid=&clientVersion=&client=wh5&osVersion=13.2.3&area=&networkType=&body='+'{"activityId":"'+str(activityid)+'","previewTime":""}'
        res = requests.post("https://api.m.jd.com/client.action HTTP/1.1", data=data,headers=header)
        print(res.text)

    #过滤已经申请的id
    def gl_id(self, ary_id, sqID):
        for i in sqID:
            if(i["trialActivityId"] in ary_id):
                print("存在" + str(i["trialActivityId"]))
            else:
                self.sq_nym.append(i)

    def __init__(self):
        self.header = {
            'Host': 'api.m.jd.com',
            'Accept': 'application/json, text/plain, */*',
            'Connection': 'keep-alive',
            "Sec-Fetch-Mode": "cors",
            "Accept-Encoding": "gzip, deflate, br",
            "X-Requested-With": "com.jingdong.app.mall",
            "Sec-Fetch-Site": "same-site",
            "Origin": "https://prodev.m.jd.com",
            "Referer": "https://prodev.m.jd.com/mall/active/G7sQ92vWSBsTHzk4e953qUGWQJ4/index.html?babelChannel=ttt14&has_native=0&tttparams=8wlC8eyJnTGF0IjoiMzAuOTI2MzE4IiwiZ0xuZyI6IjEwMy44MTk1NzEiLCJncHNfYXJlYSI6IjIyXzE5MzBfNDkzMjRfNTI1MTMiLCJsYXQiOjMwLjUxNzU2NSwibG5nIjoxMDMuOTk3Mjc3LCJtb2RlbCI6Ik1JIDgiLCJwcnN0YXRlIjoiMCIsInVuX2FyZWEiOiIyMl8xOTMwXzQ5MzIyXzQ5NDI5In50%3D&sid=7063f0659f66a5d7ac1dffd13e85eefw&un_area=22_1930_49322_49429",
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'jdapp;android;10.5.0;;;appBuild/95837;ef/1;ep/%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1650000135503%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22sv%22%3A%22CJK%3D%22%2C%22ad%22%3A%22CNDuDQHsZWDtDWY0CtZrCK%3D%3D%22%2C%22od%22%3A%22CtqmCwYyEJOzCtO1DJGmCK%3D%3D%22%2C%22ov%22%3A%22Ctu%3D%22%2C%22ud%22%3A%22CNDuDQHsZWDtDWY0CtZrCK%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045745 Mobile Safari/537.36',
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cookie": self.cookie[0]
        }
        for j in self.tabId:
        # 循环查询页数
            for i in range(1, self.page):
                self.query_num(i, j)
                # print(str(i)+"-----------"+str(j))
        # 调用获取成功的id
        self.success_id()
        # 遍历cookie
        for i in range(0, len(self.cookie)):
            self.uuid.append(self.get_uuid())
        # print(self.uuid)
        # print(self.ary_id)
        # print(len(self.ary_id))
        # print(str(self.sqID))
        # print(len(self.sqID))
        self.gl_id(self.ary_id,self.sqID)
        print(self.sq_nym)
        print(len(self.sq_nym))
        # self.apply_goods(self.sq_nym)


jd()
