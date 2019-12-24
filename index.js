const program = require('commander');
const { prompt } = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const database = require('./db');


let db = {};

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
        const databaseList = await listDatabases();
        prompt([
            {
                type: 'list',
                name: 'database',
                message: 'Select a collection',
                choices: databaseList
            }
        ])
        .then( async({database}) => {
            // 
            const tabelList = await queryTables(database);

        });

        } catch(e){
            console.error(e);
            return;
        }
});



const listDatabases = () => new Promise((resolve,reject) => {
    
    fs.readdir( path.join(__dirname,'/db/'), (err, res) => {
        if(err){
            reject (console.error(err));
        }
        resolve(res.filter((file) => file.endsWith('.db')));
    });
});


const tablesPrompt = {
    type: 'list',
    name: 'tables',
    message: 'Select a Table',
    choices: ['this']
}


const queryTables = async(chosenDb) => {
    // show all tables in database and prompt for task.

    try {
        // Connect to database:
        db = await database.connect(chosenDb);
        console.log(chalk.green.inverse(`Connected to the ${chosenDb} SQlite database`));

        // Query for list of tables:
        const tables = await database.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';", db);

        console.log(chalk.green(`Listing Tables: `));

        return tables;

    }catch(e){
        console.error(e);
    }
    // this.db = db;
    // console.log(chalk.green.inverse(`Tables for ${db}: `));
    // prompt(tablesPrompt);
}


//console.log(chalk.red('test'));

program.parse(process.argv);

// prompt help example
// https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/examples/hierarchical.js