(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['followResult'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n                        <div class=\"row\" id=\"no_results\">\n                            <div class=\"col-md-12\">\n                                <h5>No Results</h5>\n                            </div>\n                        </div>\n                        ";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.data), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                        ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                            <div class=\"row\">\n                                <div class=\"col-md-11 col-sm-11 col-xs-10\">\n\n                                    <div class=\"media\">\n                                            <img src=\"";
  if (helper = helpers.picture) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.picture); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" class=\"media-object img-responsive pull-left img-circle\">\n                                            <h5>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h5>\n                                            \n                                        </div>\n                                </div>\n\n                                <div class=\"col-md-1 col-sm-1 col-xs-2\">\n\n                                ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isFollowing), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                                </div>\n                            </div>\n                            <div class=\"row divider\">\n                                <div class=\"col-sm-12 col-xs-12\">\n                                    <hr>\n                                </div>\n                            </div>\n                            ";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                                    <button type=\"submit\" class=\"btn btn-default pull-right follow\" uid=\"";
  if (helper = helpers.uid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.uid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">follow</button>\n                                ";
  return buffer;
  }

function program7(depth0,data) {
  
  
  return "\n\n                                ";
  }

  buffer += "                        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.none), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });
templates['friend'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n<li>\n    <div class=\"row\">\n        <div class=\"col-xs-9\">\n            <a href=\"/feed/";
  if (helper = helpers.uid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.uid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                <img src=\"";
  if (helper = helpers.picture) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.picture); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"img-circle\">\n                <span>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n            </a>\n        </div>\n        <div class=\"col-xs-3\">\n            <a class=\"glyphicon glyphicon-remove pull-right\" href=\"#\" data-id=\"";
  if (helper = helpers.uid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.uid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>\n        </div>\n    </div>\n</li>\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, (depth0 && depth0.people), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['newsItem'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                   <div class=\"row\">\n                                <div class=\"col-sm-10 col-xs-12 news-item\" data-id=\"";
  if (helper = helpers._id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0._id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n\n                                    <div class=\"media\">\n                                        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.picture), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                                        <a href=\"";
  if (helper = helpers.link) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.link); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\"><h4 class=\"media-heading\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4></a>\n                                        ";
  stack1 = helpers['if'].call(depth0, (depth1 && depth1.date), {hash:{},inverse:self.program(6, program6, data),fn:self.programWithDepth(4, program4, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                                        <p class=\"description\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n                                        <p>\n                                        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.hash), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                                        </p>\n                                    </div>\n                                </div>\n                                <div class=\"col-sm-2 col-xs-12\">\n                                    <ul class=\"push\">\n                                    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth1 && depth1.user)),stack1 == null || stack1 === false ? stack1 : stack1.facebook), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                                    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth1 && depth1.user)),stack1 == null || stack1 === false ? stack1 : stack1.twitter), {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n                                    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth1 && depth1.user)),stack1 == null || stack1 === false ? stack1 : stack1.tumblr), {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                                    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth1 && depth1.user)),stack1 == null || stack1 === false ? stack1 : stack1.hasEmail), {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                                        <li>\n                                            <button type=\"submit\" class=\"btn btn-success btn-post\">POST</button>\n                                        </li>\n                                    </ul>\n                                </div>\n                            </div>\n                            <div class=\"row divider\">\n                                <div class=\"col-sm-12 col-xs-12\">\n                                    <hr>\n                                </div>\n                            </div>\n                            ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                                            <a href=\"";
  if (helper = helpers.link) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.link); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\">\n                                                <div class=\"media_wrapper\">\n                                                    <img src=\"";
  if (helper = helpers.picture) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.picture); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" class=\"media-object img-rounded img-responsive pull-left\">\n                                                </div>\n                                            </a>\n                                        ";
  return buffer;
  }

function program4(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n                                            <p class=\"date\">"
    + escapeExpression(((stack1 = (depth1 && depth1.date)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n                                        ";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                                            <p class=\"date\">";
  if (helper = helpers.created_time) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.created_time); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n                                        ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "";
  buffer += "\n                                            <a href=\"/api/"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">#"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</a>,\n                                        ";
  return buffer;
  }

function program10(depth0,data) {
  
  
  return "\n                                        <li>\n                                            <input type=\"checkbox\" class=\"fb\">\n                                            <img src=\"/images/fb_icon.png\" alt=\"\">\n                                        </li>\n                                    ";
  }

function program12(depth0,data) {
  
  
  return "\n                                        <li>\n                                            <input type=\"checkbox\" class=\"tw\">\n                                            <img src=\"/images/twitter_icon.png\" alt=\"\">\n                                        </li>\n                                    ";
  }

function program14(depth0,data) {
  
  
  return "\n                                        <li>\n                                            <input type=\"checkbox\" class=\"tu\">\n                                            <img src=\"/images/tumblr_icon.png\" alt=\"\">\n                                        </li>\n                                    ";
  }

function program16(depth0,data) {
  
  
  return "\n                                        <li>\n                                            <input type=\"checkbox\" class=\"email\">\n                                            <img src=\"/images/email.png\" alt=\"\">\n                                        </li>\n                                     ";
  }

  buffer += "                  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.data), {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  return buffer;
  });
})();
