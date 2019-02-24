const request = require('request');
      rp = require('request-promise');
      $ = require('cheerio');
      fs = require('fs');
      url = 'https://www.bankmega.com/promolainnya.php?product=0';

  rp(url)
    .then(function(html){
    const subcat = $('#subcatpromo > div', html).length;

    const data = [];
    const attr = [];
  //loop through sub categories
    for (var i = 1; i<=subcat; i++){
      let subcat = url+'&subcat='+i;
      rp(subcat)
      .then(function(html){
        const catName = $('#subcatselected > img', html)[0].attribs.title;

    //get paginations
        let pagination = $('#paging2', html).length + 1;

    // loop through pages
        for (var j = 1; j < pagination; j++){
        let pages = subcat+'&page='+j;
          rp(pages)
          .then(function(html){

            var promo = [];
            
            for(var k = 0; k < pagination; k++){
             
              var product = $('#imgClass', html)[k].attribs.title
                  imgurl = $('#imgClass', html)[k].attribs.src

              // get promotions details

                  promotions = $('#promolain > li > a', html)[k].attribs.href
                  promoUrl ='https://www.bankmega.com/'+promotions

                  rp(promoUrl)
                  .then(function(html){
                   
                    var area = $('.area > b', html).text()
                        periode = $('.periode > b', html).text()
                        keterangan = $('.keteranganinside > img', html)[0].attribs.src
                        
                        putData = {area: area, periode: periode, img: keterangan}
                        promo.push(putData)

                        details = {product: product, imgurl: imgurl, url: promoUrl, details: promo}

                        attr.push(details)
                        
                  }).catch(function(err){
                    //do nothing
                  })

            }
            

          let everything =JSON.stringify(data);
          fs.writeFile('solution.json', everything, err => {
            if(err) throw err;
            })

          }).catch(function(err){
            
          })
        }
        data.push({subcategory: catName, data: attr})
      })
    }
    })
    .catch(function(err){
      //handle error
      console.log('something went wrong')
  });