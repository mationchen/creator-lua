
/* jslint node: true, sub: true, esversion: 6, browser: true */
/* globals Editor */

"use strict";

const Fs = require('fire-fs');
const Path = require('path');

const {WorkerBase, registerWorker} = require('./WorkerBase');

const Project = require('./Project');

class CopyLibraryWorker extends WorkerBase {
    run(state, callback) {
        let files = JSON.parse(Fs.readFileSync(Editor.url('packages://creator-legacy-support/lua/files.json')));
        let srcdir = Editor.url('packages://creator-legacy-support/lua/');
        let destdir = state.path;

        let step = 100 / files.length;
        let srcpath, destpath;
        files.forEach((filename) => {
            srcpath = Path.join(srcdir, filename);
            destpath = Path.join(destdir, filename);
            Fs.ensureDirSync(Path.dirname(destpath));
            Fs.copySync(srcpath, destpath);
            this._updateProgress(step);
        });

        Editor.Ipc.sendToAll('creator-legacy-support:state-changed', 'finish', 100);

        callback();
    }
}

registerWorker(CopyLibraryWorker, 'run-copy-library-worker');

