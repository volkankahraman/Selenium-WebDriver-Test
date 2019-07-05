const {Builder, By, until} = require('selenium-webdriver');
const fetch = require('node-fetch');

//node-fetch adlı kütüphane ile resimlerin headerının 200-400 aralığında yani yüklendiğini kontrol etmek için kullanılmıştır.
var isLoaded = async function (url) {
    const response = await fetch(url, {
        method: 'HEAD'
    });
    return response.ok;
};
var ConvertToFloat = function(text){
    return parseFloat(text.replace('\n,','.'));
};
//Foreach fonksiyonunu async olarak kullanabilmek için yazılmıştır.
var AsyncForEach = async function (array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

// Xpath stringleri
const  searchBtn = '//*[@id="DomainForm"]/div/div/button', 
    addBtn = '//*[@id="main"]/section/div[2]/div[2]/div/div/div[1]/div/div[2]/div[3]/button',
    addBtn2= '//*[@id="main"]/section/div[2]/div[2]/div/div/div[1]/div/div[3]/div[3]/button',
    goToCart = '//*[@id="undefined-sticky-wrapper"]/div/div/div/div/div/div/div[2]/div/a',
    firstPriceTxt = '//*[@id="main"]/section/div/div/div/div/div[1]/div/div[2]/div[3]/div/div[4]/div/div[1]/div/div[2]',
    secondPriceTxt = '//*[@id="main"]/section/div/div/div/div/div[1]/div/div[2]/div[4]/div/div[4]/div/div[1]/div/div[2]',
    totalPriceTxt = '//*[@id="undefined-sticky-wrapper"]/div/div[1]/div/div[3]/div[3]/div[2]/div';



(async function Tester() {
    //#region İlk Senaryo 
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

    //#region İkinci Senaryo
    await driver.get('https://www.vargonen.com/domain/domain-sorgulama');
    await driver.findElement(By.id("domainName")).sendKeys("denemealanadiarama.com");
    await driver.findElement(By.xpath(searchBtn)).click();
    await driver.wait(until.elementLocated(By.xpath(addBtn))).click();
    await driver.wait(until.elementLocated(By.xpath(addBtn2))).click();
    await driver.wait(until.elementLocated(By.xpath(goToCart))).click();
    await driver.get('https://www.vargonen.com/sepet');
    textElements[0] = await driver.wait(until.elementLocated(By.xpath(firstPriceTxt))).getText();
    textElements[1] = await driver.wait(until.elementLocated(By.xpath(secondPriceTxt))).getText();
    textElements[2] = await driver.wait(until.elementLocated(By.xpath(totalPriceTxt))).getText();
    let totalAmount = ConvertToFloat(textElements[0])+ConvertToFloat(textElements[1]);

    if(totalAmount == ConvertToFloat(textElements[2]))
        await console.log("Fiyatlar doğru hesaplandı.");
    else
        await console.log("Fiyat hesaplanmasında hata!");
        
    await driver.sleep(2000);
    await driver.close();
})();