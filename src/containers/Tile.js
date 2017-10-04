import React, { Component } from 'react'
import './App.css';

import {withStyles2} from "../styles";

export class Tile extends Component {
    render() {
        return (
            <div className={this.props.classes.layout_cell}>
                Tile {this.props.value}
            </div>
        );
    }
}

const styleSheet = theme => ({
    layout_cell: {
        backgroundColor: theme.palette.primary["100"],
    },
});


//seperate variables needed for react-hot-loader/babel v3.0.0-beta.7
const component = Tile;
const styledcomponent = withStyles2(styleSheet, __filename)(component);
export default styledcomponent;
