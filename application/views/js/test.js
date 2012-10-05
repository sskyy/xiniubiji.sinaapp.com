/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

seajs.config({
    alias: {
        'jquery': 'core/jquery-1.7.min',
        'backbone': 'core/backbone',
        'underscore': 'core/underscore-min',
        'jscex' : 'core/jscex/jscex',
        'jscex-builderbase' : 'core/jscex/jscex-builderbase',
        'jscex-async' : 'core/jscex/jscex-async',
        'jscex-parser' : 'core/jscex/jscex-parser',
        'jscex-jit' : 'core/jscex/jscex-jit'
    }
});

seajs.use('modules/loader_test');

