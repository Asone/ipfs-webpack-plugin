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
      params.assets['loader.js'] = addFile('loader.js');
      params.assets['ipfs.js'] = addFile('ipfs.js');
      // console.log(params.assets);
      // store parameters in plugin instance in order to access those once file emission done. 
      this.params = params;
      callback();
    });

    compiler.plugin('done', (stats) => { // files emission completed
      const { outputOptions } = stats.compilation

      this._ipfs.start() // start ipfs node
      .then( res => { // process chunks once ipfs loaded using promise.
        const keys = Object.keys(this.params.assets);

        for(chunk of this.params.chunks){ 
          filename = this.params.assets[chunk];
          
          for(asset of keys){ // iterate through assets
            const filepath = asset.replace(/\?.*$/,''); // clean params in filename
            fileToReplaceIn = (outputOptions.path + '/' + filepath); // build environmental path
            const file = fs.readFileSync(fileToReplaceIn); // loads file
            
            this._ipfs.files.add({ path: filepath, content: file }) 
            .then( result => {
              const uri = result;
              // We should add here processing instructions in order to replace assets urls with ipfs urls.
              return uri;
            })
            .then( result => {
              // retrieve file content data
              console.info('added the following file to repo :');
              console.info(result[0]);
              return this._ipfs.files.cat(result[0].hash);
            }) 
            // Uncomment the following line in order to output the content of each file and ensure it has
            /*
            .then( result => { 
              // This part is just a way to ensure the data content exists. Uncomment to output
              result.on('data', (file) => {
                 console.log(file.toString());
              });
            });
            */
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

