const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fetch = require('node-fetch');
var http = require('http');

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

(async function Tester() {
    //#region İlk Senaryo 
    let isPictureLoaded = true;
    

    let options = new chrome.Options();
    //Below arguments are critical for Heroku deployment
    options.addArguments("--headless");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();


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
    await http.createServer(function (req, res) {
        if(isPictureLoaded)
            res.write("Resimler Dogrulandi.");
        else
            res.write("Resimler Yuklenmedi!");
        res.end(); //end the response
      }).listen(process.env.PORT);
      console.log(process.env.PORT+ ' portundan dinleniyor.');
    
})();