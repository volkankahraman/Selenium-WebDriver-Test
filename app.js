const {Builder, By, until} = require('selenium-webdriver');
const fetch = require('node-fetch');

var isLoaded = async function (url) {
    const response = await fetch(url, {
        method: 'HEAD'
    });
    return response.ok;
};
var ConvertToFloat = function(text){
    return parseFloat(text.replace('\n,','.'));
};
var AsyncForEach = async function (array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

(async function Tester() {
    //#region İlk Seneryo 
    let isPictureLoaded = true;
    let textElements= new Array();
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    await driver.get('https://www.vargonen.com/');
    let imgDivs = await driver.findElements(By.className("single"));
    await console.log("Resimler kontrol ediliyor.");
    await AsyncForEach(imgDivs, async (element) => {
        let img = await element.findElement(By.tagName("img"));
        let src = await img.getAttribute("src");
        let status = await isLoaded(src);
        await console.log(".");
        if(!status) {
            isPictureLoaded = false;
            return;
        }
    });
    if(isPictureLoaded)
        await console.log("Resimler Doğrulandı.");
    else
        await console.log("Resimler Yüklenmedi!");
    //#region İkinci Seneryo
    await driver.get('https://www.vargonen.com/domain/domain-sorgulama');
    await driver.findElement(By.id("domainName")).sendKeys("denemealanadiarama.com");
    await driver.findElement(By.xpath('//*[@id="DomainForm"]/div/div/button')).click();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="main"]/section/div[2]/div[2]/div/div/div[1]/div/div[2]/div[3]/button'))).click();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="main"]/section/div[2]/div[2]/div/div/div[1]/div/div[3]/div[3]/button'))).click();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="undefined-sticky-wrapper"]/div/div/div/div/div/div/div[2]/div/a'))).click();
    await driver.get('https://www.vargonen.com/sepet');
    textElements[0] = await driver.wait(until.elementLocated(By.xpath('//*[@id="main"]/section/div/div/div/div/div[1]/div/div[2]/div[3]/div/div[4]/div/div[1]/div/div[2]'))).getText();
    textElements[1] = await driver.wait(until.elementLocated(By.xpath('//*[@id="main"]/section/div/div/div/div/div[1]/div/div[2]/div[4]/div/div[4]/div/div[1]/div/div[2]'))).getText();
    textElements[2] = await driver.wait(until.elementLocated(By.xpath('//*[@id="undefined-sticky-wrapper"]/div/div[1]/div/div[3]/div[3]/div[2]/div'))).getText();
    let totalAmount = ConvertToFloat(textElements[0])+ConvertToFloat(textElements[1]);
    if(totalAmount == ConvertToFloat(textElements[2]))
        await console.log("Fiyatlar doğru hesaplandı.");
    else
        await console.log("Fiyat hesaplanmasında hata!");

})();