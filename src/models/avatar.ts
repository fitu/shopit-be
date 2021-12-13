import Sequelize from "sequelize";

import db from "../utils/database";

const Avatar = db.define("avatar", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    publicId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
        },
    },
});

export default Avatar;
