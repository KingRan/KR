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
  jdPetNotNotifyList: ['lianhua891124', 'jd_PgSeKEbOKiDO'],
  jdFruitNotNotifyList: ['%E9%A6%99%E7%8C%AA%E5%AE%9D'],
  JD_JOY_PARK_RUN_MSG_TIME: [12, 16, 18, 20, 23],
  JD_JOY_PARK_RUN_ASSETS: '0.01',
  JD_JOY_PARK_RUN_ASSETS2: '0.03',
  FP_B6AC3: '1804945295425750',
  FP_448DE: '1804945295425750',
  joyTask: [],
  joyNotRun: ['jd_fMOTUvgIPZGX'],
  ZJD_OPEN: 20,
  jd_zdjr_activityId: '',
  jd_zdjr_activityUrl: '',
  jd_wxSecond_activityId: 'e1282873c48e44ffba7396399e21e931',
  jd_wxCollectCard_activityId: '',
  tytpacketId: '',
  WindfggToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NDQyMTg4NiwianRpIjoiMWExZGYxYTYtMWIxOS00MGI5LWE1YWItZjBlZjk1NTk4MzE5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjE4MTAxNTYzNDAiLCJuYmYiOjE2NTQ0MjE4ODYsImV4cCI6MTY4NTk1Nzg4Nn0.EUVHSeOmhO4VTvf1Y-Gy-IDT_aOtNZPAokgBsl5q2A8',
  jd_cjhy_activityId: '17dba7a31860460fb34d14a6aea2b8e9',
  jd_cjhy_activityUrl: 'https://cjhydz-isv.isvjcloud.com',
  jd_fxyl_activityId: '31cb3868a5f04dac86337cf4b242a28e'
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
