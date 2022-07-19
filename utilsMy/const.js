const fs = require('fs');

const COOKIES = {
    'zhigang1': 'pt_key=AAJiwZtkADBzTs_MNIvPc2wloPMyez9nFDAaOrOeLRj86JEIPbobQ3rLWzANxu5TNUOC4ydwglU; pt_pin=121388038;',
    'qing2--13371916837': 'pt_key=AAJiwZuiADDIvevhnuj-ezlpV_Uw4Vz0k2SQWz2yf24iheZTgcX3bcz57Gbvt25Q5f-y__YfqRo; pt_pin=jd_70892f8a2c567;',
    'zhigang2--13321825767': 'pt_key=AAJiwZqXADAvwGeWRcw4zCGBTUO8zc99v147DrOlsNyVh_kYlhp9OujBELZoCRkOTU7LdsRC2Q8; pt_pin=jd_fMOTUvgIPZGX;',
    'zhigang3--13361828371': 'pt_key=AAJiwZxyADCkAZClfz7d6LoB5wygx8s2ctUI2Th7SsLxW7Agw87llAWUurWsHJidLBh4YSTPT-g; pt_pin=jd_OzopTeZYkdKe;',
    'wangqing--18221079476': 'pt_key=AAJiwZrTADAFh2bHpEbW2xriXiM2-LwA_xDYvpUeG5g0z_Tub6ZfyNmAvFFnFaH_D7xI1PrkaqA; pt_pin=qin%E7%90%B40823;',
    'wangsi--18879085948--363082': 'pt_key=AAJi1S6sADCW7ovPIV-qVK6AQi1maS_alWptiSv6-EqqXLXvgjnEv-rzUBy5VZVeUpUWlI0FnuA; pt_pin=jd_58a0f549a24c9;',
    'wangsi3--18379038490--363082': 'pt_key=AAJi1S9JADC5N4vz3shESwIRHVT2uWJWpLw2kU_fH28Pif2BQ98ny8h4A_-9gP3JON1OZyJzRS4; pt_pin=wdxwXeyhCOyASO;',
    '伟哥--18817874404--434677': 'pt_key=AAJiySHeADDBpa91a7ehAWi5FylXG-7c-gcIxiTvhUkX6BRBkib6ICnguaWFzHLxrGm7IpIZbFk; pt_pin=%E5%89%81%E8%BE%A3%E6%A4%92%E5%A5%BD%E8%BE%A3;',
    '伟哥2--15800528093--514603': 'pt_key=AAJizCmSADBhpVzKxDSnbyDNDJu7lyeJnXHnkGeFx8l175MszKQ5CMo68LdziWQyLcNVYNw0TiI; pt_pin=jd_7c203c2698664;',
    '东东--18317114083--612313': 'pt_key=AAJiySAQADBhb9Ipy88rHeUyP_d2UiiywBpA9pPJenJ2YykZByrs-X7o3QmsAGJKEWoDp2ZIH2w; pt_pin=1831711408_m;',
    '东东2--18717785846--413547': 'pt_key=AAJiySBNADDpCso_H8IWk1ZATEWl8cdR6qk_BCdtJb_yKNVa8syCBuGdWEB836vZXSTGk9Va0as; pt_pin=jd_4e2b0abb70a39;',
    'feifei--13611709282--317223': 'pt_key=AAJir-ooADCWQUuzxp98_EaEglakUmZ0Xy6lvSzuCD-2JN7Si-OXqI10uwtIJqExd_wi8I8NfkA; pt_pin=%E9%9A%8F%E9%A3%8E%E8%BF%9C%E7%A8%8B;',
    'feifei2--13501602524--317238': 'pt_key=AAJir-qUADCew2D5QqCVUIT3zCKgW74VA7Wi9ABjxXtG7RdN2Dfv3lstYaxjT2TyYRQ9Wge0yCc; pt_pin=jd_73650adb20cc8;',
    'songfan1--13482258491--425113': 'pt_key=AAJizOZdADAqlZ4McuNPDzUi5dPbs6am4FZys5P6pideaa_-Rk1T15KkzDTh_cZgx0K1yKNpIy0; pt_pin=songfan425;',
    'zhoulei--15900507586--427156': 'pt_key=AAJisSVeADDF-ua2TYbtK23SjZNo5xWA-cy19Uqf-kbPLJsJrXPeMXgvGa4F-l0UHk2rCJOjLPg; pt_pin=wszl1987;',
    'chenchen--18321772130--414247': 'pt_key=AAJiz5wnADDg1POmS4o1rgZjP9n9X5OEZVzpCcEQYlPNTYTsw-K098Qk4n28L-nhG9UzQYa6t3o; pt_pin=jd_5019920a9eca3;',
    'weili--18516151228--453021': 'pt_key=AAJitsyoADC878HIvvqwwAhsL0XFf_yj7D9QvxSUGq35dyjrfooLnyQE6MdXo4Mp3koJ00oj3oo; pt_pin=%E5%A4%8F%E5%A4%9C%E5%B8%8C;',
    'yaqing--18875015529--50920X': 'pt_key=AAJis9VkADD9_QV8u7EmgnwmBumScRO9CnqKRuq7splB-z7rRrz_ui_Lu-o_tLVXxKKacyWs5XI; pt_pin=%E9%BB%84%E4%BA%9A%E7%90%B4July;',
    'shenyuan--13585520850--326012': 'pt_key=AAJiyRWTADBZE8wOIFGClyOmPe8Yi1_URsDzPuITV63PcmleKPLY-eZNPStHNRDUoHmqkAF6o7I; pt_pin=diormore;',
    'omi--13917653303--312525': 'pt_key=AAJiyTgYADDQizWfwRrp-ol1l6W18nsplUgscrsGGMqAN0RY6-FwUiacOOyhht_BVXQ35plpfLI; pt_pin=omiling;',
    'songfan2--18221816038--425113': 'pt_key=AAJizOakADDNRN-NzskYqN-MdUodw4FU9VXjumuo36_Tq7TbK_a-mPoNpQ9pY0tOjS2s4Y68mIk; pt_pin=jd_45b7686c80a27;',
    'songfan4--13774179686--420620': 'pt_key=AAJizOfwADASzl7uE3pajTgnxSsTFz7t5bJ3OHHSDHUJzNaRDC9uEs8yGd5t2D7YZor7VaNqbiI; pt_pin=jd_OZSaXyfdZDNC;',
    'chensong--15900769139--424219': 'pt_key=AAJi1RmlADDWZNJT4wzAaySLOELH0V71j5nZU9CZbq4UER7UE0EYyacU8GesNsUJV2ZovBt2igg; pt_pin=ninetypoints;',
    'jiawen--17612154810--363615': 'pt_key=AAJiyR1kADCQXqfsW8umgz__BZlM12O5GM_Ns_9gGNmNGL46WcC_D6k2MQDT_XiGVJkj9FMktLo; pt_pin=jd_7936a1a552fa2;',
    'junjun--15207902708--363617': 'pt_key=AAJiyTfMADDlLe6P7c2EXeLBZ_yiE9uykiZPfRszW-fvk0zEqmd6DE6xrT6XJ95XLExQdf8o-Dg; pt_pin=jd_59a62ffd7b096;',
    'omi2--17521536119--310863': 'pt_key=AAJiyTgtADAaftZeLUKZpZOyi43T6HbXt8iXbitjDWxZad-nfyfkqM1XG8Jsm4MxndT93uaLcuc; pt_pin=jd_6ddb4dbb04000;',
    'wenfei--13764503929--421693': 'pt_key=AAJisVwDADDIn1Yn7kDZn8s4CvMnVrNhhGhAIUs0Sx_GCnaNANYMqUWFnu1HifUqs9vmGCFEgLw; pt_pin=feiwen20;',
    '橙子--13482512202--364866': 'pt_key=AAJis9RKADAT2ggrHvHZZqrdgjx6UtNY3BaolndBP8N8ZlLbwtxkfx9eefbTVKtu253FfVh0aiI; pt_pin=%E5%88%98%E8%89%B3a123456;',
    '浦南--15692155715--347929': 'pt_key=AAJirr7sADAuRrpZxZrDN9E0feLAeEp3wE-7mFmV8hJ68he4MFIbA1CAChgF5Vd0m44lk74mUQs; pt_pin=jd_5653716359b58;',
    '浦南2--18817568328--340849': 'pt_key=AAJirtsMADDGtwjbyxW5h5pY0S32bbesL_ApAGbIRBNgdL9Bbhc3HbXrRch-bSnKkOSGIVdKbBY; pt_pin=jd_4de43726962d6;',
    'songfan7--15879082941--420641': 'pt_key=AAJizOdvADAzCI98hjZ-Ok6TwOfwwOLDtj66nwjXlp7by2Tw-Y_NhCGJBISTjCMi-JZaZQcAhFU; pt_pin=jd_66d077c55ee94;',
    'xiaozhi--13585663140--364226': 'pt_key=AAJizVUiADA1o9DSBKBjW9kfGSgG6ijY10t55_Cb-UspchP1AS9mndJ1DIoZLgnHWZJr7_f-27k; pt_pin=jd_6f2cd0b404e58;',
    'xiaozhi2--13585662340--366032': 'pt_key=AAJizVU1ADC7DceYXRvvgkvqAq9teDpDSzjT0wt0e3QPx3V4vxgCEtU7bH8bEba5X9v3n_5Z_Hc; pt_pin=jd_BNfbGjLdEygD;',
    'xiaoshi--15601879183--32642X': 'pt_key=AAJi1hsrADBnrB9OnOJmZ89rDu5yt9JO0txukAGQhGePCxsFW_oAPg--TUr0Rcaxe3LJaT6loa4; pt_pin=flute23on;',
    // 'wanghailong--18626252572--323128': 'pt_key=AAJird_nADAXN3nxmnmmsAPFROeFvqwUkHJyIxtt3pxdGSdmxsFOtKViLHRfJxW3DxiNiAweUBY; pt_pin=%E6%B0%B4%E5%A4%95123;',
    'yizhou--13916979981--310534': 'pt_key=AAJisSXyADBfsBC7ugeaq2k-kqmVInmVx4csStHYRuCXiKn8kkR0jiKBBe4apkpL9hUzWlkTqIw; pt_pin=13916979981_p;',
    'yizhou2--13817965380--31504X': 'pt_key=AAJis-L7ADDFd6DsSQTXvVZ0ElwVWkI76U_KffWW8u8mk7QqozXD3zkxY9ZH-as-3yrV42QUw3s; pt_pin=%E9%A6%99%E7%8C%AA%E5%AE%9D;',
    'yizhou3--18918250202--311926': 'pt_key=AAJiy6ezADBGTpBDB5NM3LAERpV7hnWXbufLBPA43iMXz1ELwUNDPnLyBtok6e0s8B-RkU0vhTg; pt_pin=s361917996;',
    'jiayun--15202170640--410822': 'pt_key=AAJizNuKADAnDqDPzOnu4aWo0TnkKgrZSBMwqL-O_XLQy8eMU9t00sr2uy0S2roKIFMhnE2663Y; pt_pin=jd_50b661132d259;',
    'lianhua--13918737840--323573': 'pt_key=AAJitswDADAjJLyJd3UccdYS1o4aXtofC7J8wTYXF0nxgJyS8aP7KYOtrfhWkmKtUbBJHW-Rd_Y; pt_pin=lianhua891124;',
    'zhenyu--18207182483--376775': 'pt_key=AAJisWQIADBbbCWEz3V--LIkaOAwhhJputA39H31eVYaVgMp9O-mHjN0J5nEGst81m6w8QYdbh8; pt_pin=13016482674_p;',
    'zhenyu2--17621962167--410049': 'pt_key=AAJisWSeADAroJ1KyIfmL4PJIpHOTzzEbbXttWGhWzowBTE6GP5-JgvKb6GFU5slXK_TTN8l9Qg; pt_pin=jd_68b0ef6313ac4;',
    'wangqiang--17516010987': 'pt_key=AAJi0OqmADAoG2KtjDTXN9k0f9MabuhpagwvJ0-niQprBe7mVhQVemQ9eriD0vmZ-x5VesESpEA; pt_pin=jd_6e7d74af721fb;',
    'wangqiang2-17657610987': 'pt_key=AAJi0OxBADD5DT0cUS-UBJNJjWr0atlJ7GZ72rKe0ZvTFkTtVdpiKFAjJr5WizLsXr2Y8t_OvEQ; pt_pin=13725096398_p;',
    'leiqi53--18301772447--614777': 'pt_key=AAJizOl0ADAM0mskr7d9wNKJ6qjSlOVQKLPRqEVSRHGvpw9GxTZo7yhfRncqkvY66wNJl0gOas0; pt_pin=leiqi53;',
    'leiqi二号--15769273532--322962': 'pt_key=AAJizOoGADBmx6L1xuBj0spU-i8s8zk-AyeWo0w7m3EEBKh-UfDOXYWDBicFZiEKD98ptGCL-kQ; pt_pin=15769273532_p;',
    'hupeng--13879028676--366013': 'pt_key=AAJi09cNADD_ZTdaml2G5M4rXbZnuf66LfJyOzbxOxoPxE2kNdupDSg-f94i8U4pHmwNMCohQXs; pt_pin=jd_TUmcrAJRyPeg;',
    'hupeng2--15107905660--365624': 'pt_key=AAJi09dqADD1eVBRwN6-j-Qad6blWNTt6rTCfVzXCKk-kpPqSa5g1jal1LsppxJc0NoC__tRBfo; pt_pin=jd_bqsnSpBnpYnZ;',
    'feifeima--13761366675--312047': 'pt_key=AAJir-sHADA0onQ7U2DJq2haRfJEj-7-FDpqqeuteXtZo6LhPBw-yyo2O0aO_oaoN03HI894t2c; pt_pin=jd_5b70fb199971f;',
    'feifeiba--15801891357--311638': 'pt_key=AAJir-tNADCHHDOKp9KUiWi7HG6Bgm7IKeXXrIYbOXfC8ju6NNLg-w2WwvccE-EFX78kfsSqlcs; pt_pin=jd_4ec5358c7990f;',
    'songfan3--15800664336--420667': 'pt_key=AAJi1A6QADDprmqwmXg9KPz-BXVoDhfhGZiJkQXZcJeTpgcQ1atlajvFkwTqgE1tsKN7_VEJgI4; pt_pin=jd_58b8a58a68265;',
    // '橙子2--13697958307--364863': 'pt_key=AAJihcU5ADDq4l3Tce09iewpZdEgU1ZgDq7SfdIyivcw0lDgj7pUKJLSmYD6HfwmHMb9hBIFXA4; pt_pin=jd_PgSeKEbOKiDO;',
    // 'wanghailong2--17612166926--323128': 'pt_key=AAJihhK6ADDDka33z7l-DoXsTYHR9-_-_QjCAZEba4kORaRMVJEx12-uOY6TnjZ76Sjqy3tECDc; pt_pin=jd_IyhNVkQgzDCW;',
    // 'hupeng3--13479004221--360919': 'pt_key=AAJib3EnADCN19z0vhTy_liDZDNw9YiKjnSUc02qYjqvqiEZ309QTCQu0u59IjVCvX2sGkKkE2w; pt_pin=lei9784495;',
    // 'hupeng4--18279079319--36562X': 'pt_key=AAJib3H3ADDgK1HyN32c0-tuKwQ1Np0FvMtpY8fSBR08aleI_uf1qKsS4cPRyWVU4c1XNiLbkOE; pt_pin=jd_kGFAvwvsJvDt;',
}

// const cookiesSort = Object.keys(COOKIES).map((item, index) => (`${index + 1} -- ${item} -- ${COOKIES[item].split(';')[1]}`))

// fs.writeFileSync('cookies-sort.json', JSON.stringify(cookiesSort, null, '\t'), () => {
// })

for (let item in COOKIES) {
    COOKIES[item] = COOKIES[item].replace(/(^\s+)|(\s+$)|\s+/g, '')
}

const COOKIESNAME = Object.entries(COOKIES).map(([key, value]) => {
    const nameArr = key.split('--')
    const mobileLast = (nameArr[1] && nameArr[1].substring(nameArr[1].length-4)) || ''
    return [decodeURIComponent(value.match(/pt_pin=([^; ]+)(?=;?)/)[1]), `${nameArr[0]},手机尾号为：${mobileLast}`]
})

module.exports = {COOKIES, COOKIESNAME: Object.fromEntries(COOKIESNAME)}
