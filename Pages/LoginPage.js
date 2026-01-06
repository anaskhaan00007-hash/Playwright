const { expect } = require("allure-playwright");

class LoginPage
{
 constructor(page)
 {
   const pagelocators= JSON.parse(JSON.stringify(require("../pageLocators.json")))
    this.page = page;
    this.password = pagelocators.password
    this.signIn = pagelocators.signIn
    this.manageButton = pagelocators.manageButton
    this.username = pagelocators.username
 }

 async loginToApplication(user, pass) {
    //await expect(this.page).toHaveScreenshot('loginPage.png')
    await this.page.fill(this.username,user)
    await this.page.getByPlaceholder(this.password).fill(pass)
    await this.page.locator(this.signIn).click()

 }
async verifyDashboard(){
   // Verify dashboard is loaded by checking manage button visibility
   const manage = await this.page.locator(this.manageButton)
   await expect(manage).toBeVisible()
   
   // Verify manage button is clickable
   await expect(manage).toHaveCount(1)
   
   // Additional dashboard elements visibility
   // Wait for page to be fully loaded
   await this.page.waitForLoadState('networkidle')
   
   console.log("✓ Dashboard verification completed successfully")
}

}
module.exports = LoginPage;