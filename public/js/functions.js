(function($) { // reset V17e's noConflict
    'use strict';

    window.Newsists = window.Newsists || {};

    Newsists.uastring = window.navigator.userAgent.toLowerCase();
    Newsists.isMobile = (/iPhone|iPod|iPad|Android|BlackBerry/i).test(Newsists.uastring) || window.innerWidth <= 640;
    Newsists.isSafari = (Newsists.uastring.indexOf('safari') > 0) && (Newsists.uastring.indexOf('chrome') < 1); // safari on all devices incorrectly reports html5 form validation support
    Newsists.Index = function() {


        this.init();
    };

    Newsists.Index.prototype = {



        init: function() {


            var that = this;
            var FB_ID = "1428610680728334";
            var URL_REG_EX = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
            this.EMAIL_ERROR = "invalid email!!";
            this.POST_ERROR = "There was an Error posting to [SERVICE] please try again";
            this.results_container = $("#follow_results");
            this.feed_container = $("#feed");
            this.sideNav = $("#sidebar ul");
            this.pageId = $("body").attr("id");
            this.modal = $("#mainModal");
            this.loadingModal = $("#loadingModal");
            this.shareModal = $("#share_modal");

            var path = document.location.pathname.split("/");

            console.log(that);

            $.ajaxSetup({
                cache: true
            });
            $.getScript('//connect.facebook.net/en_UK/all.js', function() {
                FB.init({
                    appId: FB_ID,
                });
                FB.getLoginStatus(that.updateStatusCallback);
            });

            if (path[1] == "feed" || path[1] == "search") {
                this.loadData("/api/get_friends", null, "GET", function(response) {
                    console.log(response);

                    that.sideNav.append(that.createTemplate("friend", response));

                    $.each($(".col-xs-9 a", that.sideNav), function(index, val) {
                        var href = $(val).attr("href");
                        var index = href.lastIndexOf("/");
                        var substr = href.substring(index + 1);
                        if (substr == that.pageId) {
                            $(this).closest('li').addClass("active");
                            return;
                        }

                    });
                    that.enableRemove();
                });
            } else {
                $(".header_tools").remove();
            }


            $(".btn-add", this.feed_container).click(function(event) {
                event.preventDefault();
                var articleId = $(this).closest('.row').find(".news-item").data("id");

                that.addArticleId(articleId);

            });

            $(".get_friends_byId").click(function(event) {
                event.preventDefault();
                var info = {
                    uid: that.pageId
                };


                that.search_friends(info);

            });

            $(".glyphicon.glyphicon-envelope").click(function(e){
                e.preventDefault();
                document.location = "mailto:rwill59@gmail.com";

            });



            $(".search_hash").click(function(event) {
                event.preventDefault();

                if ($(".hash_field").val() != "") {

                    var searchTerm = $(".hash_field").val();
                    if ($(".hash_field").val().indexOf("#") != -1) {
                        searchTerm = searchTerm.substring(1);
                    }
                     document.location = "/search/" + searchTerm;
                    // document.location = "/search/" + searchTerm + "?uid=" + $("body").attr("id");

                } else {

                    alert("hash box is empty");
                }
            });


            $(".search_friends").click(function(event) {

                if ($("#friend_field").val() != "") {
                    event.preventDefault();

                    var info = {
                        name: $("#friend_field").val()
                    };

                    that.search_friends(info);

                } else {
                    alert("search box is empty");
                }
            });

            $(".scrape").click(function(event) {
                event.preventDefault();
                $(".remove_modal", that.modal).hide();
                $("#mainModal .add_modal", that.modal).show();
                that.modal.modal('show');
                $("#siteURL", that.modal).removeClass('form_error');
                $(".error_txt", that.modal).hide();

            });


            $(".addItem").click(function(event) {
                event.preventDefault();
                var url = $("#siteURL").val();
                var hashTags = that.checkHash($("#hashTags").val());

                if (URL_REG_EX.test(url)) {
                    var info = {
                        url: url,
                        hash: hashTags
                    };
                    that.loadData('/api/scrape', info, 'POST', function(response) {

                        if (response.data.status == "error") {
                            var error_txt;
                            if (response.data.type == "error-image") {
                                error_txt = "url can not be an image";
                            } else {
                                error_txt = "invalid url";

                            }
                            $("#siteURL", that.modal).addClass('form_error');
                            $(".error_txt", that.modal).text(error_txt);
                            $(".error_txt", that.modal).show();
                        } else {
                            that.modal.modal('hide');
                            that.feed_container.prepend(that.createTemplate("newsItem", response));
                            that.enableShare();
                        }
                    });
                } else {
                    alert("please enter a valid url");
                }
            });
            that.enableShare();
            if(path[1] == "search" || path[1] == "feed"){

                that.enableScroll(path[1]);
            }
        },

        enableScroll: function(page){
            var that = this;
            $("#main").bind("scroll", function(){
                // console.log($("#main").scrollTop(), $("#feed").height() - $("#main").height() )
                if ($("#main").scrollTop() >= $("#feed").height() - $("#main").height()) {
                    $("#main").unbind("scroll");
                    console.log("load more");
                    if(page == "search"){
                        that.loadData('/api/hash_page', null, 'GET', function(response) {
                            that.feed_container.append(that.createTemplate("newsItem", response));
                            that.enableShare();
                            if(response.data.length != 0){

                                that.enableScroll();
                            }
                            console.log(response);
                        });
                    }else{
                        console.log("got here");
                        that.loadData('/api/feed_page', null, 'GET', function(response) {
                            that.feed_container.append(that.createTemplate("newsItem", response));
                            that.enableShare();
                            if(response.data.length != 0){

                                that.enableScroll();
                            }
                            console.log(response);
                        });
                    }
                }
            });
        },

        enableShare: function() {

            var that = this;
            $(".btn-post").click(function(event) {
                $(".modal-footer button").show();
                $(".glyphicon-ok", that.shareModal).hide();
                $(".form-group", that.shareModal).removeClass("success");
                $("ul li", that.shareModal).hide();
                $("#email_field", that.shareModal).closest('p').show();
                $(".error_txt", that.shareModal).hide();
                $(".submit_share", that.shareModal).unbind('click');
                var checkBoxes = $("input", $(this).closest('ul'));
                var parent = $(this).closest('.row');
                var checked = new Array();
                var message = {
                    description: $("p.description", parent).text(),
                    title: $("h4", parent).text(),
                    image: $("img", parent).attr("src"),
                    link: $("a:first-child", parent).attr("href"),
                    id: $(".news-item", parent).data("id"),
                };

                var info = {
                    item: message,
                    services: checked
                };

                $.each(checkBoxes, function(index, val) {
                    if ($(val).is(":checked")) {
                        checked.push($(val).attr("class"));
                    }
                });

                if (checked.length == 0) {
                    alert("please select at least one item");
                } else {

                    $.each(checked, function(index, val) {
                        $("ul li." + val, that.shareModal).show();
                    });

                    var isEmail = (checked.indexOf("email") == -1) ? false : true;

                    if (!isEmail) {
                        $("ul", that.shareModal).addClass('no_pad');
                        $("#email_field", that.shareModal).closest("p").hide();
                        that.shareReady(info, isEmail);
                    } else {
                        $("ul", that.shareModal).removeClass('no_pad');
                        that.loadData('/api/getEmailAddress', {}, 'GET', function(response) {
                            
                            $.each(response, function(index, val) {
                                 $("#email_select", that.shareModal).append("<option value='" + val + "'>" + val + "</option>");
                            });
                            that.shareReady(info, isEmail, response);
                        });
                    }

                }
            });
        },

        shareReady: function(info, isEmail, addys) {
            var that = this;
            $(".share_title", that.shareModal).html(info.item.title);


            $(".submit_share", that.shareModal).bind("click", function(event) {

                if (isEmail) {

                    var validEmail = that.validateEmail($("#email_field", that.shareModal).val());
                    if (!validEmail) {
                        $(".error_txt", that.shareModal).html(that.EMAIL_ERROR);
                        $(".error_txt", that.shareModal).show();
                    } else {
                        $(".error_txt", that.shareModal).hide();
                        info.item.to = $("#email_field", that.shareModal).val();
                        info.item.from = $("#email_select", that.shareModal).val();
                        that.sharePost(info);
                        //submit
                    }

                } else {
                    //submit
                    that.sharePost(info);
                }
            });
            that.shareModal.modal("show");

        },

        sharePost: function(info) {

            var that = this;

            $(".modal-footer button").show();
            this.loadData('/api/share_post', info, 'POST', function(response) {
                // that.shareModal.modal("hide");
                var baseStr = "There was an Error posting to [SERVICE] please try again";
                var str = "";
                $.each(response, function(index, val) {
                    if (val.status == "error") {
                        str += that.POST_ERROR.replace("[SERVICE]", val.service) + "<br/>";
                    }
                });

                if (str.length > 0) {
                    $(".error_txt", that.shareModal).html(str);
                    $(".error_txt", that.shareModal).show();
                } else {
                    $(".form-group", that.shareModal).addClass("success");
                    $(".glyphicon-ok", that.shareModal).css({
                        "display": "inline-block"
                    });
                    $(".modal-footer button").hide();
                    $("#email_field", that.shareModal).closest("p").hide();
                    setTimeout(function() {
                        that.shareModal.modal('hide');
                    }, 1000);
                }



                console.log(str);

            });

        },



        addArticleId: function(id) {

            this.loadData("/api/add_article_by_id", {
                "id": id
            }, 'POST', function(response) {
                console.log(response);
            });
        },

        add_friend: function(uid) {


            var that = this;

            var info = {
                id: uid
            };

            this.loadData('/api/add_friend', info, 'POST', function(response) {
                that.sortFriends();
                console.log(response);
                that.sideNav.append(that.createTemplate("friend", response));
                that.enableRemove();

            });

        },

        search_friends: function(info) {
            console.log(info);

            var that = this;
            this.loadData('/api/search_friends', info, 'POST', function(response) {

                console.log(response);

                that.results_container.html("");
                that.results_container.show();
                that.feed_container.hide();
                console.log(response);

                that.results_container.append(that.createTemplate("followResult", response));
                if (response.data.length > 0) {
                    
                    $(".follow", that.results_container).bind("click", function(evt) {
                        evt.preventDefault();
                        $(this).hide();
                        that.add_friend($(this).attr("uid"));
                    });
                }
            });
        },

        remove_friend: function(obj) {
            var that = this;
            $(".remove_modal", this.modal).show();
            $(".add_modal", this.modal).hide();
            $(".remove_modal .modal-body h5", this.modal).text("Are you sure you would like to remove " + obj.name);
            this.modal.modal('show');
            $('.remove_modal button.removeBtn', this.modal).click(function(e) {
                e.preventDefault();
                var info = {
                    id: obj.uid
                };
                that.loadData('/api/remove_friend', info, 'POST', function(response) {
                    that.modal.modal('hide');
                    obj.item.remove();
                    console.log(response);
                });

            });
            console.log("remove", obj);

        },

        enableRemove: function() {
            var that = this;

            $("#sidebar ul a.glyphicon-remove").on("click", function(event) {
                event.preventDefault();
                var row = $(this).closest('.row');
                var name = $(".col-xs-9 span", row).text();
                var obj = {
                    item: $(this).closest('li'),
                    name: name,
                    uid: $(this).data("id")
                };

                that.remove_friend(obj);

            });
        },

        sortFriends: function() {

        },

        createTemplate: function(tempName, data) {
            var template = Handlebars.templates[tempName];
            var context = data;

            var html = template(context);

            return html;
        },

        loadData: function(path, obj, method, func) {
            // $("#loadingModal").modal("show")
            $.ajax({
                url: path,
                type: method,
                data: obj,
                dataType: 'JSON'
            })
                .done(function(response) {
                    // $("#loadingModal").modal("hide")
                    func(response);
                })
                .fail(function(err) {
                    console.log("error", err);
                });
        },

        checkHash: function(tags) {

            tags = tags.replace(/,/g, "");
            tags = tags.split(" ");

            var str = "";
            if (tags.length > 0) {

                $.each(tags, function(index, val) {
                    if (val.length > 2) {

                        if (val.indexOf("#") != -1) {

                            str += val.replace("#", "").toLowerCase() + ",";
                            // finalTags.push(val)
                        }
                    }

                });
            }

            return str;
        },

        validateEmail: function(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        updateStatusCallback: function(data) {
            console.log(data);
            // FB.api('/me/picture', function(response) {
            //     $("#sidebar ul li:first-child a img").attr("src", response.data.url);

            // });

            // console.log(data)
        }
    };
}(jQuery));