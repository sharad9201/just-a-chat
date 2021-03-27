const mongo = require('mongodb').MongoClient
const client = require('socket.io')(4000).sockets


//connect to mongodb

mongo.connect('mongodb://127.0.0.1/mongochat',function(err,db){
    if(err){
        throw err
    }
    // connect to  Socket.io

    client.on('connection',function(){
        let chat = db.collection('chats')

        // create function to send status

        sendStatus = function(s){
            socket.emit('status',s)
        }
        // when we have to send or pass any file from server to client to the index html we need .emit

        /// Get chat from mongo collection

        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err
            }
            //emmit the messages

            socket.emit('output',res)
        })

        //handle input events

        socket.on('input', function(data){
            let name = data.name
            let message = data.message

            //check for name aand message

            if (name ==''|| message==''){
                //send error status from above

                sendStatus('please enter a name and message')
            } else{
                // insert message

                chat.insert({name: name, message: message}, function(){
                    client.emit('output',[data])

                    // send status object
                    sendStatus({

                        message: 'Message sent',
                        clear: true
                    })
                })
            }
        })
    })



    console.log('mongodb connected........')
})