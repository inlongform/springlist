var request   = require('request');
var cheerio   = require('cheerio');
var Constants = require('../config/constants');




function Scraper(queries, emitter) {

    this.queries = queries;
    this.emitter = emitter;


}
// class methods


Scraper.prototype.scrape = function(user, url, hash) {

    console.log("url", url)


    var that = this;
    var URL_REG_EX = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    var IMG_REG_EX = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
    var placeholder = "";



     if (!IMG_REG_EX.test(url)) {

        request(url, function(error, response, html) {


            console.log("status", response.statusCode)

            if (!error) {
                //invalid url
                if (response.statusCode == 404) {
                    that.emitter.emit(Constants.SCRAPE_COMPLETE, {
                        "status": "error",
                        "type": "invalid_url"
                    });
                }else if(response.statusCode == 401){
                    that.emitter.emit(Constants.SCRAPE_COMPLETE, {
                        "status": "error",
                        "type": "unauthorized"
                    });
                }else if (response.statusCode == 200) {

                    var siteData = {
                        name: "",
                        description: "",
                        link: "",
                        created_time: new Date(),
                        picture: "",
                        hash: hash

                    }
                    var $ = cheerio.load(html);


                    siteData.name = $("title").text();


                    $("meta").filter(function() {

                        var data = $(this);
                        // if (data.attr().name == "title") {
                        //     siteData.name = data.attr().content;
                        // }

                        // console.log(data.attr().name, data.attr().content)

                        if (data.attr().name == "description") {
                            siteData.description = data.attr().content;
                        }

                        if(siteData.description == ""){
                            if (data.attr().property == "og:description") {
                                siteData.description = data.attr().content;
                            }
                        }

                        if(data.attr().property == "og:title"){
                            siteData.name = data.attr().content;
                        }

                        if (data.attr().property == "og:image") {
                            if (URL_REG_EX.test(data.attr().content)) {
                                siteData.picture = data.attr().content;
                            } else {
                                siteData.picture = placeholder;
                            }
                        }

                    })

                    $("link").filter(function() {
                        var data = $(this);

                        if (data.attr().rel == "canonical") {
                            siteData.link = data.attr().href;
                        } else {
                            siteData.link = url;
                        }
                    })

                    if (siteData.picture == "") {
                        siteData.picture = placeholder;
                    }
                    // console.log("////////////////")
                    // console.log(siteData)


                    that.queries.addNewsItem(user, siteData)
                }
            } else {
                //load error
                that.emitter.emit(Constants.SCRAPE_COMPLETE, {
                    "status": "error",
                    "type": "error"
                });

            }

        })
    } else {
        console.log("is image")
        that.emitter.emit(Constants.SCRAPE_COMPLETE, {
            "status": "error",
            "type": "error-image"
        });

    }
}






// export the class
module.exports = Scraper;