node-imageshack
===============

A node.js wrapper for the new ImageShack-API (v2). The module asynchronously uploads files to ImageShack.

## Install
```bash
npm install imageshack
```

## Usage

You must have an ImageShack-Account and an API-Key (https://imageshack.com/contact/api).

**Setup**

```javascript
var imageshack = require('imageshack')({
    api_key: "your_api_key",
    email: "you@email.com",
    passwd: "yourpassword"
});
```

**Upload a File**

You can upload a file to ImageShack by calling upload-function and passing a NodeJS-Stream-Object.

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

You can delete a file by calling del-function and passing the file-ID (see upload-response)

```javascript
imageshack.del("d23da2",function(err){
    if(err){
        console.log(err);
    }else{
        // Delete successful
    }
});
```
Attention: ImageShack-API gives you also a success, if the image has already been deleted -- so if you try to delete an already deleted image, you will get a success as well.


**Upload multiple files asynchronously**

node-imageshack is designed asynchronously; you can call multiple upload()-methods and then all would work asynchronously:

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

You may also use [`async.js`](https://github.com/caolan/async) to upload multiple files defined in an array.

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