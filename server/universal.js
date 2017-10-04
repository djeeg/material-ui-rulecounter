import {getStyleContext} from "../src/styles";

const path = require('path')
const fs = require('fs')

const React = require('react')
const {Provider} = require('react-redux')
const { renderToNodeStream } = require('react-dom/server')
const {StaticRouter} = require('react-router-dom')
const {JssProvider} = require('react-jss')
const getRawBody = require('raw-body')

const {default: configureStore} = require('../src/store')
const {default: App} = require('../src/containers/App')

module.exports = function universalLoader(req, res) {
    const filePath = path.resolve(__dirname, '..', 'build', 'index.html')

    fs.readFile(filePath, 'utf8', (err, htmlData)=>{
        if (err) {
            console.error('read err', err)
            return res.status(404).end()
        }
        const context = {}
        const store = configureStore()
        var stylecontext = getStyleContext();

        var component = (
            <JssProvider registry={stylecontext.sheetsRegistry} jss={stylecontext.jss}>
                <Provider store={store}>
                    <StaticRouter
                        location={req.url}
                        context={context}
                    >
                        <App/>
                    </StaticRouter>
                </Provider>
            </JssProvider>
        );

        getRawBody(renderToNodeStream(component), {})
            .then(function(markup) {

                const css = stylecontext.sheetsRegistry.toString();
                console.log("css", css);

                if (context.url) {
                    // Somewhere a `<Redirect>` was rendered
                    res.redirect(301, context.url)
                } else {
                    // we're good, send the response
                    let RenderedApp = htmlData;
                    RenderedApp = RenderedApp.replace('{{SSR}}', markup)
                    RenderedApp = RenderedApp.replace('<style id="jss-server-side"></style>', '<style id="jss-server-side">' + css + '</style>');
                    res.send(RenderedApp)
                }

            });


    })
}

