import Sequelize from "sequelize";

import db from "../utils/database";

const Review = db.define("review", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

export default Review;
