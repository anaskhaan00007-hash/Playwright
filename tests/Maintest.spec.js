const { test, expect } = require('@playwright/test')
const urlData= JSON.parse(JSON.stringify(require("../testData.json")))
const loginData= JSON.parse(JSON.stringify(require("../loginData.json")))
//test.use({viewport:{width:1780,height:1117}})
test.use({ screenshot: "on" });
//test.describe.configure({retries:1})
const loginPage = require("../Pages/LoginPage")

test.only('login to application', async ({page}) =>
{
    page.goto(urlData.windowsUrl)
    const login = new loginPage(page)
    await login.loginToApplication("admin@email.com","admin@123")
    await login.verifyDashboard()
}
)


