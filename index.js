const program = require('commander');
const { prompt } = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const database = require('./db');


program
    .command('db <name>')
    .description('connect to a database')
    .action((name)=>{
        database.connect(name);
});

program
    .command('list')
    .description('list databases')
    .action( async ()=>{
        //const collectionList = get from db (async)
        try {
        const databaseList = await getDatabases();
        prompt([
            {
                type: 'list',
                name: 'collection',
                message: 'Select a collection',
                choices: databaseList
            }
        ])
        .then( ({collection}) => {
            showDocuments(collection);
        });

        } catch(e){
            console.error(e);
            return;
        }
});



const getDatabases = () => new Promise((resolve,reject) => {
    
    fs.readdir( path.join(__dirname,'/db/'), (err, res) => {
        if(err){
            reject (console.error(err));
        }
        resolve(res.filter((file) => file.endsWith('.db')));
    });
});


const showDocuments = (collection) => {
    // show all tables in database and prompt for task.
    console.log(chalk.green.inverse(`Documents for ${collection}: `));
}


//console.log(chalk.red('test'));

program.parse(process.argv);