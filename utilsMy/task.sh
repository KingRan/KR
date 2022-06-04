55 23 * * * /sbin/reboot

50 23 */1 * * find /home/data/logs/jd_script_node -name '*.log' | grep -v 'jd_get_share_code.log' | xargs rm -rf


# jdhelloworld
#4 0,18 * * * /usr/local/bin/node /home/data/jd_scripts/jd_wechat_sign.js >> /home/data/logs/jd_script_node/jd_wechat_sign.log 2>&1
10,45 * * * * /usr/local/bin/node /home/data/jd_scripts/jd_joy_park_run.js >> /home/data/logs/jd_script_node/jd_joy_park_run.log 2>&1
2 7,20 * * * /usr/local/bin/node /home/data/jd_scripts/jd_speed_coin.js >> /home/data/logs/jd_script_node/jd_speed_coin.log 2>&1
#15 0,20 * * * /usr/local/bin/node /home/data/jd_scripts/jd_speed_sign.js >> /home/data/logs/jd_script_node/jd_speed_sign.log 2>&1
#15 0,1 * * * /usr/local/bin/node /home/data/jd_scripts/jd_zjd.js >> /home/data/logs/jd_script_node/jd_zjd.log 2>&1
10 20 * * * /usr/local/bin/node /home/data/jd_scripts/jd_checkCookie.js >> /home/data/logs/jd_script_node/jd_checkCookie.log 2>&1
10 2 * * * /usr/local/bin/node /home/data/jd_scripts/jd_dwapp.js
10 7,18 * * * /usr/local/bin/node /home/data/jd_scripts/jd_cash_wechat.js >> /home/data/logs/jd_script_node/jd_cash_wechat.log 2>&1




20 0,19 * * * /usr/local/bin/node /home/data/KR/gua_opencard175.js



# 极速版
#5 0 * * * /usr/local/bin/node /home/data/faker3/jd_joy_park_task.js
20 0,19 * * * /usr/local/bin/node /home/data/KR/jd_js_sign.js
0 7 * * * /usr/local/bin/node /home/data/KR/jd_zjb.js
45 0 * * * /usr/local/bin/node /home/data/KR/jd_yqyl.js
30 0-23/3 * * * /usr/local/bin/node /home/data/KR/jd_wsdlb.js
0 1 * * * /usr/local/bin/node /home/data/KR/jd_tyt.js
3 0,19 * * * /usr/local/bin/node /home/data/KR/jd_speed_redpocke.js


# 京喜
1 0,1,20 * * * /usr/local/bin/node /home/data/KR/jx_sign.js

13 6-23/2 * * * /usr/local/bin/node /home/data/faker3/jd_my_jxmc.js
5 0,10 * * * /usr/local/bin/node /home/data/faker3/jd_my_jxmc_help.js
5 3,12,18,21 * * * /usr/local/bin/node /home/data/faker3/jd_my_cfd.js
5 0,9 * * * /usr/local/bin/node /home/data/faker3/jd_my_cfd_help.js
30 0-23/4 * * * /usr/local/bin/node /home/data/faker3/jd_my_cfd_loop.js

# 微信
2 0,7 * * * /usr/local/bin/node /home/data/KR/jd_xgyl_wx.js

# 活动
20 11 * * * /usr/local/bin/node /home/data/KR/jd_zdjr.js
5 10 * * * /usr/local/bin/node /home/data/KR/jd_wxSecond.js
5 10 * * * /usr/local/bin/node /home/data/KR/jd_wxCollectCard.js
18 20 * * * /usr/local/bin/node /home/data/KR/jd_teamMN.js



