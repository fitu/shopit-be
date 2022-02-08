import fs from "fs/promises";

import csv from "csv-parser";

const readFromCsv = async <T>(csvPath: string): Promise<Array<T>> => {
    console.log(`Loading file: ${csvPath}`);
    const items: Array<T> = [];
    const file = await fs.open(csvPath, "r");

    return new Promise((resolve, reject) => {
        file.createReadStream()
            .pipe(csv())
            .on("data", (data) => items.push(data))
            .on("end", async () => {
                resolve(items);
            });
    });
};

export { readFromCsv };
