var deps = [
    "jquery",
    "ui-misc/splitter"
];

require(deps, function($) {
    $(".splitarea").splitter({
        splitVertical: false,
        sizeLeft: true,
    });
});