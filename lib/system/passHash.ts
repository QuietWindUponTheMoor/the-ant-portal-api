import * as bcrypt from "bcrypt";

export async function passHash(password: string): Promise<{result: number, details: string}> {
    const salt_rounds: number = 12;

    try {
        const hash: string = await bcrypt.hash(password, salt_rounds);
        return {
            result: 2, // OK
            details: hash
        }
    } catch (error) {
        return {
            result: 4, // Bad req
            details: `${error}`
        }
    }
}

export async function passMatch(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const match: boolean = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.log(`Error matching passwords: ${error}`);
        return false;
    }
}