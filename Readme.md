# Star Tribune Data Drop - How have prescription drug prices increased?

Visual look at how drug prices have increased or decreased.  Created by [Frey Hargarten](https://github.com/jeffhargarten).

## Data

Data provided by ?? and can be found in `builds/development/data/_raw`.

### Processing

In order to process the data and get to the form that is used in the visual piece:

1. Convert to CSV: `in2csv --sheet="Data" builds/development/data/_raw/Medicare_Drug_Spending_PartD_All_Drugs_YTD_2015_12_06_2016.xlsx | tail -n +4 > builds/development/data/drug-spending.csv`
1. Parse and compress: `node builds/development/data/drug-spending-process.js`
    * This will output: `builds/development/data/drug-spending.json`

## Development

Most commands are assumed to be on the command line (Terminal on a Mac).

### Prerequisites

The following are probably already installed on your computer if you have worked on similar projects.

1. Install Git
    * On a Mac, install Homebrew, then: `brew install git`
1. Install NodeJS
    * On a Mac: `brew install node`
1. Install global Node dependencies: `npm install -g gulp`

### Install

1. Get code and enter project: `git clone https://github.com/striblab/20170510-drug_prices.git && cd 20170510-drug_prices.git`
1. Install local dependencies: `npm install`

### Local development

1. Run `gulp` to build the code and run a local webserver at `http://localhost:3000`.
1. Make changes to the code and the changes should be automatically updated in your browser.

### Project structure and editing

* `builds/development`: Main project here.
    * `index.html`: Edit HTML here.
* `components`: Helpful bits of code to be used in the project if desired.
    * `sass/style.scss`: SASS that gets built into `builds/development/css/style.css`
    * `scripts/st_script.js`: JS that gets compiled into `builds/development/js/script.css`

*Best way to handle libraries?*

## Deployment

Deployment is managed in specific repositories:

* [Data Drop](https://github.com/striblab/datadrop)
* [General visuals](https://github.com/striblab/startribune_dataviz)
* [Elections (2016)](https://github.com/striblab/2016election)

The following will change based on which deployment repo this is going to and where you have that repository locally.

1. Build the production version: `NODE_ENV=production gulp`
1. Copy files (update path as needed): `mkdir -p ../datadrop/20170510-drug_prices/ && rsync -rav ./ ../datadrop/20170510-drug_prices/ --exclude=".git" --exclude="node_modules" --exclude=".sass-cache" --delete-after`
1. Update the relevant deployment repo.

## Credits

Built using [C3](https://github.com/masayuki0812/c3) and [jQuery](https://github.com/jquery/jquery).
