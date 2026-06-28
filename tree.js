const fs = require("fs");
const path = require("path");

function generateTree(dir, prefix = "") {
    const files = fs.readdirSync(dir);

    files.forEach((file, index) => {
        if (
            file === "node_modules" ||
            file === ".git" ||
            file === "build" ||
            file === "dist"
        ) {
            return;
        }

        const fullPath = path.join(dir, file);
        const isLast = index === files.length - 1;
        const connector = isLast ? "└── " : "├── ";

        console.log(prefix + connector + file);

        if (fs.statSync(fullPath).isDirectory()) {
            generateTree(
                fullPath,
                prefix + (isLast ? "    " : "│   ")
            );
        }
    });
}

console.log(path.basename(process.cwd()));
generateTree(process.cwd());