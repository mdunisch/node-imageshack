node-imageshack
===============

A node.js wrapper for the new ImageShack-API (v2). The module upload files to imageShack (asynchronous).

## Install
```
npm install imageshack
```

## Usage

First you need a ImageShack-Account and a API-Key (https://imageshack.com/contact/api)

**Setup**
```javascript
var imageshack = require('imageshack')({
    api_key: "your_api_key",
    email: "you@email.com",
    passwd: "yourpassword"
});
```

**Upload a File**

You can upload a file to ImageShack by calling upload-function and pass a NodeJS-Stream-Object.

```javascript
var myfile = fs.createReadStream("image.png");

imageshack.upload(myfile,function(err, filejson){
    if(err){
        console.log(err);
    }else{
        console.log(filejson);
        /* filejson is a json with:
        { 
        original_filename: 'image.png',
        link: 'http://imagizer.imageshack.us/a/img842/4034/221.png',
        id: 'newtsep' 
        }
       */
    }
});
```

**Delete a File**

You can delete a file by calling del-function and pass the file-ID (see upload-response).

```javascript
imageshack.del("d23da2",function(err){
    if(err){
        console.log(err);
    }else{
        // Delete successful
    }
});
```
Attention: ImageShack-API give you also a success if the image is delete already - if you try delete a already deleted image you get a success as well.


**Upload multiple files asynchronous**

node-imageshack is designed asynchronous so you can call multiple upload()-methods and all would work asynchronous:

```javascript
var myfile1 = fs.createReadStream("image.png");
var myfile2 = fs.createReadStream("image.png");

imageshack.upload(myfile1,function(err, filejson){
    if(err){
        console.log(err);
    }else{
        console.log(filejson);
    }
});

imageshack.upload(myfile2,function(err, filejson){
    if(err){
        console.log(err);
    }else{
        console.log(filejson);
    }
});

```

**Upload multiple files (async.js)**

You can also use [`async.js`](https://github.com/caolan/async) to upload multiple files defined in a array.

```javascript
var files = [fs.createReadStream("image1.png"),fs.createReadStream("image2.png")];

async.map(files, function(file, callback) {
    imageshack.upload(file, function (err, res){
        if (err) return callback(err);
        callback(null, res);
    });
}, function(err, results) {
    if (err) {
        console.log(err);
    } else{
        // All Files
        console.log(results);
    }
});
```

## License

node-imageshack is licensed under the MIT license.
