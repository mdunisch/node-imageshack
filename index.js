"use strict";


var FormData = require('form-data');


/* Class Imageshack
 * Upload files to Imageshack
 */

var Imageshack = (function () {

    /*
    * Constructor
    * Sets all vars
    * @param configobject { api_key: "12131", email: "myaccount@mail.com", passwd: "mypassword"}
     */

    function Imguploader(configobject) {

        this.initerror = "";
        this.doingauth = false;

        // Check if Config-Object set
        if(!(configobject instanceof Object)){
            this.initerror = "Init-Error: Missing config-Object";
        }else{

            // Check if all required parameters set
            if(configobject.passwd == undefined || configobject.email == undefined || configobject.api_key == undefined){
                this.initerror = "Init-Error: config-Object have not all required vars";
            }else{
                this.auth_id = "";
                this.api_key = configobject.api_key;
                this.email = configobject.email;
                this.passwd = configobject.passwd;
                this.api_host = "api.imageshack.com";
                this.api_url = "http://" + this.api_host + "/v2/";
            }

        }

    }


    /* TODO: Currently don't work (From.append seems to dont work with method DELETE)
     * Delete a File
     * @param id ImageShack-ID of the image
     * @param callback Callbackfunction (err) err = null if sucess
     */

    Imguploader.prototype.del = function(id, callback){
        var self = this;

        // Check if auth_id is set
        if(this.auth_id == ""){

            // At the moment a auth is doing, wait 1 secound
            if(this.doingauth){

                setTimeout(function () {
                    self.del(id,callback);
                }, 100);

            }else{
                this.auth(function(err){
                    if(err){
                        callback(err);
                    }else{
                        self.del(id,callback);
                    }
                });
            }

            // Do upload
        }else{

            var text = "";
            var form = new FormData();
            form.append('api_key',  this.api_key);
            form.append("auth_token",this.auth_id);
            form.append("ids",id);

            form.submit({
                host: "api.imageshack.com",
                path: "/v2/images",
                method: "DELETE"
            }, function(err, res) {
                if (err) {
                    callback("Error delete: "+ err);
                }else{
                    res.on('data', function (chunk) {
                        text +=  chunk;
                    });

                    res.on("end", function(){
                        callback(null,text);
                    });
                }
            });

        }
    };

    /*
     * Upload a new File
     * @param streamobj Node readable Object
     * @param callback Callbackfunction (err, link)
     */

    Imguploader.prototype.upload = function(streamobj, callback){
        var self = this;


        // If there is a Error on the init
        if(this.initerror != ""){
            callback(this.initerror);
        }else{

            streamobj.pause();

            if (typeof streamobj.read != 'function' || typeof streamobj.on != 'function'){
                callback("Upload-Paramter is not a readable Stream");
            }else{
                // Check if auth_id is set
                if(this.auth_id == ""){

                    // At the moment a auth is doing, wait 1 secound
                    if(this.doingauth){

                        setTimeout(function () {
                            self.upload(streamobj,callback);
                        }, 100);

                    }else{
                        this.auth(function(err){
                            if(err){
                                callback(err);
                            }else{
                                self.upload(streamobj,callback);
                            }
                        });
                    }

                // Do upload
                }else{


                    var text = "";
                    var form = new FormData();
                    form.append('api_key',  this.api_key);
                    form.append("auth_token",this.auth_id);
                    form.append("public","false");
                    form.append("files",streamobj);


                    form.submit( this.api_url +"images", function(err, res) {

                        if (err) {
                            callback("Error upload:" +err);
                        }else{
                            res.on('data', function (chunk) {
                                text +=  chunk;
                            });

                            res.on("end", function(){

                                try {
                                    var body = JSON.parse(text);
                                }catch (e){
                                    callback("Error upload: " +text);
                                }

                                if(body != undefined){

                                    try {

                                        var link = body.result.images[0].direct_link.replace("imageshack.us/","http://imagizer.imageshack.us/");

                                    } catch (e) {

                                        // If auth_token missing
                                        if(body.error.error_message != undefined){
                                            self.auth_id = "";
                                            self.upload(streamobj, callback);
                                        }else{
                                            callback("Error upload: " +text);
                                        }
                                    }

                                    if(link != undefined){

                                        var returnobj = {
                                            original_filename: body.result.images[0].original_filename,
                                            link: link,
                                            id: body.result.images[0].id
                                        };
                                        callback(null, returnobj);
                                    }


                                }


                            });
                        }


                    });
                }
            }

        }


    };

    /*
     * Make the authorization
     * @param callback Callbackfunction(err) on finish (err = null if there is no error)
     */

    Imguploader.prototype.auth = function(callback){
        var self = this;


        this.doingauth = true;

        var form = new FormData();
        form.append('email',    this.email);
        form.append('password', this.passwd);
        form.append('api_key',  this.api_key);
        var tempstr = "";

        form.submit(this.api_url + "user/login",
            function (err, res) {

                if (err) {
                    self.doingauth = false;
                    callback("Error auth: "+ err);
                }else{
                    res.on('data', function (chunk) {
                        tempstr +=  chunk;
                    });

                    res.on("end", function(){
                        try {
                            var result = JSON.parse(tempstr);
                        }catch (e){
                            self.doingauth = false;
                            callback("Error getting auth_id: " +tempstr);
                        }

                        if(result != undefined){
                            if(result.result.auth_token != undefined){
                                self.auth_id = result.result.auth_token;
                                self.doingauth = false;
                                callback(null);
                            }else{
                                self.doingauth = false;
                                callback("Error getting auth_id: " +tempstr);
                            }
                        }


                    });
                }

            });

    };

    return Imguploader;
})();


module.exports = function(config){
    return new Imageshack(config);
};