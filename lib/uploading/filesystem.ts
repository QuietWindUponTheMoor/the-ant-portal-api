const fs = require("fs/promises");
const path = require("path");

export async function download(downloadPath: string, filePath: string): Promise<boolean> {
    try {
        const buffer = await fs.readFile(filePath);
        fs.writeFile(downloadPath, buffer, {flags: "w"});
        return true;
    } catch (error: any) {
        console.log(error);
        return false;
    }
}

export async function dirExists(path: string): Promise<boolean> {
    try {
        await fs.access(path, fs.constants.F_OK);
        return true;
    } catch (error: any) {
        console.log(error);
        return false;
    }
}

export async function fileExists(dir: string): Promise<boolean> {
    try {
        fs.access(dir, fs.constants.F_OK);
        return true;
    } catch (error: any) {
        console.log(error);
        return false;
    }
}