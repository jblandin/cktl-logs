/**
 * Created by jblandin on 11/09/14.
 */
"use strict";


angular.module('myApp', [
    'ngRoute',
    'myApp.view1'
]).
    config(['$routeProvider', function($routeProvider) {

        $routeProvider
            .when('/view1', {
                templateUrl:    'components/view1/view1.html',
                controller:     'View1Ctrl'
            })
            .otherwise({redirectTo: '/view1'});
    }]);
