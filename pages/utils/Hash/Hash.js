class Hash {
    static createHashFromString(string) {
        const hash = string
        .split("")
        .reduce((a, b) =>{
            const c = ((a<<5)-a)+b.charCodeAt(0);
            return c&c;
        },0);

        const randomHash = Math.round(Math.random() * hash);
        return randomHash.toString();
    }

    static createHashFileName(seed) {
        const lastPointIndex = seed.lastIndexOf(".");
        const fileName = seed.slice(0, lastPointIndex);
        const fileExtension = seed.slice(lastPointIndex + 1);
        const hash = Hash.createHashFromString(fileName);
        return `${fileName}-${hash}.${fileExtension}`;
    }
}

export default Hash;