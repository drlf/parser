var cheerio = require('cheerio'),
    $ = cheerio.load('<h2 class = "title">Hello world</h2>fsdkjfdsjg');
    $ = $('h2');
/*    $('h2.title').text('Hello there!');
$('h2').addClass('welcome');
$('h2.title').remove();*/
console.log($.html());