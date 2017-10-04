import React, { Component } from 'react'
import logo from './../logo.svg';
import './App.css';

import { Switch, Route } from 'react-router-dom'
import FirstPage from './FirstPage'
import SecondPage from './SecondPage'
import NoMatch from '../components/NoMatch'
import { Button }  from 'material-ui';
import withRootTheme from "../withRootTheme";

export class Message extends Component {
    render() {
        return (
            <div>
                Has loaded!!
            </div>
        );
    }
}

//seperate variables needed for react-hot-loader/babel v3.0.0-beta.7
export default Message;
