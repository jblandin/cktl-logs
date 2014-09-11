/**
 * Created by jblandin on 11/09/14.
 */
"use strict";

angular.module('myApp.view1', [])
    .controller('View1Ctrl', ['$scope', '$log', function ($scope, $log) {
        $scope.createLogInfo = function () {
            $log.info("Un log d'information");
        };

        $scope.createLogErreur = function () {
            throw new Error("Une erreur !");
        };
    }])
;

