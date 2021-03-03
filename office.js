const {Builder, By, Key, until} = require('selenium-webdriver');
let Office = async function Offce(data) {
    let driver = await new Builder().forBrowser('chrome').build();
    try {

        // Creating new User 
        await driver.get('https://admin.microsoft.com/Adminportal/Home?source=applauncher#/users/:/adduser');
        await driver.manage().window().maximize()
        await driver.manage().setTimeouts( { implicit: 65000 } );
        await driver.findElement(By.css('input[data-automation-id="AddUserWizard_firstName"]')).sendKeys(data.first_name);
        await driver.findElement(By.css('input[data-automation-id="AddUserWizard_lastName"]')).sendKeys(data.last_name);
        await driver.findElement(By.css('input[data-automation-id="AddUserWizard_displayName"]')).sendKeys('');
        await driver.findElement(By.css('input[data-automation-id="AddUserWizard_userName"]')).sendKeys(data.computer_user);
        let isAutoPassOn = await (await driver.findElement(By.css('input[aria-label="Automatically create a password"]'))).isSelected()
        console.log(isAutoPassOn);
        if(isAutoPassOn === true){
          await (await driver.findElement(By.xpath("//*[text()='Automatically create a password']"))).click();
        }
        isAutoPassOn = await driver.findElement(By.css('input[aria-label="Automatically create a password"]')).isSelected()
        console.log(isAutoPassOn);
        await driver.findElement(By.css('input[data-automation-id="AddUserWizard_password"]')).sendKeys(data.office_password);
        await driver.sleep(5000)
        await (await driver.findElement(By.css('button[data-automation-id="addUserWizardNextBtn"]'))).click();
        await (await driver.findElement(By.css('div[data-automation-id="LicenseText_Microsoft 365 Business Basic"]'))).click();
        await (await driver.findElement(By.css('button[data-automation-id="addUserWizardNextBtn"]'))).click();
        await (await driver.findElement(By.css('button[data-automation-id="addUserWizardNextBtn"]'))).click();
        await (await driver.findElement(By.css('button[data-automation-id="addUserWizardNextBtn"]'))).click();


        // Adding user info
        await driver.manage().setTimeouts( { implicit: 60000 } );
        await driver.get('https://admin.microsoft.com/Adminportal/Home?source=applauncher#/users')
        await driver.manage().setTimeouts( { implicit: 60000 } );
        await driver.findElement(By.css('input[data-automation-id="UserListV2,CommandBarSearchInputBox"]')).sendKeys(`${data.office_user}\n`);
        await driver.sleep(5000)
        await driver.findElement(By.css('input[data-automation-id="UserListV2,CommandBarSearchInputBox"]')).sendKeys(Key.RETURN);
        await (await driver.findElement(By.css('div[data-automationid="DetailsRow"]'))).click();
        await (await driver.findElement(By.css('button[data-automation-id="UserDetailPanelRegion,ChangeUserPhotoLinkLink"]'))).click();
        await (await driver.findElement(By.css('button[data-automation-id="UserDetailPanelRegion,EditContactInformationLink"]'))).click();
        await driver.findElement(By.css('input[data-automation-id="jobTitle"]')).sendKeys(data.job_title);
        await driver.findElement(By.css('input[data-automation-id="department"]')).sendKeys(data.department);
        if(data.job_title == 'Case Manager'){
          let phoneNumberFormat = data.direct_number.match(/^(\d{3})(\d{3})(\d{4})$/)
          phoneNumberFormat = `(${phoneNumberFormat[1]})${phoneNumberFormat[2]}-${phoneNumberFormat[3]}`
          await driver.findElement(By.css('input[data-automation-id="officePhone"]')).sendKeys(phoneNumberFormat);
        } else {
          await driver.findElement(By.css('input[data-automation-id="officePhone"]')).sendKeys('(312)620-7777');
        }
        await driver.findElement(By.css('input[data-automation-id="faxNumber"]')).sendKeys('(888)270-8983');
        await (await driver.findElement(By.css('button[data-automation-id="UserDetailPanelRegion,contactDetailPanelPrimaryButtonDetailsPanelV2"]'))).click();


        // Adding user Distributions Lists
        await driver.manage().setTimeouts( { implicit: 60000 } );
        await driver.get('https://admin.microsoft.com/Adminportal/Home?source=applauncher#/users')
        await driver.manage().setTimeouts( { implicit: 60000 } );
        await driver.sleep(5000)
        await driver.findElement(By.css('input[data-automation-id="UserListV2,CommandBarSearchInputBox"]')).sendKeys(Key.RETURN);
        await (await driver.findElement(By.css('div[data-automationid="DetailsRow"]'))).click();
        await driver.findElement(By.css('button[data-automation-id="UserDetailPanelRegion,ChangeUserPhotoLinkLink"]'))
        await (await driver.findElement(By.css('button[data-automation-id="UserDetailPanelRegion,ManageGroupsLink"]'))).click();
        let distroName
        let activeDistro = Object.keys(data).filter(key => key.startsWith('dist_'));

        for (const element of activeDistro) {
          await driver.sleep(10000)
          await driver.findElement(By.css('button[data-automation-id="UserDetailPanelRegion,manageGroupsPanelV2Region,selectionlistAddCommandBarButton"]'))
          await (await driver.findElement(By.css('button[data-automation-id="UserDetailPanelRegion,manageGroupsPanelV2Region,selectionlistAddCommandBarButton"]'))).click();  
          distroName = element.replace('dist_', '').replace(/_/g, ' ');
          for (let index = 0; index < 30; index++) {
            await driver.findElement(By.css('input[aria-label="Search for a group"]')).sendKeys(Key.BACK_SPACE);
          }
          await driver.sleep(2000)
          await driver.findElement(By.css('input[aria-label="Search for a group"]')).sendKeys(distroName);
          await driver.sleep(1000)
          await driver.findElement(By.css('input[aria-label="Search for a group"]')).sendKeys(Key.RETURN);
          await driver.sleep(1000)
          await  (await driver.findElement(By.xpath("//*[text()='" + distroName + "']"))).click();
          await (await driver.findElement(By.css('.ms-Stack > button.ms-Button--primary'))).click();
        }
        // await driver.findElement(By.css('input[aria-label="Search for a group"]')).sendKeys(distroName);
        // await driver.sleep(1000)
        // await driver.findElement(By.css('input[aria-label="Search for a group"]')).sendKeys(Key.RETURN);
        // await  (await driver.findElement(By.xpath("//*[text()='" + distroName + "']"))).click();

        await driver.manage().setTimeouts( { implicit: 60000 } );
        await driver.findElement(By.name('first_name')).sendKeys(data.first_name);



        // Adding Teams

        await driver.manage().setTimeouts( { implicit: 60000 } );
        await driver.findElement(By.name('confirms_new_sspasswordss'));
        

    } catch(err) {
        console.log(err)
        await driver.quit();
    }
};
module.exports = Office;