/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

function environmentSwitch(NODE_ENV) {
    switch (NODE_ENV) {
        case "development":
            return DATABASE_URL_DEVELOPMENT;
        case "test":
            return DATABASE_URL_TEST;
        case "preview":
            return DATABASE_URL_PREVIEW;
        case "production":
            return DATABASE_URL;
    }
}

const {
    NODE_ENV = "development",
    DATABASE_URL,
    DATABASE_URL_DEVELOPMENT,
    DATABASE_URL_TEST,
    DATABASE_URL_PREVIEW,
    DEBUG,
} = process.env;

const URL = environmentSwitch(NODE_ENV);

module.exports = {
    development: {
        client: "postgresql",
        pool: { min: 1, max: 5 },
        connection: URL,
        migrations: {
            directory: path.join(__dirname, "src", "db", "migrations"),
        },
        seeds: {
            directory: path.join(__dirname, "src", "db", "seeds"),
        },
        debug: !!DEBUG,
    },
    test: {
        client: "postgresql",
        pool: { min: 1, max: 5 },
        connection: URL,
        migrations: {
            directory: path.join(__dirname, "src", "db", "migrations"),
        },
        seeds: {
            directory: path.join(__dirname, "src", "db", "seeds"),
        },
        debug: !!DEBUG,
    },
    preview: {
        client: "postgresql",
        pool: { min: 1, max: 5 },
        connection: URL,
        migrations: {
            directory: path.join(__dirname, "src", "db", "migrations"),
        },
        seeds: {
            directory: path.join(__dirname, "src", "db", "seeds"),
        },
        debug: !!DEBUG,
    },
    production: {
        client: "postgresql",
        pool: { min: 1, max: 5 },
        connection: URL,
        migrations: {
            directory: path.join(__dirname, "src", "db", "migrations"),
        },
        seeds: {
            directory: path.join(__dirname, "src", "db", "seeds"),
        },
        debug: !!DEBUG,
    },
};
