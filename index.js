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

// Todo: Make initial choice "Create, Read, Update" 

// Main program
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

                const tableList = await queryTables(database);
                //console.log(tableList);
                console.log(chalk.green("Listing Tables: "));

                const tableChoice = await promptChooseFromList('table', 'Choose from a table', tableList);

                console.log(tableChoice.table);
                //TODO: Prompt for Read, Update, Delete 

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



const queryTables = async(chosenDb) => {
    // show all tables in database and prompt for task.

    try {
        // Connect to database:
        db = await database.connect(chosenDb);
        console.log(chalk.green.inverse(`Connected to the ${chosenDb} SQlite database`));

        // Query for list of tables:
        // returns and array of table name objects.
        const tables = await database.listTables("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';", db);
        //console.log(tables);
        return tables;

    }catch(e){
        console.error(e);
    }
    // prompt(tablesPrompt);
}





// Prompt Question Functions

const promptChooseFromList = (name, message, list) => {

    const tablesArray =  [];
    list.forEach((item) => tablesArray.push(item.name));

   return prompt([
        {
            type: 'list',
            name: name,
            message: message,
            choices: tablesArray
        }
    ])
}




program.parse(process.argv);

// prompt help example
// https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/examples/hierarchical.js