const {Builder, By, Key, until} = require('selenium-webdriver');
let Sugar = async function Sugar(data) {
    let driver = await new Builder().forBrowser('chrome').build();
    try {

        // Creating new User 
        await driver.get('https://sugar.consumerlaw.com/#bwc/index.php?module=Users&action=EditView');
        await driver.manage().window().maximize()
        await driver.manage().setTimeouts( { implicit: 30000 } );
        await driver.findElement(By.id("bwc-frame"));
        await driver.switchTo().frame(0)
        await driver.findElement(By.name('user_name')).sendKeys(data.sugar_user);
        await driver.findElement(By.name('first_name')).sendKeys(data.first_name);
        await driver.findElement(By.name('last_name')).sendKeys(data.last_name);
        await driver.findElement(By.name('phone_ext_c')).sendKeys(data.extension);
        await driver.findElement(By.name('department')).sendKeys(data.department);
        await driver.findElement(By.name('sms_number_c')).sendKeys(data.direct_number);
        await driver.findElement(By.name('Users0emailAddress0')).sendKeys(data.office_user);
        await (await driver.findElement(By.id('tab2'))).click()
        await driver.findElement(By.name('new_password')).sendKeys(data.sugar_password);
        await driver.findElement(By.name('confirm_new_password')).sendKeys(data.sugar_password);
        await driver.manage().setTimeouts( { implicit: 30000 } );
        await (await driver.findElement(By.id('SAVE_FOOTER'))).click()
        await (await driver.findElement(By.className('container-close'))).click()


        // Adding Can Delete Role
        await driver.manage().setTimeouts( { implicit: 60000 } );
        await (await driver.findElement(By.id('tab3'))).click()
        await (await driver.findElement(By.id('acl_roles_users_select_button'))).click()
        let windowsHandles = await driver.getAllWindowHandles()
        let currentWindowHandles = await driver.getWindowHandle()
        console.log(windowsHandles);
        console.log(currentWindowHandles);
        windowsHandles.forEach(el => {
            if(el != currentWindowHandles){
                driver.switchTo().window(`${el}`)
            }
        })
        await driver.manage().setTimeouts( { implicit: 60000 } );
        await driver.findElement(By.name('name_advanced')).sendKeys('Cant Delete - Export - Import - MassUpdate');
        await (await driver.findElement(By.id('search_form_submit'))).click()
        await (await driver.findElement(By.partialLinkText('Cant Delete - Export - Import - MassUpdate'))).click()
        await driver.switchTo().window(`${currentWindowHandles}`)

        // Adding Teams

        await driver.manage().setTimeouts( { implicit: 60000 } );
        await driver.findElement(By.name('confirms_new_sspasswordss'));
        

    } catch(err) {
        console.log(err)
        await driver.quit();
    }
};
module.exports = Sugar;