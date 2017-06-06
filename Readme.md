# Star Tribune Data Drop - How have prescription drug prices increased?

Visual look at how drug prices have increased or decreased.  Created by [Frey Hargarten](https://github.com/jeffhargarten).

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

1. To build the production version: `NODE_ENV=production gulp`
1. *To push to server ....?*

## Credits

Built using [C3](https://github.com/masayuki0812/c3) and [jQuery](https://github.com/jquery/jquery).
