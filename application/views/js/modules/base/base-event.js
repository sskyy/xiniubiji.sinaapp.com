define(function(require, exports, module) {
    var _ = require("underscore");
    var Backbone = require("backbone");
    var Base = require('../base');
    
    Base.plug( "Events", _.extend({}, Backbone.Events ) );
});