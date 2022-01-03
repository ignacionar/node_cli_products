import { Command } from "commander";
import figlet from "figlet";
import inquirer from "inquirer";
import chalk from "chalk";
import { v4 as uuidv4 } from 'uuid';
import { saveProducts, getProducts } from './utils.js';

const program = new Command();
const { prompt } = inquirer;

const questions = [
  {
    type: 'input', message: "Enter your product name:", name: 'pname',
  },
  {
    type: 'number', message: "Enter your product price:", name: 'price',
  },
  {
    type: 'input', message: "Enter your product color:", name: 'color',
  },
]

program
  .version('1.0.0')
  .description(chalk.yellowBright(figlet.textSync('MY PRODUCTS')));
program
  .command('new')
  .alias('n')
  .description(chalk.greenBright('Add a new product!'))
  .action(() => {
    prompt(questions).then(({ pname, price, color }) => {
      const key = pname + ' ' + color;
      let products = getProducts();
      products[key.toUpperCase()] = { pname, price, color, id: uuidv4() };
      saveProducts(products);
      console.log(chalk.greenBright('Done!'));
    });
  })
program
  .command('list')
  .alias('l')
  .description(chalk.cyanBright('List all products'))
  .action(() => {
    let products = getProducts();
    if (Object.entries(products).length === 0) {
      return console.log('No products yet...')
    }
    prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: 'Choose product',
        choices: Object.keys(products)
      },
    ]).then(({ selected} ) => {
      const product = products[selected]
      console.log(`
      Product Name: ${product.pname}
      Price: ${product.price}
      Color: ${product.color}
      Id: ${product.id}
      `)
    })
  })

program.parse(process.argv);

