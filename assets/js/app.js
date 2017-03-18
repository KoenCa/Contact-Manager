var ContactManager = new Marionette.Application();

//Helper function for routing
ContactManager.navigate = function(route, options) {
    options || (options = {});
    Backbone.history.navigate(route, options);
};

//Helper function for routing
ContactManager.getCurrentRoute = function () {
    return Backbone.history.fragment;
};

ContactManager.on('before:start', function () {
    var RegionContainer = Marionette.LayoutView.extend({
        el: '#app-container',

        regions: {
            main: '#main-region'
        }
    });

    ContactManager.regions = new RegionContainer();
});

ContactManager.on('start', function () {
    if (Backbone.history) {
        Backbone.history.start();

        //Root of the app navigates to our contacts list
        if (this.getCurrentRoute() === "") {
            ContactManager.trigger('contacts:list');
        }
    }
});
