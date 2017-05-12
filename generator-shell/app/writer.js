const createScaffold = (app) => {
    app.fs.copy(
        app.templatePath('scaffold/**/+(**|.*)'),
        app.destinationPath(`${app.prompts.name}/`),
        { dot: true }
    );
};

const processPackageJSON = (app) => {
    app.fs.copyTpl(
        app.templatePath('package.ejs'),
        app.destinationPath(`${app.prompts.name}/package.json`),
        { prompts: app.prompts }
    );
};

const write = (app) => {
    createScaffold(app);
    processPackageJSON(app);
};

module.exports = write;