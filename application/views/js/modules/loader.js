define(function(require, exports, module) {
  var Base = require("./base");
  require("./base/base-helper");
  require("./base/base-event");
  require("./base/base-data");

   var views_to_be_load = [
       'modules/view/view',
       'modules/view/view-global-ajax',
       'modules/view/view-global-elements',
       'modules/view/view-global-register',
       'modules/view/view-global-robot',
       'modules/view/view-global-router',
       'modules/view/view-global-message',
       'modules/view/view-global-follow',
       
       'modules/view/view-page-index',
       'modules/view/view-page-my_account',
       'modules/view/view-page-books',
       'modules/view/view-page-notes',
       'modules/view/view-page-params',
       'modules/view/view-page-param_create',
   ];
   
   Base.Helpers.init_views( views_to_be_load );

   
});