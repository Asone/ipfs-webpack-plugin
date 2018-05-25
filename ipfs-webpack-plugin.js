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

    //console.log(Object.keys(compiler));
    compiler.plugin('compilation', function (compilation) {

      compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
        // console.log(Object.keys(htmlPluginData));
        console.log(htmlPluginData.assets);
      //  htmlPluginData.assets.chunks.main.entry = 'miaou.js';
        htmlPluginData.assets.js = ['moo.js'];
        htmlPluginData.assets.css = ['pwet.css'];
       // console.log(htmlPluginData.assets);
       // return htmlPluginData;
        // callback(true);
       // return htmlPluginData;
       });
     
      compilation.plugin('html-webpack-plugin-after-html-processing', function (htmlPluginData, callback) {
       // console.log(htmlPluginData);
       callback(null);
      });

    });
    //compiler.hooks.compilation.tap('IPFSWebpackPlugin', () => {
     // console.log('The compiler is starting a new compilation...');
      // console.log(compilation);
      /* compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
        'MyPlugin',
        (data, cb) => {
          data.html += 'The Magic Footer'
  
          cb(null, data)
        }
      )
      */
    // })

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
     // var m = Object.keys(stats.compilation);
     // console.log(stats.compilation.assets);
     // this._ipfs.start() // start ipfs node
     // .then( res => { // process chunks once ipfs loaded using promise.
        const keys = Object.keys(this.params.assets);

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
            /*
            // retrieve file content data
            console.info('added the following file to repo : ' + filepath);
            console.info(result[0]);
            console.log('========== Begin replacement process of file ============');
            const m = outputOptions.path + '/index.html';
            let indexFile = fs.readFileSync(m);
            console.log(indexFile.toString());
            console.log('========== End replacement process of file ============');
            */
            return this._ipfs.files.cat(result[0].hash);
          });
        
        };
     // return res;
      //}).then( res => {
      //  this._ipfs.stop();
      //})
      //.catch(error => console.error('Node failed to start!', error));
    });
  }

  module.exports = IPFSWebpackPlugin;

