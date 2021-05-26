#!/usr/bin/env node
let fs = require("fs");
let path = require("path");
let directory = require("./directory");

function isFilee(srcF){
    // is gives boolean value
    console.log(fs.lstatSync(srcF))
    return fs.lstatSync(srcF).isFile()
}
function getExt(srcF){
    // it return the extension of a file 
   var exten = srcF.substring(srcF.lastIndexOf('.') + 1);
   console.log(exten)
    return exten;

}

function getCategory(extension) {
    let types = directory.types;
    for(var key in types){
        for(var i=0; i<types[key].length; i++){
            if(extension== types[key][i]){
                console.log("key" + key);
                return key;
            }
        }
    }
    
  return "miscellaneous";
        
}

function sendFile(srcF ,destPath , category){
    var categoryPath = path.join(destPath , category);
    // if categorypath does not exist then make a folder 
    if(fs.existsSync(categoryPath) === false){
        fs.mkdirSync(categoryPath);
    }
    //  path.basename returns the filename part of a file path
    var fName = path.basename(srcF);
    var joinFolderNametoFileName = path.join(categoryPath , fName);
    // fs.copyFileSync is used to copy a file from the src path to dest path
    fs.copyFileSync(srcF , joinFolderNametoFileName);
}

function getContentOfFolder(srcF){
   console.log( fs.readdirSync(srcF))
    return fs.readdirSync(srcF);
}

function organizer(srcF , dest){
    //check srcF is file or folder
    //console.log(srcF)
    if(isFilee(srcF)){
        // find or get the extension of file
        var extension = getExt(srcF);


        // find category of the file
        var category = getCategory(extension);
        console.log(category);
        // if file does not belong to any category then push it in miscellaneous
        if(category== null){
            category = "miscellaneous"
        }

        // now send the file to the destination path
        sendFile(srcF , dest , category);


    }else{
        // get the content of the folder
        var content = getContentOfFolder(srcF);
        for(var i=0; i<content.length; i++){
            // if content is not am organizedFolder
            if(content[i] == "organized_folder"){
                continue;
            }
             var currentFileOrFolderPath = path.join(srcF, content[i]);
             console.log(currentFileOrFolderPath)
            
             /// call organizer function for current file or folder
           organizer(currentFileOrFolderPath , dest);
            

        }


    }
}



// gives path of current file or folder
var srcF = process.cwd();
//console.log(srcF)
//at this path we push all the files according to their extension => src/organized_folder
var destinationFolder = path.join(srcF , "organized_folder");
//check  this path(src/organized_folder) is exist or not
if(fs.existsSync(destinationFolder) == false){
    fs.mkdirSync(destinationFolder);
}
// call organizer function

organizer(srcF , destinationFolder);
