export default function createHashFromString(string) {
    return string
            .split("")
            .reduce((a, b) =>{
                const c = ((a<<5)-a)+b.charCodeAt(0);
                return c&c;
            },0);
}