const sqlite3 = require('sqlite3').verbose();

const connect = (name) => {

   let db = new sqlite3.Database(`./db/${name}`, sqlite3.OPEN_READWRITE, (err) => {
        if(err) {
            return console.error(err.message);
        }
        //console.log(`Connected to the ${name} SQlite database`);
    });
    return db;
}


const query = (qry, database) => {
    let sql = qry;
    let db = database;
    let tables = [];

    db.all(sql, [], (err, rows) => {
        if(err){
            throw err;
        }
        rows.forEach(row => {
            tables.push(row.name);
        });
        return tables;
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
    query
}


/*


const sqlite3 = require('sqlite3').verbose();
 
// open the database
let db = new sqlite3.Database('./db/chinook.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});
 
db.serialize(() => {
  db.each(`SELECT PlaylistId as id,
                  Name as name
           FROM playlists`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(row.id + "\t" + row.name);
  });
});
 
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});

*/