import React, { Component } from 'react';
import Styles from './getItem.css';

import cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';
import { remote } from 'electron';

class getItem extends Component {

    componentWillUpdate(nextProps, nextState) {

        if (nextProps.download == true && nextProps.folder != '') {
            this.handlerClick(nextProps.filePath);
        }

    }

    render() {
        return (
            <div className={ Styles.cardItem}>
                    <img src="./dist/img/Logo-z.png" className={Styles.imgLogo}/>

                <div className={Styles.cardItemh2}>
                    <span className={Styles.spanFirst}>Link:</span>
                    <span>{this.props.link}</span>
                    <button type="submit" className={Styles.btnDownload} onClick={()=>this.handlerClick()}>Download</button>
                </div>

                <div className={Styles.progressBar}>
                <span className={Styles.progressLine} ref="progressBar">
                </span>
                </div>
            </div>
        )
    }

    handlerClick(filePath) {
        let self = this;
        let domain = this.props.link.split('/')[2];
        let folder, nameFile;
            folder = filePath;

        request(this.props.link, (error, response, body) => {
            if (!error && response.statusCode == 200) {

                let data = cheerio(body).find('script[type="text/javascript"]');
                data = data[5].children[0].data;
                data = data.split(';');

                let valA = data[0].split('= ')[1].split(';')[0];
                let valB = data[1].split('= ')[1].split(';')[0];
                let calc = Math.floor((valA / 3 + valA % valB));
                let strutureLink = `${data[5]}`.split('/');

                nameFile = strutureLink[4];

                strutureLink = domain + '/' + strutureLink[1] + '/' + strutureLink[2] + '/' + calc + '/' + strutureLink[4];
                strutureLink = 'http://' + strutureLink.replace('"', "");


                if (folder == undefined) {

                    remote.dialog.showOpenDialog({
                        title: "Selectione a Pasta!!",
                        properties: ["openDirectory"]
                    }, function(folderPaths) {
                        if (folderPaths === undefined) {
                            console.log("No destination folder selected");
                            return;
                        } else {
                            folder = folderPaths[0] + '/' + nameFile;
                            folder = folder.replace('"', "");


                            self.downloadFile(strutureLink, folder);

                        }
                    });
                } else {

                    folder = folder + '/' + nameFile;
                    folder = folder.replace('"', "");
                   self.downloadFile(strutureLink, folder);

                }




            }
        })
    }

    downloadFile(link, targetPath) {
        let self = this;
        let received_bytes = 0;
        let total_bytes = 0;

        let req = request({
            method: 'GET',
            uri: link
        });

        let out = fs.createWriteStream(targetPath);

        req.pipe(out);

        req.on('response', function(data) {
            total_bytes = parseInt(data.headers['content-length']);
        });

        req.on('data', function(chunk) {
            received_bytes += chunk.length;

            self.showProgress(received_bytes, total_bytes);
        });



    }

    showProgress(received, total) {
        let percentage = Math.floor((received * 100) / total);

        this.refs.progressBar.style.height = percentage + "%";

    }

}
export default getItem;
