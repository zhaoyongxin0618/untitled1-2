/**
 * Created by kingdee on 2016/6/21.
 */
"use strict";

require("./public/javascripts/setup");

var wd = require("wd"),
    _ = require('underscore'),
    assert=require('assert'),
    Q = require('q'),
    actions = require("./public/javascripts/actions"),
    serverConfigs = require('./public/javascripts/appium-servers'),
    logindata=require("./public/javascripts/login-data");
wd.addPromiseChainMethod('swipe', actions.swipe);
describe("android webview", function () {
    this.timeout(4000000);
    var driver;
    var allPassed = true;

        before(function () {
            var serverConfig = process.env.npm_package_config_sauce ?
                serverConfigs.sauce : serverConfigs.local;
            driver = wd.promiseChainRemote(serverConfig);
            require("./public/javascripts/logging").configure(driver);

            var desired = process.env.npm_package_config_sauce ?
                _.clone(require("./public/javascripts/caps").android18) :
                _.clone(require("./public/javascripts/caps").android19);
            //desired.app = require("./public/javascripts/apps").selendroidTestApp;
            if (process.env.npm_package_config_sauce) {
                desired.name = 'yzj - login';
                desired.tags = ['sample'];
            }
            return driver
                .init(desired)
                .setImplicitWaitTimeout(40000);
        });

    after(function () {
        return driver
            .quit()
            .finally(function () {
                if (process.env.npm_package_config_sauce) {
                    return driver.sauceJobStatus(allPassed);
                }
            });
    });

    afterEach(function () {
        allPassed = allPassed && this.currentTest.state === 'passed';
    });

    it("login app", function () {

        function findTouchPaint() {
            return driver
                .elementById('com.kdweibo.client:id/tv_title')
                .catch(function () {
                    console.log('登陆失败');
                    return driver
                        .back().sleep(1000)
                        .back().back();
                });

        }

        return driver
            .elementById('com.kdweibo.client:id/login')
            .click()
            .elementById('com.kdweibo.client:id/reg_phone_number')
            .clear()
            .sendKeys(logindata.data.username)
            .elementById('com.kdweibo.client:id/inputPassword')
            .clear()
            .sendKeys(logindata.data.password)
            .elementById('com.kdweibo.client:id/btn_login_next')
            .click()
            .then(findTouchPaint)
            .elementById('com.kdweibo.client:id/btn_right').click();
    });
    it("look message", function () {
        function lookAllMessage() {
            return driver.setImplicitWaitTimeout(10000)
                .elementsByClassName('android.widget.TextView')
                .then(function (els) {
                    return Q.all([
                        els[els.length-8].getLocation(),
                        els[0].getLocation()
                    ]).then(function (locs) {
                        return driver.swipe({
                            startX: locs[0].x, startY: locs[0].y,
                            endX: locs[1].x, endY: locs[1].y,
                            duration: 800
                        });
                    });
                }).elementByXPath('//android.widget.TextView[@text=\'文件传输助手\']')
                .catch(function () {
                    return lookAllMessage();
                });
        }

        return driver
            .elementByXPath('//android.widget.TextView[@text=\'消息\']')
            .then(lookAllMessage)
            .click()
            .sleep(10000)
            .back().catch(function(){
                console.log('look message fail');
                return driver.back();
            });

    });
    it("send message", function () {
        function sendMessage() {
            return driver
                .elementsByClassName('android.widget.TextView')
                .then(function (els) {
                    return Q.all([
                        els[els.length-8].getLocation(),
                        els[0].getLocation()
                    ]).then(function (locs) {
                        return driver.swipe({
                            startX: locs[0].x, startY: locs[0].y,
                            endX: locs[1].x, endY: locs[1].y,
                            duration: 800
                        });
                    });
                }).elementByXPath('//android.widget.TextView[@text=\'赵永鑫\']')
                .catch(function () {
                    return sendMessage();
                });
        }

        return driver
            .elementByXPath('//android.widget.TextView[@text=\'通讯录\']')
            .click()
            .then(sendMessage)
            .click()
            .sleep(1000)
            .elementById('com.kdweibo.client:id/sendMessage_btn')
            .click()
            .elementById('com.kdweibo.client:id/chat_bottom_edit_input')
            .click()
            .clear()
            .sendKeys('中文')
            .elementById('com.kdweibo.client:id/chat_bottom_btn_send')
            .click()
            .elementById('com.kdweibo.client:id/chat_bottom_btn_more')
            .click()
            .elementsByClassName('android.widget.RelativeLayout')
            .then(function(els){
              return els[els.length-8];
            })
            .click()
            .elementsByClassName('android.widget.CheckBox')
            .then(function(els){
                return els[0].click();
            })
            .elementById('com.kdweibo.client:id/btn_right')
            .click()
            .sleep(10000).back()
            .catch(function(){
                console.log('send message fail');
                return driver.back();
            });


    });
    it("send emoji", function () {
        function sendMessage() {
            return driver
                .elementsByClassName('android.widget.TextView')
                .then(function (els) {
                    return Q.all([
                        els[els.length-8].getLocation(),
                        els[0].getLocation()
                    ]).then(function (locs) {
                        return driver.swipe({
                            startX: locs[0].x, startY: locs[0].y,
                            endX: locs[1].x, endY: locs[1].y,
                            duration: 800
                        });
                    });
                }).elementByXPath('//android.widget.TextView[@text=\'赵永鑫\']')
                .catch(function () {
                    return sendMessage();
                });
        }
        function sendEmoji() {
            return driver.setImplicitWaitTimeout(10000)
                .elementsByClassName('android.widget.ImageView')
                .then(function (els) {
                    return Q.all([
                        els[els.length-11].getLocation(),
                        els[els.length-17].getLocation()
                    ]).then(function (locs) {
                        return driver.swipe({
                            startX: locs[0].x, startY: locs[0].y,
                            endX: locs[1].x, endY: locs[1].y,
                            duration: 800
                        });
                    });
                })
                .elementsByClassName('android.widget.ImageView')
                .then(function(els){
                    return els[els.length-15];
                })
                .click()
                .elementById('com.kdweibo.client:id/chat_bottom_btn_send')
                .click()
                .catch(function(){
                    console.log('not find send button');
                });
        }

        return driver
            .elementByXPath('//android.widget.TextView[@text=\'通讯录\']')
            .click()
            .then(sendMessage)
            .click()
            .sleep(1000)
            .elementById('com.kdweibo.client:id/sendMessage_btn')
            .click()
            .elementById('com.kdweibo.client:id/chat_bottom_edit_input')
            .click()
            .elementById('com.kdweibo.client:id/chat_bottom_btn_face')
            .click()
            .then(sendEmoji)
            .sleep(10000).back();


    });
    it("tack a picture", function () {
        function sendMessage() {
            return driver
                .elementsByClassName('android.widget.TextView')
                .then(function (els) {
                    return Q.all([
                        els[els.length-8].getLocation(),
                        els[0].getLocation()
                    ]).then(function (locs) {
                        return driver.swipe({
                            startX: locs[0].x, startY: locs[0].y,
                            endX: locs[1].x, endY: locs[1].y,
                            duration: 800
                        });
                    });
                }).elementByXPath('//android.widget.TextView[@text=\'赵永鑫\']')
                .catch(function () {
                    return sendMessage();
                });
        }

        return driver
            .elementByXPath('//android.widget.TextView[@text=\'通讯录\']')
            .click()
            .then(sendMessage)
            .click()
            .sleep(1000)
            .elementById('com.kdweibo.client:id/sendMessage_btn')
            .click()
            .elementById('com.kdweibo.client:id/chat_bottom_edit_input')
            .click()
            .elementById('com.kdweibo.client:id/chat_bottom_btn_more')
            .click()
            .elementsByClassName('android.widget.RelativeLayout')
            .then(function(els){
                return els[els.length-7];
            })
            .click()
            .elementById('com.android.camera:id/v6_shutter_button_internal')
            .click()
            .elementById('com.android.camera:id/v6_btn_done')
            .click()
            .elementById('com.kdweibo.client:id/img_save')
            .click()
            .sleep(10000).back();


    });
    it("read no trace", function () {
        function sendMessage() {
            return driver
                .elementsByClassName('android.widget.TextView')
                .then(function (els) {
                    return Q.all([
                        els[els.length-8].getLocation(),
                        els[0].getLocation()
                    ]).then(function (locs) {
                        return driver.swipe({
                            startX: locs[0].x, startY: locs[0].y,
                            endX: locs[1].x, endY: locs[1].y,
                            duration: 800
                        });
                    });
                }).elementByXPath('//android.widget.TextView[@text=\'赵永鑫\']')
                .catch(function () {
                    return sendMessage();
                });
        }

        return driver
            .elementByXPath('//android.widget.TextView[@text=\'通讯录\']')
            .click()
            .then(sendMessage)
            .click()
            .sleep(1000)
            .elementById('com.kdweibo.client:id/sendMessage_btn')
            .click()
            .elementById('com.kdweibo.client:id/chat_bottom_edit_input')
            .click()
            .elementById('com.kdweibo.client:id/chat_bottom_btn_more')
            .click()
            .elementsByClassName('android.widget.RelativeLayout')
            .then(function(els){
                return els[els.length-6];
            })
            .click()
            .elementById('com.kdweibo.client:id/chat_bottom_edit_input')
            .click()
            .clear()
            .sendKeys('阅后即焚')
            .elementById('com.kdweibo.client:id/chat_bottom_btn_send')
            .click()
            .sleep(10000).back();


    });
     it("address book", function () {
         function lookStaff() {
             return driver
                 .elementsByClassName('android.widget.TextView')
                 .then(function (els) {
                     return Q.all([
                         els[els.length-1].getLocation(),
                         els[0].getLocation()
                     ]).then(function (locs) {
                         return driver.swipe({
                             startX: locs[0].x, startY: locs[0].y,
                             endX: locs[1].x, endY: locs[1].y,
                             duration: 800
                         });
                     });
                 }).elementByXPath('//android.widget.TextView[@text=\'卢亮\']')
                 .catch(function () {
                     return lookStaff();
                 });
         }

         return driver
             .elementByXPath('//android.widget.TextView[@text=\'通讯录\']')
             .click()
             .elementByXPath('//android.widget.TextView[@text=\'组织架构\']')
             .click()
             .sleep(1000)
             .elementByXPath('//android.widget.TextView[@text=\'集团总部\']')
             .click()
             .elementByXPath('//android.widget.TextView[@text=\'大数据云平台部\']')
             .click()
             .sleep(1000)
             .elementByXPath('//android.widget.TextView[@text=\'研发共享服务部\']')
             .click().sleep(1000)
             .then(lookStaff).sleep(10000)
             .elementByXPath('//android.widget.TextView[@text=\'关闭\']')
             .click()
             .back().sleep(1000)
             .back();

     });
});
