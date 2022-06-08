const fs = require('fs');

const COOKIES = {
    'zhigang1': 'pt_key=AAJinfwnADDzaPthPS3XbKro1KdiW4XcL3UsRmC2625ZQ2GFU0Um5UypVAHDGGxcvg6_5qr4zxY; pt_pin=121388038;',
    'zhigang2--13321825767': 'pt_key=AAJinf10ADBS0V5RdQb1pAHC_WLlupLr9cxTChwhWDGqJYINweX8tRxa7SJ62hsOJxWWG97oj2M; pt_pin=jd_fMOTUvgIPZGX;',
    'qing2--13371916837': 'pt_key=AAJinfyoADDSUnE9JoW3TeBX9IiirCnmMmT7mEeWfRPrkXkQvRzi3XlCPuELC_7NGctA8cdQ0TI; pt_pin=jd_70892f8a2c567;',
    'zhigang3--13361828371': 'pt_key=AAJinf5CADBGcInsZ0C1cUAsZf-338RXtftrDCpDgjEeAc6eZuVynxSe7kjcjWIlbQhB8mVsctI; pt_pin=jd_OzopTeZYkdKe;',
    'wangqing--18221079476': 'pt_key=AAJinf3HADCuVHucSkZJUxmH4m4zRxaUWs6P8kbXbpBWnp_NEb3OINRUWUOr9zlMExM_H6LqSN4; pt_pin=qin%E7%90%B40823;',
    'wangsi--18879085948--363082': 'pt_key=AAJihcI7ADCLyWMPE8ifu2qzCjy64el1qVt01USQS18ObPHtkPAwXybEmDzHtUjaUnaHr4KgmGE; pt_pin=jd_58a0f549a24c9;',
    'wangsi3--18379038490--363082': 'pt_key=AAJihcLZADB4swUDH7-1qRfblaxJpjXX766PaBMyJH_lswEQAfa91hSwHhnZF8wJ6YazBw-3ZcE; pt_pin=wdxwXeyhCOyASO;',
    '伟哥--18817874404--434677': 'pt_key=AAJioMHpADAuRpu3kRpi844pEV6eVRjiDRHVINEL6Lj83V-BQSb_FchX1NW9O56sg94OZh6gXP8; pt_pin=%E5%89%81%E8%BE%A3%E6%A4%92%E5%A5%BD%E8%BE%A3;',
    '伟哥2--15800528093--514603': 'pt_key=AAJiekOTADCxO2qF7zrBFL9_kZ-n7EBmCPzITLGaej31AebRpolLT-K-iEHJCMlSYPb4OuHaHXE; pt_pin=jd_7c203c2698664;',
    '东东--18317114083--612313': 'pt_key=AAJioMJsADCOHciI0DEzMGfvFq-ZFy1cGAL4rF-02UxBQrues4VA-YS0X9wtMDnpuMU_B2cM9pM; pt_pin=1831711408_m;',
    '东东2--18717785846--413547': 'pt_key=AAJioMLFADDsu-jDqkhIIPX7zWi2IWzpePhM-FaLMBxk2r56Onfp_n-ppl9ZBxt-TJatVmacJec; pt_pin=jd_4e2b0abb70a39;',
    'feifei--13611709282--317223': 'pt_key=AAJihcbEADDzznZoWtIC7yOzuc7QAgzBtIQzNgL43yRIgo0eVTR8nQqvZKCTOehlA5QgHpC3fjE; pt_pin=%E9%9A%8F%E9%A3%8E%E8%BF%9C%E7%A8%8B;',
    'feifei2--13501602524--317238': 'pt_key=AAJihcZoADD5QUi5iSya87Trk_G98jCJdGQ67mVTzQ0uJdCWtBiJGWU1eR8EmtUFZIjEkenphAc; pt_pin=jd_73650adb20cc8;',
    'songfan1--13482258491--425113': 'pt_key=AAJie1IPADB9qaNsT_4vzg0ZBprmni6xZBmKxoIqkXbPAGBuXE4QnFShFYcGPIhmrXrr4abdbW4; pt_pin=songfan425;',
    'wanghairong2--17612166926--323128': 'pt_key=AAJihhK6ADDDka33z7l-DoXsTYHR9-_-_QjCAZEba4kORaRMVJEx12-uOY6TnjZ76Sjqy3tECDc; pt_pin=jd_IyhNVkQgzDCW;',
    'wangqiang--17516010987': 'pt_key=AAJifhYVADDAPqWeVxvXcv0mqueoc47mUfj3K1vqcPoyA96rsKdkwelVV8EdzAKgHGnGGGuPbUA; pt_pin=jd_6e7d74af721fb;',
    'shenyuan--13585520850--326012': 'pt_key=AAJieTjgADCBn1Y0dibmmRXPCkF7ORNS8fPiN7NRYot8uSjRxRWAchsZyYjLW98gKOqX-e9Vbm0; pt_pin=diormore;',
    'chensong--15900769139--424219': 'pt_key=AAJihRQOADBB9vsHJxkA-jRfMNiziOlI5XvdEDRNb0i0ifzMy68h-f3eLB8O7wK3tovDOYGcemY; pt_pin=ninetypoints;',
    'zhoulei--15900507586--427156': 'pt_key=AAJiiQP4ADDpmHvWX2HFXQGp27fvtVLLYljvVYUenR547UdHPVI5LbVIkXfpR1dVECLLPH36XWE; pt_pin=wszl1987;',
    'chenchen--18321772130--414247': 'pt_key=AAJihcDjADCDfE9z0KnnUlOF7Yl6ToRvpC_lzDv_VVlG6E1rRcgxxW0i50Hw_UPiHGkf6DXMaFw; pt_pin=jd_5019920a9eca3;',
    'weili--18516151228--453021': 'pt_key=AAJijkibADAa4LMBsFwmc8TqzV63rCPcC--AWbV_0tEc818K4r0aqnToV5wnODAxVINLE6XaN6w; pt_pin=%E5%A4%8F%E5%A4%9C%E5%B8%8C;',
    'yaqing--18875015529--50920X': 'pt_key=AAJii1MOADAD-cFQ95hpiBFl2QQjI6DRFzzFkE7vrVu-4JySl7q_CKj0QgFbqRkFDJvKlrgPfDk; pt_pin=%E9%BB%84%E4%BA%9A%E7%90%B4July;',
    'omi--13917653303--312525': 'pt_key=AAJieUcYADAuyh8Cidi4ZtgL_UGHz87LtEBvM39hjkffPktHGIOxftFkxoTgUaATbPCBiHWREQI; pt_pin=omiling;',
    'songfan2--18221816038--425113': 'pt_key=AAJif2bFADBY9ht6eeh73XbjBYf9eSgqSGV3fi5W1KW3_7QH7vioBWNcom2Z5DZqeIkiTOOhy2Q; pt_pin=jd_45b7686c80a27;',
    'songfan4--13774179686--420620': 'pt_key=AAJifQMTADCd1DbqZRsxrw9_jGCaIdVnacW8LYotegXgaDfAZaCio8mgdViDUkxbGNgXUM-vMqg; pt_pin=jd_OZSaXyfdZDNC;',
    'jiawen--17612154810--363615': 'pt_key=AAJioMPpADBZKiAPhoeMZ4rGJ2i3fRZ64E6dqZSYKKEKHp43cfqjNb47pwFGO0gICz4Qc1Ulx2A; pt_pin=jd_7936a1a552fa2;',
    'junjun--15207902708--363617': 'pt_key=AAJiecm1ADCqNVU6wM9GRZXgLw9HqD1AEZ7GZ3EeNtFQmMcF5OrKtau4t6FLm1oyXSCjB5mE_hg; pt_pin=jd_59a62ffd7b096;',
    'omi2--17521536119--310863': 'pt_key=AAJieUkKADAYMIYMWB5AOGihaeeOnWxStXvjSaTVBacYImR-dEGWXqVq8uqzv7XZsvw7SI9iU6E; pt_pin=jd_6ddb4dbb04000;',
    'wenfei--13764503929--421693': 'pt_key=AAJiiQL6ADBPYa4boECmV7VcietCS4GHEjpHrctmyGUGHMsgUdwczRVGg4ntCU0Ko_ssxVxk9zk; pt_pin=feiwen20;',
    '橙子--13482512202--364866': 'pt_key=AAJiifnvADALaaSNPk7uuNi6nfrofo22CfawROVwZRXOkzvzc-HNV9EEzmlGXOdxO3n_yhDrvhs; pt_pin=%E5%88%98%E8%89%B3a123456;',
    '浦南--15692155715--347929': 'pt_key=AAJihwNIADAyPjmujW27_x_-xDrW25kCbrHcMX0GJcBUp6_FZZDtaUN2QRRomLl0Nz3DRTUCcdQ; pt_pin=jd_5653716359b58;',
    '浦南2--18817568328--340849': 'pt_key=AAJihwb2ADAMa8dO_KF9VlL3_nlanUJhmgodmeEAj6ESc4g13ZVFQCbDPSLwUKKp4Kc1ncv0L5s; pt_pin=jd_4de43726962d6;',
    'songfan7--15879082941--420641': 'pt_key=AAJifQCwADDNvfb2ntJdlUvQwX7tl1GEpK0guS1iBLiq1WmCPPyBEQ9BYveoM_DiLZsQCnyCr9c; pt_pin=jd_66d077c55ee94;',
    'xiaozhi--13585663140--364226': 'pt_key=AAJifPxwADBj6L37rmTTaMHEKnqhKiAY189azW-IIVtA7ve9ACD-bqGOe7OeWh8NAAxgt4DRKiw; pt_pin=jd_6f2cd0b404e58;',
    'xiaozhi2--13585662340--366032': 'pt_key=AAJifPzYADANdVtXt0rbpPwh1Cm4jPuNQHN6LgZrGolwm2Y5wSjG_PMZSsx-qfWl4_QkCwu9GjE; pt_pin=jd_BNfbGjLdEygD;',
    'xiaoshi--15601879183--32642X': 'pt_key=AAJihLBNADBw2X2BirMjEbO1skJQour-V10H7VEmsO-OR3CEpw2neBvEH5MseEaHpK87OBSvhn0; pt_pin=flute23on;',
    'wanghailong--18626252572--323128': 'pt_key=AAJihhHOADD6H3WMLnGAgizqhqOV7jbBP4fxvVz4s4iSzQXAUI1yRHLyfLkq7mSpYMq3mjWAew8; pt_pin=%E6%B0%B4%E5%A4%95123;',
    'yizhou--13916979981--310534': 'pt_key=AAJiiQSOADCjd06YGE0sZVOGM5E7Vy2aWAUJ3n2IiQ0DZ475X8qNlSN7mKSQfb6iiykoTWcEu10; pt_pin=13916979981_p;',
    'yizhou2--13817965380--31504X': 'pt_key=AAJiiQU-ADBA1hiE8Rg08qSAVVDWxZ2UfLiEmohq3aXzp_461xGTUOSJbB-dN9S3UVYKwQWXlYY; pt_pin=%E9%A6%99%E7%8C%AA%E5%AE%9D;',
    'jiayun--15202170640--410822': 'pt_key=AAJifP3jADAQeDBTeYEw67bnioO6WxFxeggY0le1lI6PJ56gsiiFBnvN6YKbxL2jKrz2gE9-qK8; pt_pin=jd_50b661132d259;',
    'lianhua--13918737840--323573': 'pt_key=AAJijkkSADAcUsXsRMETcYWhGNSy57xObp6tA067aBaXBRBfU7cu-6ZaWGZsuboe9ZQbgbY2fNM; pt_pin=lianhua891124;',
    'zhenyu--18207182483--376775': 'pt_key=AAJiiQhrADARmsEzlcDGNtmtyvxrscNSP-mbCxVHyXYaRhRA42tD0qfPfcElEZKtAn5zm43AjtI; pt_pin=13016482674_p;',
    'zhenyu2--17621962167--410049': 'pt_key=AAJiiQizADCGa58xaicjei8_sdDs4ZgmjS69QXUlLKqjGvyR-JDs1BVLCwPBpJXqjUhUdgzVXaE; pt_pin=jd_68b0ef6313ac4;',
    'wangqiang2-17657610987': 'pt_key=AAJiiaNZADDUShXqXdxLexBagiVQpHO9_bOgZzca5mWzK1D4UkTzyYMirO65Nk6jj4qCslOqFjE; pt_pin=13725096398_p;',
    'leiqi53--18301772447': 'pt_key=AAJiedOSADC8VC4NaUsZbHPKF5r-I6sbMOprmdnLMhOM-tCvjlvso9WbyFjxuAYPM2jauBCV1-U; pt_pin=leiqi53;',
    'leiqi二号--15769273532': 'pt_key=AAJiemHaADApB1K2px6r_3t_VKZMZ6d7TyNli0Uxba-glZRt7zYh4VH_ipuRFdEdc6XBDIUhWJ8; pt_pin=15769273532_p;',
    'hupeng--13879028676--366013': 'pt_key=AAJig1vaADDIbKTxqPRzISQ-TX-VJRx3KfAC5-FYlCrcuHXkmVISemS1Pyvg2CVfyTKxW-W4Zgc; pt_pin=jd_TUmcrAJRyPeg;',
    'feifeima--13761366675--312047': 'pt_key=AAJihcdRADCwwSNPSIqPag6FhaolRrplRcbcgtO7TBlkI9ZIi3roIFrO6bgjYArhmPp0q5XCOas; pt_pin=jd_5b70fb199971f;',
    'feifeiba--15801891357--311638': 'pt_key=AAJihce5ADBHliVZG_O-PsrZ6tznHblZagxdbBQzW1vY1W_-X0DFlPnKLRVvTxpJQ2Mv55adF50; pt_pin=jd_4ec5358c7990f;',
    'songfan3--15800664336--420667': 'pt_key=AAJig5h1ADC-bpolodCGxFjtIsa_iz8LxqgNUfDpuO4BDmEn3SoNyOJMR17VwKLECcMMLs7JLbw; pt_pin=jd_58b8a58a68265;',
    '橙子2--13697958307--364863': 'pt_key=AAJihcU5ADDq4l3Tce09iewpZdEgU1ZgDq7SfdIyivcw0lDgj7pUKJLSmYD6HfwmHMb9hBIFXA4; pt_pin=jd_PgSeKEbOKiDO;',
    // 'hupeng2--13479004221--360919': 'pt_key=AAJib3EnADCN19z0vhTy_liDZDNw9YiKjnSUc02qYjqvqiEZ309QTCQu0u59IjVCvX2sGkKkE2w; pt_pin=lei9784495;',
    // 'hupeng3--18279079319--36562X': 'pt_key=AAJib3H3ADDgK1HyN32c0-tuKwQ1Np0FvMtpY8fSBR08aleI_uf1qKsS4cPRyWVU4c1XNiLbkOE; pt_pin=jd_kGFAvwvsJvDt;',
    // 'hupeng4--15107905660--365624': 'pt_key=AAJib3A1ADD5c_I2AH0Xl2C_8wUt5e3uTOFGZW-aOjUSVbRpdHnaPzGGtpL8WcK1WYZXYnhiSoY; pt_pin=jd_bqsnSpBnpYnZ;',
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
