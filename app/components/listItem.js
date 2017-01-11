import React, { Component, PropTypes } from 'react';
import GetItem from './getItem.js';

class listItem extends Component {

    

    render() {

        let links = this.props.linksStore;

        let element = links.map((val, index) => {
                return ( <GetItem key={index} link={val.link} download={val.download} filePath={val.filePath}> </GetItem>);
                });

            return (
            		<div>
            		{ element }
            		</div>

            )
        }



    }

    export default listItem;
