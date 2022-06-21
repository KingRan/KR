"""
new Env('青龙全自动更新cookie');
接口:Windfgg
"""

import requests
import time
import json
import re
import uuid
import os

token = ""
username = ""
password = ""
wdtoken = os.environ['WindfggToken']
if username == "" or password == "":
    f = open("/ql/config/auth.json")
    auth = f.read()
    auth = json.loads(auth)
    username = auth["username"]
    password = auth["password"]
    token = auth["token"]
    f.close()


def gettimestamp():
    return str(int(time.time() * 1000))


def login(username, password):
    url = "http://127.0.0.1:5700/api/login?t=%s" % gettimestamp()
    data = {"username": username, "password": password}
    r = s.post(url, data)
    if r.status_code==401:
        print('用户名或密码错误')
    s.headers.update({"authorization": "Bearer " + json.loads(r.text)["data"]["token"]})


def getitem(key):
    url = "http://127.0.0.1:5700/api/envs?searchValue=%s&t=%s" % (key, gettimestamp())
    r = s.get(url)
    item = json.loads(r.text)["data"]
    return item


def getckitem(key):
    url = "http://127.0.0.1:5700/api/envs?searchValue=JD_COOKIE&t=%s" % gettimestamp()
    r = s.get(url)
    for i in json.loads(r.text)["data"]:
        if key in i["value"]:
            return i
    return []


def genToken(wsCookie):
    url='https://api.windfgg.cf/jd/sign'
    body = {
        "fn":"genToken",
        "body":{
            "action": "to",
            "to": "https%3A%2F%2Fplogin.m.jd.com%2Fcgi-bin%2Fm%2Fthirdapp_auth_page%3Ftoken%3DAAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg%26client_type%3Dandroid%26appid%3D879%26appup_type%3D1"
        }
    }
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ wdtoken,
    }
    data = json.dumps(body)
    r = requests.post(url, headers=headers, data=data)
    #print(r)
    if r.status_code!=200:
        print('状态码:'+r.status_code+'签名获取失败'+'(401是未授权或可能被拉黑,521是服务器宕机)')
        return ''
    r = json.loads(r.text)
    request_time = r["request_times"]
    print("Windfgg接口访问次数：%s" % (request_time))
    sign=r["data"]
    url = "https://api.m.jd.com/client.action?"
    headers = {
        "content-type": "application/x-www-form-urlencoded",
        "host": "api.m.jd.com",
        "user-agent": "okhttp/3.12.1;jdmall;android;version/10.1.2;build/89753;screen/1080x2136;os/10;network/4g",
        "cookie": wsCookie
    }
    body = {
        "action": "to",
        "to": "https%3A%2F%2Fplogin.m.jd.com%2Fcgi-bin%2Fm%2Fthirdapp_auth_page%3Ftoken%3DAAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg%26client_type%3Dandroid%26appid%3D879%26appup_type%3D1"
    }
    res = requests.post(url + sign, headers=headers)
    token = res.json()["tokenKey"]
    return token

def getJDCookie(tokenKey):
    headers2 = {
        "content-type": "application/x-www-form-urlencoded",
        "host": "un.m.jd.com",
        "user-agent": "okhttp/3.12.1;jdmall;android;version/10.1.2;build/89753;screen/1080x2136;os/10;network/4g",
    }
    params = {
        'tokenKey': tokenKey,
        'to': 'https://wbbny.m.jd.com/babelDiy/Zeus/2fUope8TDN3dUJfNzQswkBLc7uE8/index.html?babelChannel=syfc&from=home'
    }
    res2 = requests.get("https://un.m.jd.com/cgi-bin/app/appjmp", headers=headers2, params=params,
                        allow_redirects=False)
    pt_key = res2.cookies.get("pt_key")
    pt_pin = res2.cookies.get("pt_pin")
    print(f"pt_key={pt_key};pt_pin={pt_pin};")
    return f"pt_key={pt_key};pt_pin={pt_pin};"



def wstopt(wskey):
    try:
        token = genToken(wskey)
        r = getJDCookie(token)
        return r
    except:
        return "error"


def update(text, qlid):
    url = "http://127.0.0.1:5700/api/envs?t=%s" % gettimestamp()
    s.headers.update({"Content-Type": "application/json;charset=UTF-8"})
    data = {
        "name": "JD_COOKIE",
        "value": text,
        "_id": qlid
    }
    r = s.put(url, data=json.dumps(data))
    if json.loads(r.text)["code"] == 200:
        return True
    else:
        return False


def insert(text):
    url = "http://127.0.0.1:5700/api/envs?t=%s" % gettimestamp()
    s.headers.update({"Content-Type": "application/json;charset=UTF-8"})
    data = []
    data_json = {
        "value": text,
        "name": "JD_COOKIE"
    }
    data.append(data_json)
    r = s.post(url, json.dumps(data))
    if json.loads(r.text)["code"] == 200:
        return True
    else:
        return False


if __name__ == '__main__':
    s = requests.session()
    if token == "":
        login(username, password)
    else:
        s.headers.update({"Authorization": "Bearer " + token})
    wskeys = getitem("JD_WSCK")
    #print(wskeys)
    print('获取wsck成功 当前数量:'+str(len(wskeys)))
    print('\r\n')
    count = 1
    for i in wskeys:
        if i["status"] == 0:
            r = wstopt(i["value"])
            if r == "error":
                print("api请求错误")
            else:
                ptck = r
                try:
                    wspin = re.findall(r"pin=(.*?);", i["value"])[0]
                    if ptck == "wskey错误":
                        print("第%s个wskey可能过期了,pin为%s" % (count, wspin))
                    elif ptck == "未知错误" or ptck == "error":
                        print("第%s个wskey发生了未知错误,pin为%s" % (count, wspin))
                    elif "</html>" in ptck:
                        print("你的ip被cloudflare拦截")
                    else:
                        ptpin = re.findall(r"pt_pin=(.*?);", ptck)[0]
                        item = getckitem("pt_pin=" + ptpin)
                        if item != []:
                            qlid = item["_id"]
                            if update(ptck, qlid):
                                print("第%s个wskey更新成功,pin为%s" % (count, wspin))
                                print('\r\n')
                            else:
                                print("第%s个wskey更新失败,pin为%s" % (count, wspin))
                        else:
                            if insert(ptck):
                                print("第%s个wskey添加成功" % count)
                            else:
                                print("第%s个wskey添加失败" % count)
                except:
                    print("第%s个wskey出现异常错误" % count)
                count += 1
        else:
            print("有一个wskey被禁用了")