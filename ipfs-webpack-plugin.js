  const path = require('path')
  const fs = require('fs')
  const IPFS = require('ipfs')

  // TODO - get to work in Chrome "Uncaught RangeError: Array buffer allocation failed"


  function IPFSWebpackPlugin (options) {
    
    // TODO allow to inject build-ipfs-node options and loader-ipfs-node options
    // TODO allow disabling the spinner

  }

  IPFSWebpackPlugin.prototype._ipfs = new IPFS({start: false});

  function addFile (pathToAdd, transform) {
    const fullPath = path.resolve(__dirname, pathToAdd)
    return {
      source: function () {
        return fs.readFileSync(fullPath)
      },
      size: function () {
        return fs.statSync(fullPath).size
      }
    }
  }

  IPFSWebpackPlugin.prototype.apply = function (compiler) {

    compiler.plugin('emit', (params, callback) => { // files emission process
      // adds some files to export
      params.assets['loader.js'] = addFile('loader.js')
      params.assets['ipfs.js'] = addFile('ipfs.js')

      // store parameters in plugin instance in order to access those once file emission done. 
      this.params = params;
      callback();
    });

    compiler.plugin('done', (stats) => { // files emission completed
      const { outputOptions } = stats.compilation

      this._ipfs.start() // start ipfs node
        .then(res => { // process chunks once ipfs loaded using promise.
          for(chunk of this.params.chunks){ 
            filename = this.params.assets[chunk];
            
            for(asset of chunk.files){ // iterate through assets
              var filepath = asset.replace(/\?.*$/,''); // clean params in filename
              fileToReplaceIn = (outputOptions.path + '/' + filepath); // build environmental path
              const file = fs.readFileSync(fileToReplaceIn); // loads file
              
              this._ipfs.files.add({ path: filepath, content: file }) 
              .then( result => {
                // We should add here processing instructions in order to replace assets urls with ipfs urls.
                
                uri = result;

                return result;
              })
              .then( result => {
                // retrieve file content data
                return this._ipfs.files.cat(result[0].hash);
              }) 
              .then( result => { 
                // This part is just a way to ensure our data is retrieved
                result.on('data', (file) => {
                  // console.log(file.toString());
                });
              });
            
            }
          };
        return res;
        }).then( res => {
          this._ipfs.stop();
        })
        .catch(error => console.error('Node failed to start!', error));
    
    });
  }

  module.exports = IPFSWebpackPlugin;

