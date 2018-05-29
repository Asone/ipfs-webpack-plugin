  const path = require('path')
  const fs = require('fs')
  const IPFS = require('ipfs')

  // TODO - get to work in Chrome "Uncaught RangeError: Array buffer allocation failed"


  function IPFSWebpackPlugin (options) {

    // TODO allow to inject build-ipfs-node options and loader-ipfs-node options
    // TODO allow disabling the spinner
  
    
    this._ipfs = new IPFS(this.defaultOptions);
    // if(this.options.init) this._ipfs.init();
}

  IPFSWebpackPlugin.prototype.defaultOptions = {
    start: false,
    config: {
      Addresses: {
        Swarm: [
          "/ip4/0.0.0.0/tcp/4002",
          "/ip4/127.0.0.1/tcp/4003/ws",
          "/libp2p-webrtc-star/dns4/star-signal.cloud.ipfs.team/wss",
          "/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star/ipfs/QmRSNiq3rEkPpokCePZ3oko9eV9Fszn1nP9z8YihjGfPme"
        ],
        API: '/ip4/127.0.0.1/tcp/5002',
        Gateway: '/ip4/127.0.0.1/tcp/9090',
      },
      Discovery: {
        MDNS: {
          Enabled: true,
          Interval: 10
        },
        webRTCStar: {
          Enabled: true
        }
      },
      Bootstrap: [
        "/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
        "/ip4/104.236.176.52/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z",
        "/ip4/104.236.179.241/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
        "/ip4/162.243.248.213/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
        "/ip4/128.199.219.111/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
        "/ip4/104.236.76.40/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64",
        "/ip4/178.62.158.247/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
        "/ip4/178.62.61.185/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
        "/ip4/104.236.151.122/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx"
      ],
      Identity: {
        PeerID: "QmRSNiq3rEkPpokCePZ3oko9eV9Fszn1nP9z8YihjGfPme",
        PrivKey: "CAASqAkwggSkAgEAAoIBAQDHQREDvLgU2KzY8NQBfdMrplLNrx9hlTkt5R83vQcQmNkPKpYTt4RsxtmP/XKxfS03aOrX9q8j4og73H5bHFLvA9305nvrUwJ1nrlFbcPFM1QzBK6u/rwN+X5+8F3E64y8Vl3jjQceJ4oKPrcEWDH8fkQZ/RDDPb0FePYZexiLTx80Qzp4a2iV9mfYun6ZW7rxhNYIo01pdB20IuYjLV05NwXDedf9dSOnFiwFY3kxr0FmQ9/nQUMJkkFZ1gYi5ooUh5LoOhxkchJ6Y8lmlGa6QGidyoxzLSSnI408xHSGaVqyvKjBBKp/TbJPi0RjO/TO2xJ90msyf/hi/J9UOpr5AgMBAAECggEBAKNLCrOiXMYQ0I61xzk1sfMKyr9v7mrdjU+0f0IBsyGB8hlA0F92PZub1z7u+ajFqmHHpPa6Xsws4XMVf6QRcVIaPDNxFEtF6zUTkEh67T7WkwGAq9wUPW/CcU18lYxFckADE8zhjdzDkJhWz0xLLyP7Irqdr7giB5/Ngvpc7D91dL2fUBbhhA6CX9fixcSHeLH3V3QHblWKvmw4VEr3H4TUEFfOkTT/1OVJQCfMuCjPSlc/zLSODjoME+ZDbCoHwc6ra5XYa40LCkclcQmdqqYuxDptVAmsI6WHUWONzXgHxyM3I+CJqP0er6ILvXm87lOKXkyJpn4PvrVJwg7yr+UCgYEA7T6d5N4DsmC6FB3TVzjoThT66ZYyIWnJW7R/3y0T9kvqoHcSAgyCJdLQYzZneP7p86W05dq83+2luI4cNMBhaoAnQmxYZo2ZueMu2sJnaP7RAIagwPKNN/ujHcMTM4AEEdwzzjKQCchiq3nVxo5Uq2pdmOzila0NWP9WJIyJ8G8CgYEA1wGYUst3w+9lWtN4j2D1sgP2Mh26m0G6tNkigynYqYJnXQKgY6ieVKxEbILesm1B5IL9akInpdfkLJ77W+eSBt+IO2QmTVQPopQ5bRIMTT3cmAyhrsGRAQnX//cmCnbpJZwBnY/iCKlrzWtxyC5M9YK+fVxVtiZoqXEFznX4jxcCgYBWT9ib4lXP+LbaCLvR2MdTWPisMNOOKnFyZqm65SiFC7uRo6AulKRo5FiiL7HXaE5vMRMuKLVcdpY7HaCPZIpMd9FQriA/Nzb9VPS/68g5f7NEELa9W8Ea4/bFJip/KwzP/p/uXaDfnkKfhhTLRw7wyiLBNzV8JNhdT4/kfijVCwKBgEnv0Xr/X1Mw2xDt0fK0bClodVxsnsRPSS5x0Q178XbxUixI//DlhnUlvG34Xy7KpbM4XH8S+uFsKZoyncvQCYZ1jjqmSQmkk6/b+xeH8lUJpfdfuKYJCJ1rzizGx/0nQSvexytw1FEYOestPLaTPYHcETe47fyynqFOLan/JZfHAoGBALQdJYHLOMkHrZBO7sEcxBfSYxFJFTWWj3oVPCAGgga94iSg7a9cSGiRyQVmZxUvQKquUHjGs0lY8osiSz9lPr3xchCQeP1M5PwaSesBKjBgKQGvo/uyvNugpag5/omW0fivI9yJByUpQyBabCiLbHBd9ea2FYtOYkizO+wlzV47"
      },
      EXPERIMENTAL: {
            pubsub: true
      }
    }
  }


  IPFSWebpackPlugin.prototype.v4AfterEmit = (data,cb) => {
    // Do stuff
    console.log('we shall upload here the index.html to the network if requested by user \n');
    cb(null);
}

  IPFSWebpackPlugin.prototype.v4Hooks = function(compilation){
    var self = this;
    // console.log(Object.keys(self));
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('IPFSWebpackPlugin',this.v4BeforeHTMLProcessing);
      compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('IPFSWebpackPlugin',this.v4AfterEmit);
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('IPFSWebpackPlugin',this.v4AlterAssetsTag);
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('IPFSWebpackPlugin',this.v4AfterHTMLProcessing);
    }


  IPFSWebpackPlugin.prototype.v4AfterHTMLProcessing = function(data,cb){
    console.log('After HTML processing \n');
    // console.log(data);
     console.log('\n');
    cb(null,data);
    return;
  }

  IPFSWebpackPlugin.prototype.v4BeforeHTMLProcessing = function(data, cb){
    // Do stuff
    console.log('Processing before HTML generation \n');
   // console.log(data);
     cb(null,data);
     return;
  }

  IPFSWebpackPlugin.prototype.v4AfterEmit = (data,cb) => {
      // Do stuff
    //  console.log(data);
      console.log('we shall upload here the index.html to the network if requested by user \n');
    cb(null,data);
    return;
  }

  IPFSWebpackPlugin.prototype.v4AlterAssetsTag = function(data,cb){
    console.log('Hook for altering tags \n');
    // console.log(data);
    cb(null,data);
    return;
  }
  IPFSWebpackPlugin.prototype.apply = function (compiler) {
    if(compiler.hooks){ // webpack v.4
      compiler.hooks.compilation.tap('IPFSWebpackPlugin',this.v4Hooks.bind(this));
    }else{ // older versions
      this.extendCompilation(compiler);
    }
  }

  // IPFSWebpackPlugin.prototype._ipfs = new IPFS({start: false });

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

  IPFSWebpackPlugin.prototype.configLoader = function(options){
    
      if (!options.start) options.start = this.defaultOptions.start;
      if (!options.repo) options.repo = this.defaultOptions.repo;
      // if(!options.)
      return options;
  }

  IPFSWebpackPlugin.prototype.emitHandler = (params, callback) => { // files emission process
      // adds some files to export
      params.assets['loader.js'] = addFile('loader.js');
      params.assets['ipfs.js'] = addFile('ipfs.js');
      // console.log(params.assets);
      // store parameters in plugin instance in order to access those once file emission done. 
      this.params = params;
      callback();
    }
  

  IPFSWebpackPlugin.prototype.dispatcher = function(){
    
  }

  IPFSWebpackPlugin.prototype.extendCompilation = function(compiler){
    compiler.plugin('compilation', function (compilation) {

      //compilation.plugin('html-webpack-plugin-before-html-processing', this.beforeHTMLProcesing);
     
     // compilation.plugin('html-webpack-plugin-after-html-processing', this.afterHTMLProcessing);

    });

    // compiler.plugin('emit', this.emitHandler);
    /*
    compiler.plugin('done', (stats) => { // files emission completed
      const { outputOptions } = stats.compilation
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
          
            // retrieve file content data
            console.info('added the following file to repo : ' + filepath);
            console.info(result[0]);
            return this._ipfs.files.cat(result[0].hash);
          });
        
        };
      return res;
      }).then( res => {
        this._ipfs.stop();
      })
      .catch(error => console.error('Node failed to start!', error));
     */
  };


  IPFSWebpackPlugin.prototype.extendCompiler = function(){

  };

  IPFSWebpackPlugin.prototype.beforeHTMLProcessing = function (htmlPluginData, callback) {
 
    //  htmlPluginData.assets.chunks.main.entry = 'miaou.js';
    htmlPluginData.assets.js = ['moo.js']; // those should be moved as entrypoints
    htmlPluginData.assets.css = ['pwet.css'];
    // callback(true);
    // return htmlPluginData;
    callback(null);
  }

  /*
  IPFSWebpackPlugin.prototype.afterHTMLProcessing = function (htmlPluginData, callback) {
    // console.log(htmlPluginData);
    callback(null);
   }
  */
   IPFSWebpackPlugin.prototype.ls = function(obj){
    console.log(Object.keys(obj));
  }

  module.exports = IPFSWebpackPlugin;

