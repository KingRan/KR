const fs = require('fs');
var process = require('child_process');
// 不执行列表
const notRun = [
    'jd_angryKoi.js',
    'jd_blueCoin.js',
    'jd_cleancart.js',
    'jd_CheckCK.js',
    'jd_unsubscribe.js',
    'jd_ttpt.js',
    'jd_try.js',
    'jd_sevenDay.js',
    'jd_signFree.js',
    'jd_jxgckc.js',
    'jd_jfcz.js',
    'jd_jdfactory.js',
    'jd_qqxing.js',
    'jd_get_share_code.js',
    'jd_computer.js',
    'jd_zdjr.js',
    'jd_xmf.js',
    'jd_xfxd.js',
    'jd_ms.js',
    'jd_pigPet.js',
    'jd_plusLottery.js',
    'jd_m_sign.js',
    'jd_joyjd_open.js',
    'jd_gold_sign.js'
]

// 全部任务
const allTask1 = [...fs.readdirSync('./').filter((item) => /^jd_.*.js$/.test(item)).filter((item) => !notRun.includes(item))]
const allTask2 = [...fs.readdirSync('./').filter((item) => /^jx_.*.js$/.test(item)).filter((item) => !notRun.includes(item))]

const allTask = Array.from(new Set([...allTask1, ...allTask2]))
// fs.writeFileSync(`tasklog/difference.log`, allTask.join('\n'))

// task任务
const task = [...fs.readFileSync('utils/task.sh', 'utf-8').match(/\jd.*?\.js/g).filter((item) => !notRun.includes(item))]

// 差异任务
fs.writeFileSync(`tasklog/difference.log`, differenceTask())

// 已完成的task
let completeTask = []

setTimeout(() => runTask(), 5000)

function differenceTask() {
    let allTaskText = `全部任务：\n  ${allTask.filter((item) => !task.includes(item)).join('、')}`
    let taskText = `sh任务：\n  ${task.filter((item) => !allTask.includes(item)).join('、')}`
    return `\n\n\n\n${allTaskText}\n\n\n\n${taskText}`
}

function runTask() {
    task.forEach((item) => {
        process.exec(`node ${item}`, function (error, stdout, stderr) {
            completeTask.push(item)
            const hangTask = task.filter((item2) => !completeTask.includes(item2))
            console.log(hangTask.join(','))
            console.log(`未完成：${hangTask.length}个`)

            let logText = ''
            logText += '\n'
            logText += '\n'
            logText += new Date()
            logText += '\n'
            logText += error || stdout || stderr
            logText += '\n'
            logText += '\n'
            fs.writeFileSync(`log/${item.replace('.js', '.log')}`, logText)
        });
    })
}
