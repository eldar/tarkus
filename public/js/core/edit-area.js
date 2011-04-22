var deps = [
    "jquery",
    "core/global"
];

define(deps, function($) {

return {
    init: function() {
        $("body").layout({ applyDefaultStyles: true });
    }
};

});
