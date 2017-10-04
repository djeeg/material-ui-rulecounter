import * as React from "react";
import { createMuiTheme } from "material-ui/styles";
import { lightGreen, deepPurple, red, blue, indigo, blueGrey, green, deepOrange } from "material-ui/colors";
import * as pathiso from "path-browserify";
import { create, SheetsManager } from "jss";
import preset from "jss-preset-default";
import { SheetsRegistry } from "react-jss";
//import createGenerateClassName from "material-ui/styles/createGenerateClassName";
import withStyles from "material-ui/styles/withStyles";

let generatorCounter = 0;

//https://github.com/callemall/material-ui/blob/v1-beta/src/styles/createGenerateClassName.js
function createGenerateClassName() {
    let ruleCounter = 0;

    //if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    generatorCounter += 1;

    if (generatorCounter > 2) {
        // eslint-disable-next-line no-console
        console.error(
            [
                'Material-UI: we have detected more than needed creation of the class name generator.',
                'You should only use one class name generator on the client side.',
                'If you do otherwise, you take the risk to have conflicting class names in production.',
            ].join('\n'),
        );
    }
    console.log("createGenerateClassName------------------------------------------------------------", generatorCounter);
    //}

    return (rule, sheet) => {
        //console.log(rule);
        //console.log(`${sheet.options.meta}-${rule.key}-${ruleCounter}`);
        ruleCounter += 1;
        if(!(ruleCounter < 1e10)) {
            console.warn(
                [
                    'Material-UI: you might have a memory leak.',
                    'The ruleCounter is not supposed to grow that much.',
                    ruleCounter
                ].join(''),
            );
        }

        if (process.env.NODE_ENV === 'production') {
            console.log(`c${ruleCounter}`)
            return `c${ruleCounter}`;
            //todo: option.meta is not calcualted in PROD mode!!!!  https://github.com/callemall/material-ui/issues/7828
        }

        if (sheet && sheet.options.meta) {
            //todo: https://github.com/cssinjs/react-jss/issues/128
            //todo: https://github.com/callemall/material-ui/issues/8223
            //todo: https://github.com/callemall/material-ui/issues/7852
            console.log(`${sheet.options.meta}-${rule.key}-${ruleCounter}`)
            return `${sheet.options.meta}-${rule.key}-${ruleCounter}`;
            //return `${sheet.options.meta}-${rule.key}`; //todo: hack, forcing non-random style name
        }

        console.log(`${rule.key}-${ruleCounter}`)
        return `${rule.key}-${ruleCounter}`;
    };
}

//--------------------------------------------------------------------------------------------------

//https://github.com/callemall/material-ui/blob/bb3af4243910084dff2f64be1cd9e00061e95671/examples/create-react-app/src/styles/createContext.js
//https://github.com/callemall/material-ui/blob/7f11f30548abfdf87d6b2bc190ce09df77531107/docs/src/pages/guides/server-rendering.md#material-ui-on-the-server
function createStyleContext() {

    //https://material-ui-1dab0.firebaseapp.com/customization/themes#the-other-variables
    const theme = createMuiTheme({
        palette: {
            //https://www.materialui.co/colors
            primary: green,
            secondary: indigo,
            error: deepOrange,
            type: "light",
        },
    });

    // Configure JSS
    const jss = create(preset());
    jss.options.createGenerateClassName = createGenerateClassName;

    const sheetsManager = new Map();
    //const sheetsManager = new SheetsManager(); //todo: cant be SheetsManager yet, as withStyles calls this.sheetsManager.set();
    //https://github.com/callemall/material-ui/blob/144907fc0fed31cbf61b0fcbf9b555905128d272/src/styles/withStyles.js#L181

    const sheetsRegistry = new SheetsRegistry();
    // sheetsRegistry.toString = function (options) {
    //     return this.registry
    //         //.filter(sheet => sheet.attached)
    //         .map(sheet => sheet.toString(options))
    //         .join('\n')
    // };

    return {
        jss,
        theme,
        // This is needed in order to deduplicate the injection of CSS in the page.
        sheetsManager: sheetsManager,
        // This is needed in order to inject the critical CSS.
        sheetsRegistry: sheetsRegistry,
        //generateClassName : createGenerateClassName(),
    };
}

//https://github.com/callemall/material-ui/blob/cd0f883325b2b74515972d58f12868897fc34bf6/examples/nextjs/styles/getContext.js
export function getStyleContext() {
    // Make sure to create a new store for every server-side request so that data
    // isn't shared between connections (which would be bad)
    if (!process.browser) {
        return createStyleContext();
    }

    // Reuse context on the client-side
    if (!global.__INIT_MATERIAL_UI__) {
        global.__INIT_MATERIAL_UI__ = createStyleContext();
    }

    return global.__INIT_MATERIAL_UI__;
}

//--------------------------------------------------------------------------------------------------

export function withStyles2(    styles,    filename) {
    //console.log("+++++++++ withStyles2 ++++++");
    //console.log(filename);
    try {
        var unixname = filename.replace(/\\/gi, "/");
        //console.log("unixname", unixname);
        var basename = pathiso.basename(unixname);
        //console.log("basename", basename);
        var name = basename.split(".")[0];
        //console.log("name", name);
        return withStyles(styles, {name: name, withTheme: true});
    } catch (err) {
        console.error(err);
    }
}
