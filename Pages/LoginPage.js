const { expect } = require("allure-playwright");

class LoginPage
{
 constructor(page)
 {
   const pagelocators= JSON.parse(JSON.stringify(require("../pageLocators.json")))
    this.page = page;
    this.username = pagelocators.username
    this.password = pagelocators.password
    this.signIn = pagelocators.signIn
    this.manageButton = pagelocators.manageButton
 }

 async loginToApplication(user, pass) {
    await this.page.fill(this.username,user)
    await this.page.getByPlaceholder(this.password).fill(pass)
    await this.page.locator(this.signIn).click()

 }
async verifyDashboard(){
   const manage = await this.page.locator(this.manageButton)
   await expect(manage).toBeVisible()
}

}
module.exports = LoginPage;