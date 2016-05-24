var page = require('webpage').create();
page.open('https://pipl.com/search/?q=Nathan+Chackerian&l=&sloc=&in=5', function() {
  page.render('page.png');

  console.log(page.evaluate(function () {
            return $(".profile_result");
        }));


  phantom.exit();
});