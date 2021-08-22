#!/usr/bin/env node
"use strict";

const inquirer = require("inquirer");
const request = require("request");
const boxen = require("boxen");
const chalk = require("chalk");
const clear = require("clear");
const open = require("open");
const path = require("path");
const ora = require("ora");
const fs = require("fs");

clear();
const prompt = inquirer.createPromptModule();
const data = require("./data.json");

const questions = [
    {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: [
            {
                name: `Send me an ${chalk.green.bold("email")}?`,
                value: () => {
                    open(`mailto:${data.email}`);
                    console.log("Done, see you in the inbox.\n");
                }
            },
            {
                name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
                value: () => {
                    let loader = ora({
                        text: "Downloading Resume"
                    }).start();

                    let download = request(data.resume);
                    let filename = data.resume.substring(data.resume.lastIndexOf("/") + 1);
                    download.pipe(fs.createWriteStream(`./${filename}`));

                    download.on("complete", () => {
                        let downloadPath = path.join(process.cwd(), filename);
                        loader.stop();

                        console.log(`Resume Downloaded at ${downloadPath} \n`);
                        open(downloadPath);
                    });
                }
            },
            {
                name: "Just quit.",
                value: () => {
                    console.log("See you later.\n");
                }
            }
        ]
    }
];

const boxData = {
    name: chalk.green.bold(`              ${data.full_name}`),
    work: chalk.white(`${data.profession} at `) + chalk.hex("#2B82B2").bold(data.company),
    twitter: chalk.gray("https://twitter.com/") + chalk.cyan(data.socials.twitter),
    github: chalk.gray("https://github.com/") + chalk.green(data.socials.github),
    linkedin: chalk.gray("https://linkedin.com/in/") + chalk.blue(data.socials.linkedin),
    web: chalk.cyan(data.website),
    npx: chalk.red("npx ") + chalk.white(data.package),

    labelWork: chalk.white.bold("       Work:  "),
    labelTwitter: chalk.white.bold("    Twitter:  "),
    labelGitHub: chalk.white.bold("     GitHub:  "),
    labelLinkedIn: chalk.white.bold("   LinkedIn:  "),
    labelWeb: chalk.white.bold("        Web:  "),
    labelCard: chalk.white.bold("       Card:  ")
};

let descriptions = data.description.map(value => chalk.italic(value)).join(`\n`);
let me = [
    boxData.name,
    "",
    boxData.labelWork + boxData.work,
    "",
    boxData.labelTwitter + boxData.twitter,
    boxData.labelGitHub + boxData.github,
    boxData.labelLinkedIn + boxData.linkedin,
    boxData.labelWeb + boxData.web,
    "",
    boxData.labelCard + boxData.npx,
    ""
];
me = me.concat(descriptions);

const box = boxen(
    me.join(`\n`),
    {
        margin: 1,
        float: "center",
        padding: 1,
        borderStyle: "single",
        borderColor: "green"
    }
);
console.log(box);
console.log(`Tip: Try ${chalk.cyanBright.bold("cmd/ctrl + click")} on the links above\n`);

prompt(questions).then(answer => answer.action());
