## Installing node
### node (official source)
#### Windows:
* Download the Windows Installer for Node.js from the official website (https://nodejs.org/en/download/).
* Run the downloaded installer and follow the prompts to complete the installation.
#### Ubuntu:
* Open a terminal window.
* Run the following command to update your system: `sudo apt-get update`
* Run the following command to install Node.js: `sudo apt-get install nodejs`
* Run the following command to install the Node Package Manager (npm): `sudo apt-get install npm`
#### Mac:
* Download the macOS Installer for Node.js from the official website (https://nodejs.org/en/download/).
* Run the downloaded installer and follow the prompts to complete the installation.

Once you have installed Node.js, you can verify that it is installed by running the following command in a terminal or command prompt window:
`node --version`
This should print the version number of Node.js that is installed on your system.

### nvm (recommended)
#### Windows:
* Download and install the latest version of Git for Windows from the official website (https://git-scm.com/downloads).
* Open a Command Prompt or Git Bash window.
* Run the following command to download the nvm installation script: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`
* Follow the prompts to complete the installation. You may need to close and reopen your Command Prompt or Git Bash window to start using nvm.
#### Ubuntu:
* Open a terminal window.
* Run the following command to download the nvm installation script: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`
* Follow the prompts to complete the installation. You may need to close and reopen your terminal window to start using nvm.
#### Mac:
* Open a terminal window.
* Run the following command to download the nvm installation script: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`
* Follow the prompts to complete the installation. You may need to close and reopen your terminal window to start using nvm.

Once you have installed nvm, you can use it to install and manage different versions of Node.js. For example, you can run the following command to install the latest version of Node.js: `nvm install node`

You can then switch between different versions of Node.js by running the nvm use command. For example, to switch to the latest version of Node.js, you can run: `nvm use node`

### yarn (recommended package manager)
#### Windows:
* Download the latest version of Yarn from the official website (https://classic.yarnpkg.com/en/docs/install/#windows-stable).
* Run the downloaded installer and follow the prompts to complete the installation.
#### Mac:
* Open a terminal window.
* Run the following command to download the Yarn installation script: `curl -o- -L https://yarnpkg.com/install.sh | bash`
* Once the script has finished running, close and reopen your terminal window, or run the following command to update your current shell session: `source ~/.bash_profile`
#### Ubuntu:
* Open a terminal window.
* Run the following commands to add the Yarn repository to your list of package sources and import the repository key:
```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```
Run the following command to update your system and install Yarn: `sudo apt-get update && sudo apt-get install yarn`

Once you have installed Yarn, you can verify that it is installed by running the following command: `yarn --version`

This should print the version number of Yarn that is installed on your system.
