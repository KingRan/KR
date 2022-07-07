const fs = require('fs');

const COOKIES = {
    'zhigang1': 'pt_key=AAJiwZtkADBzTs_MNIvPc2wloPMyez9nFDAaOrOeLRj86JEIPbobQ3rLWzANxu5TNUOC4ydwglU; pt_pin=121388038;',
    'qing2--13371916837': 'pt_key=AAJiwZuiADDIvevhnuj-ezlpV_Uw4Vz0k2SQWz2yf24iheZTgcX3bcz57Gbvt25Q5f-y__YfqRo; pt_pin=jd_70892f8a2c567;',
    'zhigang2--13321825767': 'pt_key=AAJiwZqXADAvwGeWRcw4zCGBTUO8zc99v147DrOlsNyVh_kYlhp9OujBELZoCRkOTU7LdsRC2Q8; pt_pin=jd_fMOTUvgIPZGX;',
    'zhigang3--13361828371': 'pt_key=AAJiwZxyADCkAZClfz7d6LoB5wygx8s2ctUI2Th7SsLxW7Agw87llAWUurWsHJidLBh4YSTPT-g; pt_pin=jd_OzopTeZYkdKe;',
    'wangqing--18221079476': 'pt_key=AAJiwZrTADAFh2bHpEbW2xriXiM2-LwA_xDYvpUeG5g0z_Tub6ZfyNmAvFFnFaH_D7xI1PrkaqA; pt_pin=qin%E7%90%B40823;',
    'wangsi--18879085948--363082': 'pt_key=AAJirV1FADC3Amvc8y_-zy2G1wzco8PJRaHGvBYS_TH_H6KTxcznjh5a5xjrVVM7VtNkXwD0J2M; pt_pin=jd_58a0f549a24c9;',
    'wangsi3--18379038490--363082': 'pt_key=AAJirV2VADDxXqiKG6xS7LaZML5hn23dXB69WopQh4BgaPtDmFes7F3iYfvadDB7UmDZk87SijA; pt_pin=wdxwXeyhCOyASO;',
    '伟哥--18817874404--434677': 'pt_key=AAJioMHpADAuRpu3kRpi844pEV6eVRjiDRHVINEL6Lj83V-BQSb_FchX1NW9O56sg94OZh6gXP8; pt_pin=%E5%89%81%E8%BE%A3%E6%A4%92%E5%A5%BD%E8%BE%A3;',
    '伟哥2--15800528093--514603': 'pt_key=AAJiobyfADB0o1RvJsbUmuvtQLFI9u2IzKSI5tIuMHMD8_vi2IOhhwA0KNvyF0rABSMWIo8xgpc; pt_pin=jd_7c203c2698664;',
    '东东--18317114083--612313': 'pt_key=AAJioMJsADCOHciI0DEzMGfvFq-ZFy1cGAL4rF-02UxBQrues4VA-YS0X9wtMDnpuMU_B2cM9pM; pt_pin=1831711408_m;',
    '东东2--18717785846--413547': 'pt_key=AAJioMLFADDsu-jDqkhIIPX7zWi2IWzpePhM-FaLMBxk2r56Onfp_n-ppl9ZBxt-TJatVmacJec; pt_pin=jd_4e2b0abb70a39;',
    'feifei--13611709282--317223': 'pt_key=AAJir-ooADCWQUuzxp98_EaEglakUmZ0Xy6lvSzuCD-2JN7Si-OXqI10uwtIJqExd_wi8I8NfkA; pt_pin=%E9%9A%8F%E9%A3%8E%E8%BF%9C%E7%A8%8B;',
    'feifei2--13501602524--317238': 'pt_key=AAJir-qUADCew2D5QqCVUIT3zCKgW74VA7Wi9ABjxXtG7RdN2Dfv3lstYaxjT2TyYRQ9Wge0yCc; pt_pin=jd_73650adb20cc8;',
    'songfan1--13482258491--425113': 'pt_key=AAJiowU6ADDVNFEaRMvbv20L4ltIrsa5RwD0Mi43cMHYDd_V7hcyc72OL3caSZRDtnMJODhrAwE; pt_pin=songfan425;',
    'yizhou3--18918250202--311926': 'pt_key=AAJiowaRADDy0yg8F-zqidI2x7PP4eGwwLxnQRit_X6VfdB8pcWrHLfBll5_UGKTuL4_rnJ3ZMo; pt_pin=s361917996;',
    'zhoulei--15900507586--427156': 'pt_key=AAJisSVeADDF-ua2TYbtK23SjZNo5xWA-cy19Uqf-kbPLJsJrXPeMXgvGa4F-l0UHk2rCJOjLPg; pt_pin=wszl1987;',
    'chenchen--18321772130--414247': 'pt_key=AAJipuWrADCS72VXtmz2eznNc7yPqrMX9UXXbFoazBio2YWuedE-2379w1L3R8Z0kxMGTxzqs94; pt_pin=jd_5019920a9eca3;',
    'weili--18516151228--453021': 'pt_key=AAJitsyoADC878HIvvqwwAhsL0XFf_yj7D9QvxSUGq35dyjrfooLnyQE6MdXo4Mp3koJ00oj3oo; pt_pin=%E5%A4%8F%E5%A4%9C%E5%B8%8C;',
    'chensong--15900769139--424219': 'pt_key=AAJirLDKADC4ACXF7PO-27FuCwCHIlszIOMar513IOkMhKBJbSb6jMfhvRf14XfLL0zOenXj9Gg; pt_pin=ninetypoints;',
    'yaqing--18875015529--50920X': 'pt_key=AAJis9VkADD9_QV8u7EmgnwmBumScRO9CnqKRuq7splB-z7rRrz_ui_Lu-o_tLVXxKKacyWs5XI; pt_pin=%E9%BB%84%E4%BA%9A%E7%90%B4July;',
    'shenyuan--13585520850--326012': 'pt_key=AAJioMfKADCtxj--GiFq6HYSwu4ztHfBgZVuadqIJsRgeU6nDqaoSmPTpkYrent-BYysGVh817U; pt_pin=diormore;',
    'omi--13917653303--312525': 'pt_key=AAJioW3zADAvg-C8fAKVyyxxbbqmdxBV4Ph-K3vJ7vERqxFkXFbeEGZRxYN_8o7WBXKYUddOE24; pt_pin=omiling;',
    'songfan2--18221816038--425113': 'pt_key=AAJiowXNADDVflYTOmcvImZqcvgoZkl6cgpgAY5g0-Az96xSIw5b74tjp7Xg5-WmOUBjt7xQmoM; pt_pin=jd_45b7686c80a27;',
    'songfan4--13774179686--420620': 'pt_key=AAJipXm-ADATgU7yXh9MXGeV7McQLBndG9X3aziLvTTWT8En78pzc4eCc5pt6om8-stD40-_JpE; pt_pin=jd_OZSaXyfdZDNC;',
    'jiawen--17612154810--363615': 'pt_key=AAJioMPpADBZKiAPhoeMZ4rGJ2i3fRZ64E6dqZSYKKEKHp43cfqjNb47pwFGO0gICz4Qc1Ulx2A; pt_pin=jd_7936a1a552fa2;',
    'junjun--15207902708--363617': 'pt_key=AAJioV_0ADB4NresvM0H5zgMyX2Iiaq5QoYsIGjQNH4sDbrDQSMnRHyCw4W0BxVmCNCrcw_wVq4; pt_pin=jd_59a62ffd7b096;',
    'omi2--17521536119--310863': 'pt_key=AAJioW5RADCwsVIrW5htmSkTTaTsdqS12oxqtVd4SH0Tpnu0uBziYagv5BOpIBDUpZuST-mdIyw; pt_pin=jd_6ddb4dbb04000;',
    'wenfei--13764503929--421693': 'pt_key=AAJisVwDADDIn1Yn7kDZn8s4CvMnVrNhhGhAIUs0Sx_GCnaNANYMqUWFnu1HifUqs9vmGCFEgLw; pt_pin=feiwen20;',
    '橙子--13482512202--364866': 'pt_key=AAJis9RKADAT2ggrHvHZZqrdgjx6UtNY3BaolndBP8N8ZlLbwtxkfx9eefbTVKtu253FfVh0aiI; pt_pin=%E5%88%98%E8%89%B3a123456;',
    '浦南--15692155715--347929': 'pt_key=AAJirr7sADAuRrpZxZrDN9E0feLAeEp3wE-7mFmV8hJ68he4MFIbA1CAChgF5Vd0m44lk74mUQs; pt_pin=jd_5653716359b58;',
    '浦南2--18817568328--340849': 'pt_key=AAJirtsMADDGtwjbyxW5h5pY0S32bbesL_ApAGbIRBNgdL9Bbhc3HbXrRch-bSnKkOSGIVdKbBY; pt_pin=jd_4de43726962d6;',
    'songfan7--15879082941--420641': 'pt_key=AAJiowakADCag4kuRuSxh2r4pf9FiDmQzRmRnltx5qlIzyI06jIzypR2RlZq2nicS0njgXaLACM; pt_pin=jd_66d077c55ee94;',
    'xiaozhi--13585663140--364226': 'pt_key=AAJipX1lADBuPWAwW44E-CHpTJ3IW3hjVFffQaOTjmjJvGqKEgBD66VuuxzeH4LeKHZj5PNv5MU; pt_pin=jd_6f2cd0b404e58;',
    'xiaozhi2--13585662340--366032': 'pt_key=AAJipX3HADByZQ_CafuN4JM50Cwf9azw2UYXYM-id7kY0RcjbyQLVoysJngqkcJGriLHkfEKdUA; pt_pin=jd_BNfbGjLdEygD;',
    'xiaoshi--15601879183--32642X': 'pt_key=AAJirZG_ADC-YEsL0tbtTvUS69Y5cpZqWAYkmOkhNlOoiprLCxvy3y_AAKKIA-E9rKfnssfnV4Q; pt_pin=flute23on;',
    'wanghailong--18626252572--323128': 'pt_key=AAJird_nADAXN3nxmnmmsAPFROeFvqwUkHJyIxtt3pxdGSdmxsFOtKViLHRfJxW3DxiNiAweUBY; pt_pin=%E6%B0%B4%E5%A4%95123;',
    'yizhou--13916979981--310534': 'pt_key=AAJisSXyADBfsBC7ugeaq2k-kqmVInmVx4csStHYRuCXiKn8kkR0jiKBBe4apkpL9hUzWlkTqIw; pt_pin=13916979981_p;',
    'yizhou2--13817965380--31504X': 'pt_key=AAJis-L7ADDFd6DsSQTXvVZ0ElwVWkI76U_KffWW8u8mk7QqozXD3zkxY9ZH-as-3yrV42QUw3s; pt_pin=%E9%A6%99%E7%8C%AA%E5%AE%9D;',
    'jiayun--15202170640--410822': 'pt_key=AAJipLjAADDiHQFPtEAES_LASTzjDHDM0EBgfJnp8CKs4YjtVNi9Gr2vw9qG9xiBLbw0lJ33Nq0; pt_pin=jd_50b661132d259;',
    'lianhua--13918737840--323573': 'pt_key=AAJitswDADAjJLyJd3UccdYS1o4aXtofC7J8wTYXF0nxgJyS8aP7KYOtrfhWkmKtUbBJHW-Rd_Y; pt_pin=lianhua891124;',
    'zhenyu--18207182483--376775': 'pt_key=AAJisWQIADBbbCWEz3V--LIkaOAwhhJputA39H31eVYaVgMp9O-mHjN0J5nEGst81m6w8QYdbh8; pt_pin=13016482674_p;',
    'zhenyu2--17621962167--410049': 'pt_key=AAJisWSeADAroJ1KyIfmL4PJIpHOTzzEbbXttWGhWzowBTE6GP5-JgvKb6GFU5slXK_TTN8l9Qg; pt_pin=jd_68b0ef6313ac4;',
    'wangqiang--17516010987': 'pt_key=AAJiqUKSADCj8T_eOxIJEV-iMP4SCyhLHjsXYmREuZ2IX5jfK9zp7RpFNwfMqKyA0iaMG_E4N84; pt_pin=jd_6e7d74af721fb;',
    'wangqiang2-17657610987': 'pt_key=AAJiqUIDADAb2VtqXrPvuzYW4ZYxyjGI0HsApVxxrGY3RiLt6T-sCrvWrj8I6rKucCIfnXqWV10; pt_pin=13725096398_p;',
    'leiqi53--18301772447': 'pt_key=AAJipDkbADCmSNqbM538uFyG7OGsHZyUpuA2C9aZEpXfWG3wHS6umocvOpS4cV5G8v0uTvN-7aM; pt_pin=leiqi53;',
    'leiqi二号--15769273532': 'pt_key=AAJipDnJADBvdUc_joZ71C4tigN0iC6Yzfp7dwtDIQ7tXGVpNmNO4oA3zBnlWnJsLFEBjmNHo-M; pt_pin=15769273532_p;',
    'hupeng--13879028676--366013': 'pt_key=AAJiqy71ADAK-bKTS1p4uvw1xKaRkV-aSzLKSGYewjOtlgxyBUljCwJH75K08aI27uSNR7x22R8; pt_pin=jd_TUmcrAJRyPeg;',
    'hupeng2--15107905660--365624': 'pt_key=AAJiqy-7ADCLtKK2lIGycqvUfNzvtouIaeRXvigN5Ucl08Br-qRpa5UaC_0i-0pmt7O95qanQ4g; pt_pin=jd_bqsnSpBnpYnZ;',
    'feifeima--13761366675--312047': 'pt_key=AAJir-sHADA0onQ7U2DJq2haRfJEj-7-FDpqqeuteXtZo6LhPBw-yyo2O0aO_oaoN03HI894t2c; pt_pin=jd_5b70fb199971f;',
    'feifeiba--15801891357--311638': 'pt_key=AAJir-tNADCHHDOKp9KUiWi7HG6Bgm7IKeXXrIYbOXfC8ju6NNLg-w2WwvccE-EFX78kfsSqlcs; pt_pin=jd_4ec5358c7990f;',
    'songfan3--15800664336--420667': 'pt_key=AAJiqzQxADB-K9eDXJNxhiQy5OD2xhxdAHCmvH-9VLJHalJBWJ_wnWwwh-IxgGavONWOx7DKJfo; pt_pin=jd_58b8a58a68265;',
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
