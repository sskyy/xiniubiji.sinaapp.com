/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

seajs.config({
    alias: {
        'jquery': 'core/jquery-1.7.min',
        'backbone': 'core/backbone',
        'underscore': 'core/underscore-min',
        'less': 'core/less-1.3.0.min.js',
        'jscex' : 'core/jscex/jscex',
        'jscex-builderbase' : 'core/jscex/jscex-builderbase',
        'jscex-async' : 'core/jscex/jscex-async',
        'jscex-parser' : 'core/jscex/jscex-parser',
        'jscex-jit' : 'core/jscex/jscex-jit',
        'plugin-less' : 'core/seajs/plugin-less',
        'plugin-base' : 'core/seajs/plugin-base'
    },
    preload : [ 'plugin-base','plugin-less']
});

seajs.use('modules/loader');

