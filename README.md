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
```
var imageshack = require('imageshack')({
    api_key: "your_api_key",
    email: "you@email.com",
    passwd: "yourpassword"
});```

**Upload a File**

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

##TODO
- Finish del()-Method for deleting Images from ImageShark

## License

Form-Data is licensed under the MIT license.