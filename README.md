# Badminton Signup Script

A script that takes a list of names and programatically registers each name to a particular badminton social signup website using puppeteer.
The script when executed will schedule the registration for the next Tuesday 10:00am AEST.

## How to use
Navigate to the directory of the script and run it with node.
```
node . --names path/to/names.txt
```

The `.txt` file for the names is just a basic text file with each name on each row.

## How it works
Firstly, `yargs` is used to pass through the arguments to obtain the path for the names list text file.
The file is read to obtain the list of names as an array.
Environment variables are used for credentials and the website address and are passed through with `dotenv`.
`puppeteer` is then used to open the website and programatically register the names.

## Future improvements
- Replace the names list with `.json` to have both name and mobile number so people can unregister themselves
- Refactor with constants to make it easier to track DOM incase the website alters in any way.
- Open a `puppeteer` page per person so that requests can be made concurrently instead of sequentially.
