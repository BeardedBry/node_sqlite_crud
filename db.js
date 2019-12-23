const sqlite3 = require('sqlite3').verbose();

const connect = (name) => {

   let db = new sqlite3.Database(`./db/${name}.db`, sqlite3.OPEN_READWRITE, (err) => {
        if(err) {
            return console.error(err.message);
        }
        console.log(`Connected to the ${name} SQlite database`);
    });
}



// db.close((err)=>{
//     if(err){
//         return console.error(err.message);
//     }
//     console.log('Closing the database connection.');
// });


module.exports = {
    connect,
}