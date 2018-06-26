/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2017 The Regents of the University of California
 * Author: Jim Robinson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Created by dat on 5/8/18.
 */
var app = (function (app) {
    app.GenomeLoadController = function (browser, config) {

        let self = this,
            urlLoaderConfig,
            locaFileLoaderConfig,
            doOK;

        this.browser = browser;


        // Local File
        locaFileLoaderConfig =
            {
                dataTitle: 'Genome',
                hidden: false,
                embed: true,
                $widgetParent: config.$fileModal.find('.modal-body'),
                mode: 'localFile'
            };

        this.localFileLoader = browser.createFileLoadWidget(locaFileLoaderConfig, new igv.FileLoadManager());

        doOK = function () {
            okHandler(self.localFileLoader.fileLoadManager);
            self.localFileLoader.dismiss();
            config.$fileModal.modal('hide');
        };

        app.utils.configureModal(this.localFileLoader, config.$fileModal, doOK);


        // URL
        urlLoaderConfig =
            {
                dataTitle: 'Genome',
                hidden: false,
                embed: true,
                $widgetParent: config.$urlModal.find('.modal-body'),
                mode: 'url'
            };

        this.urlLoader = browser.createFileLoadWidget(urlLoaderConfig, new igv.FileLoadManager());

        doOK = function () {
            okHandler(self.urlLoader.fileLoadManager);
            self.urlLoader.dismiss();
            config.$urlModal.modal('hide');
        };

        app.utils.configureModal(this.urlLoader, config.$urlModal, doOK);


        // Dropbox
        this.dropboxController = new app.DropboxController(browser, config.$dropboxModal, 'Genome');

        doOK = function (loader, $modal) {
            okHandler(loader.fileLoadManager);
            loader.dismiss();
            $modal.modal('hide');
        };

        this.dropboxController.configure(doOK);


        // Google Drive
        this.googleDriveController = new app.GoogleDriveController(browser, config.$googleDriveModal, 'Genome');
        this.googleDriveController.configure(function (obj, $filenameContainer, index) {
            let lut,
                key;

            // update file name label
            $filenameContainer.text(obj.name);
            $filenameContainer.show();

            lut =
                [
                    'data',
                    'index'
                ];

            // fileLoadManager dictionary key
            key = lut[index];

            self.googleDriveController.loader.fileLoadManager.dictionary[key] = obj.path;

            self.googleDriveController.$modal.modal('show');

        }, okHandler);

    };

    function okHandler (fileLoadManager) {
        let genomeObject,
            genome;

        genomeObject = getGenomeObject(fileLoadManager);
        genome = Object.values(genomeObject).pop();
        igv.browser
            .loadGenome(genome)
            .then(function (genome) {

                if (genome.id) {
                    app.trackLoadController.createEncodeTable(genome.id);
                } else {
                    app.trackLoadController.encodeTable.hidePresentationButton();
                }

            })
            .catch(function (error) {
                igv.presentAlert(error);
            });

    }

    function getGenomeObject (fileLoadManager) {
        let obj;

        obj = {};
        obj[ 'noname' ] =
            {
                fastaURL: fileLoadManager.dictionary.data,
                indexURL: (fileLoadManager.dictionary.index || undefined)
            };

        return obj;
    }

    app.GenomeLoadController.prototype.DEPRICATED_okHandler = function (fileLoadManager) {

        this
            .getGenomeObject(fileLoadManager)
            .then(function (dictionary) {
                var genome;

                if (dictionary) {

                    genome = Object.values(dictionary).pop();
                    return igv.browser.loadGenome(genome);

                } else {
                    return Promise.reject(new Error('Error: no genome data file.'));
                }

            })
            .then(function (genome) {

                if (genome.id) {
                    app.trackLoadController.createEncodeTable(genome.id);
                } else {
                    app.trackLoadController.encodeTable.hidePresentationButton();
                }

            })
            .catch(function (error) {
                igv.presentAlert(error);
            });

    };

    app.GenomeLoadController.prototype.DEPRICATED_getGenomeObject = function (fileLoadManager) {
        let obj;

        if (undefined === fileLoadManager.dictionary.data) {
            return Promise.reject(new Error('Error: No data file'));
        } else if (false === isValidDataFileOrURL.call(this, fileLoadManager.dictionary.data)) {
            return Promise.reject(new Error('Error: data file is invalid.'));
        } else {

            if (true === isValidIndexFileORURL.call(this, fileLoadManager.dictionary.data)) {
                return Promise.reject(new Error('Error: index file submitted as data file.'));
            } else {

                if (fileLoadManager.dictionary.index && false === isValidIndexFileORURL.call(this, fileLoadManager.dictionary.index)) {
                    return Promise.reject(new Error('Error: index file is not valid.'));
                }

                if ('json' === igv.getExtension({ url: fileLoadManager.dictionary.data })) {
                    return app.genomeController.getGenomes(fileLoadManager.dictionary.data)
                } else {
                    obj = {};
                    obj[ 'noname' ] = { fastaURL: fileLoadManager.dictionary.data, indexURL: (fileLoadManager.dictionary.index || undefined) };
                    return Promise.resolve(obj);
                }

            }

        }

    };

    function isValidDataFileOrURL (fileOrURL) {
        var extension,
            success;

        extension = igv.getExtension({ url: fileOrURL });
        success = ('fasta' === extension || 'fa' === extension || 'json');
        return success;

    }

    function isValidIndexFileORURL(fileOrURL) {
        var extension,
            success;

        extension = igv.getExtension({ url: fileOrURL });
        success = ('fai' === extension);
        return success;
    }

    return app;
})(app || {});