# 京东
2 6 * * 5 /usr/local/bin/node /home/data/KR/jd_xs_zzl.js
15 25-31,1-18 5,6 * /usr/local/bin/node /home/data/KR/jd_xiaomi.js
0 10 * * * /usr/local/bin/node /home/data/KR/jd_wyw.js
18 0,2,20 * * * /usr/local/bin/node /home/data/KR/jd_wish.js
18 21 * * * /usr/local/bin/node /home/data/KR/jd_unsubscriLive.js
38 21 * * * /usr/local/bin/node /home/data/KR/jd_unsubscribe.js
31 0,13 26-31,1-16 5,6 * /usr/local/bin/node /home/data/KR/jd_tanwei.js
0 20 3,17 6 * /usr/local/bin/node /home/data/KR/jd_supermh.js
10 6 1-19 6 * /usr/local/bin/node /home/data/KR/jd_superBrandSign.js
4 10,18,20 * * * /usr/local/bin/node /home/data/KR/jd_superBrandJK.js
35 10,18,20 * * * /usr/local/bin/node /home/data/KR/jd_superBrand.js
3 8,17 * * * /usr/local/bin/node /home/data/KR/jd_sign_graphics.js
38 9,22 * * * /usr/local/bin/node /home/data/KR/jd_sign.js
25 4,21 * * * /usr/local/bin/node /home/data/KR/jd_sgmh.js
25 0,23 * * * /usr/local/bin/node /home/data/KR/jd_price.js >> /home/data/logs/jd_script_node/jd_price.log 2>&1
20 2-21/2 * * * /usr/local/bin/node /home/data/KR/jd_plantBean.js
5 2,18 * * * /usr/local/bin/node /home/data/KR/jd_plantBean_help.js
10 6-18/6 * * * /usr/local/bin/node /home/data/KR/jd_pet.js
7 4,15 * * * /usr/local/bin/node /home/data/KR/jd_pet_help.js
1 8 * * * /usr/local/bin/node /home/data/KR/jd_mpdzcar.js
1 6,10,12 * * * /usr/local/bin/node /home/data/KR/jd_mpdzcar_game.js
10 0 * * * /usr/local/bin/node /home/data/KR/jd_kd.js
7 11 * * * /usr/local/bin/node /home/data/KR/jd_live.js




10 9,12,16,20,23 * * * /usr/local/bin/node /home/data/faker3/jd_bean_change.js
23 1,6,15,21 * * * /usr/local/bin/node /home/data/faker3/jd_bean_home.js
10 0 * * * /usr/local/bin/node /home/data/faker3/jd_jin_tie.js
#20 12 * * * /usr/local/bin/node /home/data/faker3/jd_beauty_ex.js
30 6 * * * /usr/local/bin/node /home/data/faker3/jd_goodMorning.js
2 0,11 * * * /usr/local/bin/node /home/data/faker3/jd_desire.js
#2 1 * * * /usr/local/bin/node /home/data/faker3/jd_dfw.js
3 1,11 * * * /usr/local/bin/node /home/data/faker3/jd_m_sign.js
40 1 * * * /usr/local/bin/node /home/data/faker3/jd_ry.js
13 1,22 * * * /usr/local/bin/node /home/data/faker3/jd_gold_creator.js
10 3 * * * /usr/local/bin/node /home/data/faker3/jd_shop.js
18 7 * * * /usr/local/bin/node /home/data/faker3/jd_ddly.js
13 0,20 * * * /usr/local/bin/node /home/data/faker3/jd_dpqd.js
13 1,6,22 * * * /usr/local/bin/node /home/data/faker3/jd_health2.js
30 0,6-23 * * * /usr/local/bin/node /home/data/faker3/jd_health_collect.js
5 4,14 * * * /usr/local/bin/node /home/data/faker3/jd_health_help.js
0 0 * * * /usr/local/bin/node /home/data/faker3/jd_health_exchange.js
6 0,16,20,23 * * * /usr/local/bin/node /home/data/faker3/jd_club_lottery.js

10 0,6-18/6 * * * /usr/local/bin/node /home/data/faker3/jd_my_fruit.js
10 6-18/6 * * * /usr/local/bin/node /home/data/faker3/jd_my_pet.js
0 * * * * /usr/local/bin/node /home/data/faker3/jd_my_redrain.js
30 21,22 * * * /usr/local/bin/node /home/data/faker3/jd_my_redrain_half.js
40 0,21 * * * /usr/local/bin/node /home/data/faker3/jd_my_jdzz.js
50 12-14 * * * /usr/local/bin/node /home/data/faker3/jd_my_live.js
0 0,18 * * * /usr/local/bin/node /home/data/faker3/jd_my_bean_sign.js
10 0,6-23 * * * /usr/local/bin/node /home/data/faker3/jd_my_dreamFactory.js


