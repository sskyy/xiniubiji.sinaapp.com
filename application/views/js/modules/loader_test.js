define(function(require, exports, module) {
  var Base = require("./base");
  require("./base/base-helper");
  require("./base/base-event");
  require("./base/base-error");

   var views_to_be_load = [
       'modules/test/test-page-component'
   ];
   

   Base.Helpers.init_views( views_to_be_load );
});