const express = require('express');
const { verifyUser } = require('../authenticate');
const {users , storage ,bucket , files , db} = require('../firebase');
const multer = require('multer');
const admin = require('firebase-admin')
const filesRouter = express.Router();
var urlExists = require('url-exists');
const cors  = require('../cors');

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{fileSize:"10485760"},
})

function createTimestamp(){
    const dateObj = new Date();
    let month = dateObj.getMonth() + 1;
    month = month > 9 ? month : "0" + month
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear().toString().substr(-2);
    const output = day  + ' / '+ month  + ' / ' + year;
    return output;
}

filesRouter.options('/' , cors.cors , (req,res,next) => {res.sendStatus("200")});
filesRouter.get('/' , cors.corsWithOpts ,verifyUser , async(req,res,next) => {
    let Files = []
    const validateUrl = async(doc) => {
        return new Promise((resolve, reject) => {
            urlExists(doc.url , async(err , exists) => {
                if(!exists){
                    console.log("Does not exists")
                    const options = {
                        version: 'v4',
                        action: 'read',
                        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
                    };
                    const [url] = await bucket.file(req.user.username + "/" + doc.fileName).getSignedUrl(options);
                    await files.doc(req.user.username).collection('files').doc(doc.fileName).update({
                        url: url
                    })
                    const File = (await files.doc(req.user.username).collection('files').doc(doc.fileName).get()).data()
                    resolve(File)
                }else{
                    console.log("Does exists")
                    resolve(doc)
                }
            })
        })
    }
    const querySnapshot = await files.doc(req.user.username).collection("files").get();
    const docs = []
    querySnapshot.forEach(doc => {
        docs.push(doc.data());
    })
    for(var i in docs){
        const doc = await validateUrl(docs[i])
        Files.push(doc);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.send({success:true , status:"Files Found" , files:Files})
})

filesRouter.post('/' , cors.corsWithOpts ,  verifyUser , upload.single('file') , async(req,res,next) => {
    if(!req.file){
        res.statusCode = 403;
        res.setHeader('Content-Type','application/json');
        res.json({success:false , status:"File Not Found" , msg:"Files does not exists!!"})
    }else if(req.file){
        const blob = bucket.file(req.user.username + "/" + req.file.originalname).createWriteStream({
            metadata:{
                contentType: req.file.mimetype
            }
        })

        blob.on('error', (error) => {
            console.log(err)
            res.statusCode = 403;
            res.setHeader('Content-Type','application/json');
            res.send({success:false , status:"Upload Failed" , err:err.message});
        });
      
        blob.on('finish', async() => {
            const options = {
                version: 'v4',
                action: 'read',
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            };
            const [url] = await bucket.file(req.user.username + "/" + req.file.originalname).getSignedUrl(options);
            await files.doc(req.user.username).collection('files').doc(req.file.originalname).set({
                fileName: req.file.originalname,
                path: req.user.username + "/" + req.file.originalname,
                url: url,
                size: req.body.size,
                type: req.body.type,
                ext: req.body.ext === "plain" ? "txt" : req.body.ext,
                created: createTimestamp(),
            })
            const file = (await files.doc(req.user.username).collection('files').doc(req.file.originalname).get()).data()
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.send({success: true , status:"File Uploaded", file: file})
        });

        await blob.end(req.file.buffer);
    }
})

filesRouter.put('/' , cors.corsWithOpts ,  (req,res,next) => {
    res.statusCode = 404;
    res.setHeader('Content-Type','appication/json');
    res.send({success:false , status:"Cannot Put to ./file/"})
})

filesRouter.delete('/' , cors.corsWithOpts ,  verifyUser , (req,res,next) => {
    bucket.deleteFiles({
        prefix: req.user.username + '/'
    },async function(err) {
        if (!err) {
            async function deleteQueryBatch() {
                const snapshot = await files.doc(req.user.username).collection('files').get()

                const batchSize = snapshot.size;
                if (batchSize === 0) {
                  return;
                }

                const batch = db.batch();
                snapshot.docs.forEach((doc) => {
                  batch.delete(doc.ref);
                });
                await batch.commit();

                process.nextTick(() => {
                  deleteQueryBatch();
                });
            }

            const BatchSize = 20
            files.orderBy('__name__').limit(BatchSize)
            await deleteQueryBatch();

            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.send({success:true , status: "Deleted" , msg:"All Files Deleted !!"});
        }
    });
})

filesRouter.options('/:ref' , cors.cors , (req,res,next) => {res.sendStatus("200")});
filesRouter.get('/:ref' , cors.corsWithOpts , verifyUser , async(req,res,next) => {
    const file = await files.doc(req.user.username).collection('files').doc(req.params.ref).get();
    if(!file.exists){
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.send({success:false , status:"File Not Found"})
    }else{
        const data = file.data();
        // console.log(data)
        urlExists(data.url, async(err,exists) => {
            if(!exists){
                console.log("Deos Not Exists");
                const options = {
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
                };
                console.log(data.fileName)
                const [url] = await bucket.file(req.user.username + "/" + data.fileName).getSignedUrl(options);
                await files.doc(req.user.username).collection('files').doc(data.fileName).update({
                    url: url
                })
                const File = (await files.doc(req.user.username).collection('files').doc(data.fileName).get()).data()
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.send({success: true , status:"File Uploaded" , file: File})
            }else{
                console.log("Exists");
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.send({success: true , status:"File Uploaded" , file:data})
            }  
        })
    }
})

filesRouter.post('/:ref' , cors.corsWithOpts ,  (req,res,next) => {
    res.statusCode = 404;
    res.setHeader('Content-Type','appication/json');
    res.send({success:false , status:"Cannot Post to ./file/" + req.params.ref})
})

filesRouter.put('/:ref' , cors.corsWithOpts ,  (req,res,next) => {
    res.statusCode = 404;
    res.setHeader('Content-Type','appication/json');
    res.send({success:false , status:"Cannot Put to ./file/" + req.params.ref})
})

filesRouter.delete('/:ref' , cors.corsWithOpts ,  verifyUser , async(req,res,next) => {
    const doc = (await files.doc(req.user.username).collection('files').doc(req.params.ref).get());
    if(!doc.exists){
        res.statusCode=404;
        res.setHeader('Content-Type','application/json');
        res.send({success:false , status:"File Not Found"});
    }else if(doc.exists){
        
        await bucket.file(req.user.username + "/" + req.params.ref).delete().catch(err => console.log(err))
        await files.doc(req.user.username).collection('files').doc(req.params.ref).delete();
        
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.send({success:true , status: "Deleted" , msg:"File Deleted !!"});
    }
})

filesRouter.options('/:ref/getLink' , cors.cors , (req,res,next) => {res.sendStatus("200")});
filesRouter.get('/:ref/getLink' , cors.corsWithOpts , verifyUser , async(req,res,next) => {
    const file = await files.doc(req.user.username).collection('files').doc(req.params.ref).get();
    if(!file.exists){
        res.statusCode = 404;
        res.setHeader('Content-Type','application/json');
        res.send({success:false , status:"File Not Found"})
    }else{
        const data = file.data();
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        const [url] = await bucket.file(req.user.username + "/" + data.fileName).getSignedUrl(options);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.send({success: true , status:"File Uploaded" , url: url})  
    }
})

module.exports = filesRouter;