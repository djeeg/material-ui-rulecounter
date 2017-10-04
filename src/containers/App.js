import React, { Component } from 'react'
import logo from './../logo.svg';
import './App.css';

import { Switch, Route } from 'react-router-dom'
import FirstPage from './FirstPage'
import SecondPage from './SecondPage'
import NoMatch from '../components/NoMatch'
import { Button }  from 'material-ui';
import withRootTheme from "../withRootTheme";
import Tile from "./Tile";

export class App extends Component {
    state = {
        lazyComponent: null
    }
    async componentDidMount() {
        const { default: Message } = await require('./Message.js');
        this.setState({
            lazyComponent: <Message />
        })
    }
    render() {
        console.log(logo);
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                {
                    (!process.browser) ? (
                        <div>
                            {
                                ["a", "b", "c", "d", "e"].map((value) => <Tile value={value}/>)
                            }
                        </div>
                    ) : null
                }
                <Switch>
                    <Route exact path="/" component={FirstPage}/>
                    <Route path="/second" component={SecondPage}/>
                    <Route component={NoMatch}/>
                </Switch>
                <Button>Material UI</Button>
                {this.state.lazyComponent || <p>Loading...</p> }
            </div>
        );
    }
}

//seperate variables needed for react-hot-loader/babel v3.0.0-beta.7
const component = App
const rootthemedcomponent = withRootTheme(component);
export default rootthemedcomponent;
