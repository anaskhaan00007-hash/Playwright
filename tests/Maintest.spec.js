const { test, expect } = require('../Fixtures/MyFixture')
const urlData= JSON.parse(JSON.stringify(require("../testData.json")))
const loginData= JSON.parse(JSON.stringify(require("../loginData.json")))
//test.use({viewport:{width:1780,height:1117}})
//test.describe.configure({retries:1})
const loginPage = require("../Pages/LoginPage")
import * as XLSX from 'xlsx'
import path from 'path'

const excelFile = path.join(__dirname,'../data/UserData.xlsx')

test.only('login to application', async ({page,nextFix,wokerFix}) =>
{
const workbook = XLSX.readFile(excelFile)
const worksheet = workbook.Sheets["Sheet1"]
const xlsxToJson = XLSX.utils.sheet_to_json(worksheet)
const user = xlsxToJson[0].Username
const pass = xlsxToJson[0].Password
console.log("Excel Data "+user+" "+pass)

    page.goto(urlData.windowsUrl)
    const login = new loginPage(page)
    await login.loginToApplication(user,pass)
    await login.verifyDashboard()
    console.log("test execution done")
    console.log(wokerFix)
}
)


