import * as React from "react";
import { getStyleContext, withStyles2 } from "./styles";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const styleSheet = theme => ({
    "@global": {
        html: {
            background: theme.palette.background.default,
            fontFamily: theme.typography.fontFamily,
            WebkitFontSmoothing: "antialiased", // Antialiasing.
            MozOsxFontSmoothing: "grayscale", // Antialiasing.
        },
        body: {
            margin: 0,
        },
    },
});

//seperate variables needed for react-hot-loader/babel v3.0.0-beta.7
const passthroughcomponent = (props) => props.children;
const component = passthroughcomponent;
const styledcomponent = withStyles2(styleSheet, __filename)(component);
const PassThroughComponent = styledcomponent;

const withRootTheme = (WrappedComponent) => {
    class WithRootThemeComponent extends React.Component {

        componentWillMount() {
            this.styleContext = getStyleContext();
        }

        componentDidMount() {
            console.log("withRootTheme.componentDidMount", process.browser)
            // Remove the server-side injected CSS.
            if (process.browser) {
                //from https://material-ui-1dab0.firebaseapp.com/guides/server-rendering#the-client-side
                const jssStyles = document.getElementById("jss-server-side");
                if (jssStyles && jssStyles.parentNode) {
                    jssStyles.parentNode.removeChild(jssStyles);
                }
            }
        }

        render() {
            return (
                <MuiThemeProvider
                    theme={this.styleContext.theme}
                    sheetsManager={!process.browser ? this.styleContext.sheetsManager : undefined}
                >
                    <PassThroughComponent>
                        <WrappedComponent {...this.props} />
                    </PassThroughComponent>
                </MuiThemeProvider>
            );
        }
    }

    if (process.env.NODE_ENV !== "production") {
        WithRootThemeComponent.displayName = `withRoot(Component)`;
    }

    return WithRootThemeComponent;
};

export default withRootTheme;
