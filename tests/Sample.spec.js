const { test, expect } = require('@playwright/test')
const urlData= JSON.parse(JSON.stringify(require("../testData.json")))
const loginData= JSON.parse(JSON.stringify(require("../loginData.json")))
//test.use({viewport:{width:1780,height:1117}})
test.use({ screenshot: "on" });
//test.describe.configure({retries:1})
const loginPage = require("../Pages/LoginPage")

test.describe.skip("data driven example", function()
{
    for(const credentials of loginData)
    {
        test.describe(`login with user ${credentials.id}`,function()
        {     
            test('login to application', async ({ page })=>
            {
                await page.goto("https://www.google.com/");
               // await expect(page.getByRole('img', { class: 'lnXdpd' })).toBeVisible();
                await page.getByRole('combobox', { class: 'gLFyf' }).fill(credentials.username);
                await page.keyboard.press('Enter');
                // page.getByRole('combobox', { class: 'gLFyf' }).fill(credentials.password);
                    
            });      
        })       
    }   
})


test.skip("dropdown test", async function ({ page }) {
    await page.goto(urlData.dropDownUrl);
    const dropdown1 = page.locator("//select[@id='dropdown']")
    await expect(dropdown1).toBeVisible();
    //await dropdown1.click;
    await dropdown1.selectOption({ value: "2" });
    // await page.waitForTimeout(5000)
    const currentUrl = await page.url();
    console.log("url is: " + currentUrl);
    const linkVerify = currentUrl.includes("dropdown");
    console.log("boolean is:" + linkVerify);
    expect(linkVerify).toBeTruthy();
})


test.skip("handle alerts", async ({ page, browser }) => {
    await page.goto(urlData.alertUrl)
    const alert = await page.locator("//button[text()='Click for JS Alert']")
    const confirm = await page.locator("//button[text()='Click for JS Confirm']")
    const promt = await page.locator("//button[text()='Click for JS Prompt']")
    page.on('dialog', async (consoleAlert) => {
        const messageText = consoleAlert.message()
        console.log(messageText)
        if((messageText).includes("Alert")){
            consoleAlert.accept()
            console.log("Alert is accepted")
        }
        if((messageText).includes("Confirm")){
            consoleAlert.dismiss()
            console.log("alert is dismissed")
        }
        if(consoleAlert.type() === "prompt"){
            consoleAlert.accept("enter this text")
            console.log("promt text is entered")
        }
    })
    await alert.click()
    await confirm.click()
    await promt.click()
})

test.skip("handle windows", async ({ browser }) => {
    const contextPage = await browser.newContext()
    const page = await contextPage.newPage()
    await page.goto(urlData.windowsUrl)

    const[newTab] = await Promise.all(
        [
            contextPage.waitForEvent("page"),
            page.locator("(//a[contains(@href,'facebook')])[1]").click()
        ]

    )

    const newUrl = newTab.url()
    console.log(newUrl)
    expect(newUrl).toContain("facebook")
    await newTab.close()
    await page.waitForTimeout(10000)
    page.locator("(//a[contains(@href,'youtube')])[1]").click()
})
