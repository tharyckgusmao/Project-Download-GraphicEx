import React, { Component, PropTypes } from 'react';
import Styles from './insertItem.css';

import cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';
import { remote } from 'electron';

class Insert extends Component {

    props: {

        onAdd: () => void

    };

    render() {
        return (

            <div className={Styles.containerInput}>
                <input className={Styles.input} type="text" label="Insira o Link" ref="item" onKeyUp={(e)=>{this.handlerKeyUp(e)}}></input>
                <button className={Styles.submit} type='submit' onClick={()=>{this.handleClick()}} >
                    <i className="fa fa-plus" />

                </button>
                <button className={Styles.submit} type='submit' onClick={()=>{this.getFile()}} >
                    <i className="fa  fa-file-text" />

                </button>

                <button className={Styles.submit} type='submit' onClick={()=>{this.downloadAll()}} >
                    <i className="fa  fa-download" />

                </button>

            </div>


        )

    }

    handlerKeyUp(e) {

       if(e.key == 'Enter'){
            
            this.handleClick()

       }

    }

    downloadAll(){
        let self = this;
        remote.dialog.showOpenDialog({
                                title: "Selectione a Pasta!!",
                                properties: ["openDirectory"]
                            }, function(folderPaths) {
                                if (folderPaths === undefined) {
                                    console.log("No destination folder selected");
                                    return;
                                } else {
                                  let folder = folderPaths[0];
                                    self.props.onDownloadAll({filePath:folder});


                                }
                            });

    }


    handleClick() {
        let link = '';

        if (this.refs.item.value != '') {
            this.getLink(this.refs.item.value);

        }

        this.refs.item.value = '';

    }

    getFile() {

        let dataFile;
        let self = this;

         remote.dialog.showOpenDialog(function(fileNames) {

            if (fileNames === undefined) {
                console.log("No file selected");
            } else {
                fs.readFile(fileNames[0], 'utf-8', (err, data) => {
                    
                    dataFile = data.toString().split("\n");
                       [...dataFile].forEach((element)=>{
                            self.getLink(element)
                         })
                })
            };

        });

      

    }

    getLink(val) {

        request(val, (error, response, body) => {
            if (!error && response.statusCode == 200) {

                let ctnDownload = cheerio(body).find('.downloadz').children('a');

                let link = ctnDownload.map((index, val) => {

                    let check = val.attribs.href;
                    if (check.search('zippyshare') > -1)
                        return check;

                })
                link = link[0];
                this.props.onAddItem({ link:link , download:false})


            }
        })


    }


    beautifyLink(val) {

        let findPosition = val.search('www');
        let link = '';
        if (findPosition > -1) {
            link = decodeURIComponent(val.slice(findPosition, val.length))
            this.props.onAddItem(link)
        }

        return link;

    }


}

export default Insert;
