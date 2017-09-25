"use strict";

// TODO: Cleanup and move to the correct place.

const glob = require('globby');
const path = require('path');
const fs = require('fs');
const node_sass = require('node-sass');

const sources = [
    '**/*.scss',
    `!*.scss`,
    '!bower_components/**/*',
    '!node_modules/**/*'
];

const references = [];

/**
 * @returns {Promise}
 */
const getReferences = function(){

    return glob(sources)
        .then(files =>{

            files.forEach(file =>{

                file = path.resolve(file);

                node_sass.renderSync({
                    sourceMap: file,
                    file: file,
                    importer: (url, prev) =>{

                        prev = path.resolve(prev);
                        if(prev !== file) return;
                        if(!url.endsWith(".scss")){

                            url += ".scss";
                        }

                        const checkUrl = (original, targetDir) =>{

                            let ref = original;
                            // check if it is a base file
                            // references to
                            // _File.scss
                            // File.scss
                            // Can be resolved to a file that is called _File.scss
                            if(path.basename(original)[0] !== "_"){

                                ref = path.resolve(targetDir, path.dirname(original), "_" + path.basename(original));
                            }

                            // Try checking for a file that is _File
                            if(fs.existsSync(ref)){

                                return ref;
                            }

                            // Try checking for a file that is exactly named
                            ref = path.resolve(targetDir, original);
                            if(fs.existsSync(ref)){

                                return ref;
                            }

                            return undefined;
                        };

                        let ref = checkUrl(url, process.cwd());

                        if(!ref){

                            ref = checkUrl(url, path.dirname(file));
                        }

                        if(!ref){

                            console.log(`[!]File ${file} has a missing import ${url}`);
                        }
                        else{

                            ref = path.resolve(ref);
                            if(!references[ref]){

                                references[ref] = [];
                            }
                            references[ref][file] = 1;
                        }
                    }
                });
            });
            return references;
        });

};

/**
 * @returns {Promise}
 */
module.exports = getReferences;