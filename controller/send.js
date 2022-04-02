const reader = require('xlsx');
const puppeteer = require('puppeteer');
const bodyparser = require('body-parser');
const res = require('express/lib/response');
var statusFlag = [];

var myFun = (async(data,config,loginPage,URL,req,res) => {

    
    puppeteer.launch(config.launchOption).then(async browser =>{

    try{
        for(let d=0; d<data.length;d++){        
            var username = data[d].username;
            var pwd = data[d].pwd;
            var btnId = data[d].buttonId;
            console.log(btnId);
            
            const page = await browser.newPage();
            var flag = 'NO';
            var CoupenButton;
            
            await page.goto(URL);
            // await page.goto('https://www.tomthumb.com/justforu/coupons-deals.html');
            await page.type(loginPage.email, username);
            await page.type(loginPage.password, pwd);
            await page.click(loginPage.loginButton);
    
            // Correct Method
            await page.waitForSelector(`#${btnId}`).then(() => {
                CoupenButton = `button[id= ${btnId}]`
                // await CoupenButton.click();
                // console.log(CoupenButton);
                flag = 'YES';
                statusFlag.push(flag);
                console.log('YES');
            }).catch(e => {
                statusFlag.push(flag);
                console.log('NO');
            });
    
            if(flag=='YES'){
                await page.click(CoupenButton);
            }
    
            const signout_logo1 = await page.waitForSelector(".account-icon");
            signout_logo1.click();
    
            const [button1] = await page.$x("//a[contains(., 'Sign Out')]");
            if (button1) {
                await button1.click()
            }

            await page.waitForNavigation();
            
            await page.close();
        }
        
        console.log(statusFlag);
    
        res.status(200).json({
            status: 'Success',
            message: 'Token sent to email',
            data: statusFlag
        });
    }catch(err){
        res.json({
            status: 'Failed',
            message: 'Something went wrong',
            data: err
        });
    }
    });
    
});

exports.check = (async(req,res,next) => {

    const file = reader.readFile(req.file.path);
    let data = []
    const sheets = file.SheetNames;

    console.log(req.body.url);
    let URL = req.body.url;

    for(let i = 0; i < sheets.length; i++)
    {
        var temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);

        temp.forEach((res) => {
            data.push(res)
        });
    }
    console.log(data);

    let config = {
        launchOption: {
            headless: false,
            args: ["--no-sandbox",'--disable-setuid-sandbox']
        }
    }

    // //locators
    const loginPage = {
        email: 'input[id="label-email"]',
        password: 'input[id="label-password"]',
        loginButton: 'input[id="btnSignIn"]',
    }

    // await myFun(data,config,loginPage);
    
    await myFun(data,config,loginPage,URL,req,res);
    
    // await res.json({status: 'OK', data: statusFlag});
});