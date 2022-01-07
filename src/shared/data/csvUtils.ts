import csv from "csv-parser";
import fs from "fs";

const readFromCsv = async <T>(csvPath: string): Promise<Array<T>> => {
    console.log(`Loading file: ${csvPath}`);
    const items: Array<T> = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on("data", (data) => items.push(data))
            .on("end", async () => {
                resolve(items);
            });
    });
};

export { readFromCsv };
