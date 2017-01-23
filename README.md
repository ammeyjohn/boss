# boss

## Custom builds

### Prerequisites

Before you can do a build:

- Install *node.js* and *npm* on your system: https://nodejs.org/
- Install the following modules using npm: `bower`:

  ```
  $ [sudo] npm install -g bower
  ```

- Download or clone the boss project:

  ```
  $ git clone https://github.com/ammeyjohn/boss.git
  ```

- Install the dependencies of boss by running `npm install` in the root of the project:

  ```
  $ cd boss
  $ npm install
  ```
 
## Run

### Run the project

Make sure that all steps in prerequisites have been completed.

- Locate to the root of the project and run

  ```
  $ cd boss
  $ npm start
  ```

### Print the debug

- The project embeded some DEBUG point to print verbos information. These debug actions are disabled by default, but it can be actived by run the project with enviorments assgined.
  
  In Linux
  
  ```
  $ cd boss
  $ DEUBG=boss* npm start
  ```
  In Windows
  
  ```
  > cd boss
  > SET DEUBG=boss* & npm start
  ```
