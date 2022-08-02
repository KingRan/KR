# 每3天的23:50分清理一次日志(互助码不清理，proc_file.sh对该文件进行了去重)
50 23 */3 * * find /scripts/logs -name '*.log' | grep -v 'sharecodeCollection' | xargs rm -rf
#收集助力码
30 * * * * sh +x /scripts/docker/auto_help.sh collect >> /scripts/logs/auto_help_collect.log 2>&1

##############活动##############

# 京东日资产变动
20 9 * * * node /scripts/jd_bean_change.js >> /scripts/logs/jd_bean_change.log 2>&1
# 京东资产变动
30 21 * * * node /scripts/jd_bean_change_pro.js >> /scripts/logs/jd_bean_change_pro.log 2>&1
# 领京豆额外奖励
23 1,18 * * * node /scripts/jd_bean_home.js >> /scripts/logs/jd_bean_home.log 2>&1
# 京豆详情统计
20 22 * * * node /scripts/jd_bean_info.js >> /scripts/logs/jd_bean_info.log 2>&1
# 京东多合一签到
0 7 * * * node /scripts/jd_bean_sign.js >> /scripts/logs/jd_bean_sign.log 2>&1
# 美丽研究院
20 7,12,19 * * * node /scripts/jd_beauty.js >> /scripts/logs/jd_beauty.log 2>&1
# 头文字J
30 4,16 * * * node /scripts/jd_carplay.js >> /scripts/logs/jd_carplay.log 2>&1
# 签到领现金_Windfgg
30 8,14 * * * node /scripts/jd_cash_windfg.js >> /scripts/logs/jd_cash_windfg.log 2>&1
# 微信签到领现金
16 0,5 * * * node /scripts/jd_cash_wx.js >> /scripts/logs/jd_cash_wx.log 2>&1
# 京喜财富岛
1 0-23/2 * * * node /scripts/jd_cfd.js >> /scripts/logs/jd_cfd.log 2>&1
# 财富岛互助
33 0,14 * * * node /scripts/jd_cfd_help.js >> /scripts/logs/jd_cfd_help.log 2>&1
# 清空购物车
53 22 * * * node /scripts/jd_cleancart.js >> /scripts/logs/jd_cleancart.log 2>&1
# 摇京豆
11 0,18 * * * node /scripts/jd_club_lottery.js >> /scripts/logs/jd_club_lottery.log 2>&1
# 京东快递-每日抽奖
30 9 * 7 * node /scripts/jd_daily_lottery.js >> /scripts/logs/jd_daily_lottery.log 2>&1
# 东东乐园
30 7 * * * node /scripts/jd_ddnc_farmpark.js >> /scripts/logs/jd_ddnc_farmpark.log 2>&1
# 店铺签到
15 2,14 * * * node /scripts/jd_dpqd.js >> /scripts/logs/jd_dpqd.log 2>&1
# 京喜工厂
10 0,6-23 * * * node /scripts/jd_dreamFactory.js >> /scripts/logs/jd_dreamFactory.log 2>&1
# 京喜工厂招工互助
5 6,18 * * * node /scripts/jd_dreamFactory_help.js >> /scripts/logs/jd_dreamFactory_help.log 2>&1
# 京喜工厂开团
40 0,8 * * * node /scripts/jd_dreamFactory_tuan.js >> /scripts/logs/jd_dreamFactory_tuan.log 2>&1
# M京豆夺宝
40,45 23 * * * node /scripts/jd_duobao.js >> /scripts/logs/jd_duobao.log 2>&1
# 积分换话费
33 7 * * * node /scripts/jd_dwapp.js >> /scripts/logs/jd_dwapp.log 2>&1
# 东东农场好友删减奖励
10 2 * * * node /scripts/jd_fruit_friend.js >> /scripts/logs/jd_fruit_friend.log 2>&1
# 东东农场内部水滴互助
20 4,16 * * * node /scripts/jd_fruit_help.js >> /scripts/logs/jd_fruit_help.log 2>&1
# 东东农场日常任务
5 6-18/6 * * * node /scripts/jd_fruit_task.js >> /scripts/logs/jd_fruit_task.log 2>&1
# 金榜创造营
13 1,22 * * * node /scripts/jd_gold_creator.js >> /scripts/logs/jd_gold_creator.log 2>&1
# 东东健康社区
13 1,6,22 * * * node /scripts/jd_health.js >> /scripts/logs/jd_health.log 2>&1
# 东东健康社区收集能量收集
5-45/20 * * * * node /scripts/jd_health_collect.js >> /scripts/logs/jd_health_collect.log 2>&1
# 东东健康社区内部互助
5 4,14 * * * node /scripts/jd_health_help.js >> /scripts/logs/jd_health_help.log 2>&1
# 京洞察问卷通知
35 11 * * * node /scripts/jd_insight.js >> /scripts/logs/jd_insight.log 2>&1
# 京东到家果园任务
10 0,3,8,11,17 * * * node /scripts/jd_jddj_fruit.js >> /scripts/logs/jd_jddj_fruit.log 2>&1
# 东东工厂
10 0,6-23 * * * node /scripts/jd_jdfactory.js >> /scripts/logs/jd_jdfactory.log 2>&1
# 东东工厂内部互助
50 4,17 * * * node /scripts/jd_jdfactory_help.js >> /scripts/logs/jd_jdfactory_help.log 2>&1
# 京东赚赚修复版
10 1,19 * * * node /scripts/jd_jdzz.js >> /scripts/logs/jd_jdzz.log 2>&1
# 领金贴
26 0,19 * * * node /scripts/jd_jin_tie.js >> /scripts/logs/jd_jin_tie.log 2>&1
# 汪汪乐园-跑步+组队
30 0 * * * node /scripts/jd_joy_park_run.ts >> /scripts/logs/jd_joy_park_run.log 2>&1
# 汪汪乐园每日任务
0 1,7,20 * * * node /scripts/jd_joy_park_task.js >> /scripts/logs/jd_joy_park_task.log 2>&1
# JOY庄园每日任务
11 1,15 * * * node /scripts/jd_joymanor_task.js >> /scripts/logs/jd_joymanor_task.log 2>&1
# 金融双签-加密
10 19 * * * node /scripts/jd_jrsign.js >> /scripts/logs/jd_jrsign.log 2>&1
# 极速版签到提现-加密
30 0,15 * * * node /scripts/jd_js_sign.js >> /scripts/logs/jd_js_sign.log 2>&1
# 京喜双签-加密
23 11,20 * * * node /scripts/jd_jx_sign.js >> /scripts/logs/jd_jx_sign.log 2>&1
# 京喜牧场
20 0-23/2 * * * node /scripts/jd_jxmc.js >> /scripts/logs/jd_jxmc.log 2>&1
# 惊喜牧场内部互助
23 0-23/3 * * * node /scripts/jd_jxmc_hb.js >> /scripts/logs/jd_jxmc_hb.log 2>&1
# 砍价免费拿
0 0 * * * node /scripts/jd_kanjia.js >> /scripts/logs/jd_kanjia.log 2>&1
# 京东快递签到
10 0 * * * node /scripts/jd_kd.js >> /scripts/logs/jd_kd.log 2>&1
# 京东摇钱树
3 0-23/11 * * * node /scripts/jd_moneyTree.js >> /scripts/logs/jd_moneyTree.log 2>&1
# 生鲜早起打卡
15 6,7 * * * node /scripts/jd_morningSc.js >> /scripts/logs/jd_morningSc.log 2>&1
# 东东萌宠
15 6-18/6 * * * node /scripts/jd_pet.js >> /scripts/logs/jd_pet.log 2>&1
# 东东萌宠内部互助
30 5,20 * * * node /scripts/jd_pet_help.js >> /scripts/logs/jd_pet_help.log 2>&1
# 种豆得豆
1 7-21/2 * * * node /scripts/jd_plantBean.js >> /scripts/logs/jd_plantBean.log 2>&1
# 种豆得豆内部互助
40 4,17 * * * node /scripts/jd_plantBean_help.js >> /scripts/logs/jd_plantBean_help.log 2>&1
# 京东保价
39 20 * * * node /scripts/jd_price.js >> /scripts/logs/jd_price.log 2>&1
# QQ星系牧场
22 4-22/3 * * * node /scripts/jd_qqxing.js >> /scripts/logs/jd_qqxing.log 2>&1
# 闪购盲盒
20 8 * * * node /scripts/jd_sgmh.js >> /scripts/logs/jd_sgmh.log 2>&1
# 闪购签到有礼
10 10 * * * node /scripts/jd_shangou.js >> /scripts/logs/jd_shangou.log 2>&1
# M京东签到
48 9,22 * * * node /scripts/jd_sign.js >> /scripts/logs/jd_sign.log 2>&1
# 京东签到翻牌
10 8 * * * node /scripts/jd_sign_graphics.js >> /scripts/logs/jd_sign_graphics.log 2>&1
# 京东极速版领红包-加密
20 0,22 * * * node /scripts/jd_speed_redpocke.js >> /scripts/logs/jd_speed_redpocke.log 2>&1
# 京东极速版
21 3,8 * * * node /scripts/jd_speed_sign.js >> /scripts/logs/jd_speed_sign.log 2>&1
# 京东极速版签到免单
18 8,20 * * * node /scripts/jd_speed_signfree.js >> /scripts/logs/jd_speed_signfree.log 2>&1
# 特务Z-II
35 10,18,20 * * * node /scripts/jd_superBrand.js >> /scripts/logs/jd_superBrand.log 2>&1
# 特务集卡
2 10,18,20 * * * node /scripts/jd_superBrandJK.js >> /scripts/logs/jd_superBrandJK.log 2>&1
# 特务集勋章
8 10,18,20 * * * node /scripts/jd_superBrandJXZ.js >> /scripts/logs/jd_superBrandJXZ.log 2>&1
# 特务之明星送好礼
36 2,19 * * * node /scripts/jd_superBrandStar.js >> /scripts/logs/jd_superBrandStar.log 2>&1
# 京东试用
44 1-22/5 * * * node /scripts/jd_try.js >> /scripts/logs/jd_try.log 2>&1
# 京东试用待领取通知
22 15 * * * node /scripts/jd_try_notify.js >> /scripts/logs/jd_try_notify.log 2>&1
# 极速版-推推赚大钱
0 1 * * * node /scripts/jd_tyt.js >> /scripts/logs/jd_tyt.log 2>&1
# 推推赚大钱-快速
0 0 * * * node /scripts/jd_tyt_ks.js >> /scripts/logs/jd_tyt_ks.log 2>&1
# 取关所有主播
55 22 * * * node /scripts/jd_unsubscriLive.js >> /scripts/logs/jd_unsubscriLive.log 2>&1
# 批量取关店铺和商品
22 22 * * * node /scripts/jd_unsubscribe.js >> /scripts/logs/jd_unsubscribe.log 2>&1
# 众筹许愿池
40 0,2 * * * node /scripts/jd_wish.js >> /scripts/logs/jd_wish.log 2>&1
# 极速版我是大老板农场
5 0-23/6 * * * node /scripts/jd_wsdlb.js >> /scripts/logs/jd_wsdlb.log 2>&1
# 京享周周乐
2 6 * * 5 node /scripts/jd_xs_zzl.js >> /scripts/logs/jd_xs_zzl.log 2>&1
# 邀请有礼
45 0 * * * node /scripts/jd_yqyl.js >> /scripts/logs/jd_yqyl.log 2>&1
# 极速版赚金币邀请
20 0 * * * node /scripts/jd_zjb.js >> /scripts/logs/jd_zjb.log 2>&1
# 赚喜豆-TS版
15,30,45 0 * * * node /scripts/jd_zjd.ts >> /scripts/logs/jd_zjd.log 2>&1
# 京喜签到
20 1,8 * * * node /scripts/jx_sign.js >> /scripts/logs/jx_sign.log 2>&1