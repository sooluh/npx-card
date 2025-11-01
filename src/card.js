#!/usr/bin/env node
"use strict";

const { default: ora } = require("ora");
const { default: open } = require("open");
const clear = require("clear");
const { default: chalk } = require("chalk");
const { default: boxen } = require("boxen");
const inquirer = require("inquirer");

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
        },
      },
      {
        name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
        value: () => {
          let loader = ora({
            text: "Downloading Resume",
          }).start();

          setTimeout(() => {
            loader.stop();

            const sorry = [
              "\nHello, I'm sorry, I appreciate your curiosity.",
              "But for privacy, I can't just share my CV with strangers.",
              "Please contact me via WhatsApp.\n",
            ];
            sorry.map((message) => console.log(chalk.italic(message)));

            open(data.biolink);
          }, 1_000);
        },
      },
      {
        name: "Just quit.",
        value: () => {
          console.log("See you later.\n");
        },
      },
    ],
  },
];

const box = {
  label: {
    work: chalk.white.bold("       Work:  "),
    twitter: chalk.white.bold("    Twitter:  "),
    github: chalk.white.bold("     GitHub:  "),
    linkedin: chalk.white.bold("   LinkedIn:  "),
    web: chalk.white.bold("        Web:  "),
    card: chalk.white.bold("       Card:  "),
  },

  name: chalk.green.bold(`              ${data.fullname}`),
  work:
    chalk.white(`${data.profession} at `) +
    chalk.hex("#ffc300").bold(data.company),
  twitter:
    chalk.gray("https://twitter.com/") + chalk.cyan(data.socials.twitter),
  github: chalk.gray("https://github.com/") + chalk.green(data.socials.github),
  linkedin:
    chalk.gray("https://linkedin.com/in/") + chalk.blue(data.socials.linkedin),
  web: chalk.cyan(data.website),
  npx: chalk.red("npx ") + chalk.white(data.package),
};

const me = [
  box.name,
  "",
  box.label.work + box.work,
  "",
  box.label.twitter + box.twitter,
  box.label.github + box.github,
  box.label.linkedin + box.linkedin,
  box.label.web + box.web,
  "",
  box.label.card + box.npx,
  "",
  ...data.description.map((value) => chalk.italic(value)),
];

console.log(
  boxen(me.join(`\n`), {
    margin: 1,
    float: "center",
    padding: 1,
    borderStyle: "single",
    borderColor: "green",
  }),
);
console.log(
  `Tip: Try ${chalk.cyanBright.bold("cmd/ctrl + click")} on the links above\n`,
);

prompt(questions).then((answer) => answer.action());
