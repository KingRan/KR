const envList = {
  // QYWX_KEY: 'f4b84705-060d-464d-9b6d-3a34d5db1b9a',
  PUSH_PLUS_TOKEN: '88fa80d4d8f548f19268fcc3f2be24b3',
  // BARK_PUSH: 'https://sctapi.ftqq.com?act=SCT54825TAiLyjdHMSdZPQwf0hTmgaOMY',
  // 京喜财富岛控制是否运行脚本后通知
  CFD_NOTIFY_CONTROL:true,
  HELP_JOYPARK: false,
  lsjdh: 'jdAward2',
  JXGC_NOTIFY_LEVEL: 1,
  FS_LEVEL: 'car',
  JD_JOIN_ZLC: false,
  BEANCHANGE_ENABLEMONTH: true,
  BEANCHANGE_PERSENT: 30,
  exjxbeans: true,
  BEANCHANGE_DISABLELIST: '东东农场&京喜工厂&东东萌宠&京东工厂&喜豆查询&金融养猪',
  InviterPin: '26SeXThtMCG6aP+jxigijw==',
  zdtx: true,
  yqm: '26SeXThtMCG6aP+jxigijw==',
  CFD_LOOP_LIMIT: 1,
  CFD_LOOP_SLEEPTIME: 1000*30,
  JOY_COIN_MAXIMIZE: '1',
  dlbtz: true,
  jdPetNotNotifyList: ['lianhua891124', 'jd_PgSeKEbOKiDO', '%E9%A6%99%E7%8C%AA%E5%AE%9D'],
  jdFruitNotNotifyList: [],
  JD_JOY_PARK_RUN_MSG_TIME: [12, 16, 18, 20, 23],
  JD_JOY_PARK_RUN_ASSETS: '0.01',
  JD_JOY_PARK_RUN_ASSETS2: '0.03',
  FP_B6AC3: '1804945295425750',
  FP_448DE: '1804945295425750',
  joyTask: [],
  joyNotRun: [],
  ZJD_OPEN: 20,
  jd_zdjr_activityId: 'cb1330290b1845149a1451b9dd4e996d',
  jd_zdjr_activityUrl: '',
  jd_wxSecond_activityId: '709e317fe83841f9986b85a1669aea6c',
  jd_wxCollectCard_activityId: '9773b7860d3f4836af07fb37b8ca033d',
  tytpacketId: '',
  WindfggToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NDQyMTg4NiwianRpIjoiMWExZGYxYTYtMWIxOS00MGI5LWE1YWItZjBlZjk1NTk4MzE5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjE4MTAxNTYzNDAiLCJuYmYiOjE2NTQ0MjE4ODYsImV4cCI6MTY4NTk1Nzg4Nn0.EUVHSeOmhO4VTvf1Y-Gy-IDT_aOtNZPAokgBsl5q2A8',
  jd_cjhy_activityId: '1c8c1a888a8d4e2f9d018853a55623ec',
  jd_cjhy_activityUrl: 'https://cjhydz-isv.isvjcloud.com',
  jd_fxyl_activityId: 'f2057c29ba84427688683a4abc170b96',
  jd_wdz_activityId: 'b80a75f107e2452f8222c59eb7e24ca7',
  jd_wdz_activityUrl: 'https://cjhydz-isv.isvjcloud.com',
  JD_Lottery: 'aa6afd716cda497ab83d3f452443ecf6',
  JD_JOYOPEN: '11f663b79e7c48c08cc6b93cd61b0825',
  VENDER_ID: '1000411104',
  jd_drawCenter_activityId: '9606059f01494afcb6f695691a9b30ed',
  SEVENDAY_LIST: 'b78817d3730b48188380914df178c30c',
  DPLHTY: '385cf53a2efd467e8a2ac_220626',
  jd_wxCartKoi_activityId: '7ccae8e594024b649e36a0740077b2a0',
  M_WX_ADD_CART_URL: 'https://lzkj-isv.isvjcloud.com/wxCollectionActivity/activity2/b252840a3f9a426480f0e0d7df9b3942?activityId=b252840a3f9a426480f0e0d7df9b3942',
  WXGAME_ACT_ID: '32038e10b143463e901024f86965a6aa',
  jd_wxFansInterActionActivity_activityId: '501cfe74a1384c5c8fa789d35190f0e1'
}

function setEnv() {
  Object.keys(envList).forEach((item) => {
    let value = envList[item]
    if(['jdPetNotNotifyList', 'jdFruitNotNotifyList'].includes(item)) {
      value = value.map((item) => decodeURIComponent(item))
    }
    process.env[item] = value
  })
}
module.exports = { setEnv, envList }
