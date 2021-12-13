import Sequelize from "sequelize";

import db from "../utils/database";

const User = db.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2, 30],
        },
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2, 30],
        },
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [["user", "admin"]],
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            min: 8,
        },
    },
    resetPasswordToken: {
        type: Sequelize.STRING,
    },
    resetPasswordExpire: {
        type: Sequelize.DATE,
    },
});

export default User;
