/**
 * Created by jblandin on 08/09/2014.
 */
'use strict';

angular.module('myApp')
    .provider("$exceptionHandler", {
        $get: function (errorLogService) {
            console.log("$exceptionHandler.$get()");
            return(errorLogService);
        }
    })

    .factory("errorLogService", function ($log, $window, $filter) {

        $log.info("errorLogService()");

        function log(exception, cause) {
            $log.debug("errorLogService.log()");

            // Default behavior, log to browser console
            $log.error.apply($log, arguments);

            logErrorToServerSide(exception, cause);
        }

        function logErrorToServerSide(exception, cause) {
            $log.info("logErrorToServerSide()");

            // Read from configuration
            var serviceUrl = "http://localhost:3000/error";

            // Try to send stacktrace event to server
            try {
                $log.debug("logging error to server side: serviceUrl = " + serviceUrl);

                // Not sure how portable this actually is
                var errorMessage = exception ? exception.toString() : "no exception";
                var stackTrace = exception ? (exception.stack ? exception.stack.toString() : "no stack") : "no exception";
                var browserInfo = {
                    navigatorAppName: navigator.appName,
                    navigatorUserAgent: navigator.userAgent
                };

                // This is the custom error content you send to server side
                var data = angular.toJson({
                    date: $filter('date')(Date.now(), 'dd/MM/yyyy HH:mm:ss.sss'),
                    errorUrl: $window.location.href,
                    errorMessage: errorMessage,
                    stackTrace: stackTrace,
                    cause: (cause || "no cause"),
                    browserInfo: browserInfo
                });

                $log.debug("logging error to server side...", data);

                // Log the JavaScript error to the server.
                $.ajax({
                    type: "POST",
                    url: serviceUrl,
                    contentType: "application/json",
                    xhrFields: {
                        withCredentials: true
                    },
                    data: data
                });

            } catch (loggingError) {
                // For Developers - log the logging-failure.
                $log.warn("Error logging to server side failed");
                $log.log(loggingError);
            }
        }

        // And return the logging function
        return(log);
    })

    .config([ "$provide", function ($provide) {
        // Use the `decorator` solution to substitute or attach behaviors to
        // original service instance; @see angular-mocks for more examples....

        $provide.decorator('$log', [ "$delegate", "$filter", function ($delegate, $filter) {
            // Save the original $log.debug()
            var debugFn = $delegate.debug;

            // TODO généraliser le decorator à tous les niveaux de log
            $delegate.debug = function () {
                var args = [].slice.call(arguments),
                    now = $filter('date')(Date.now(), '[dd/MM/yyyy HH:mm:ss.sss]');

                // Prepend timestamp
                args[0] = supplant("{0} - {1}", [ now, args[0] ]);

                // Call the original with the output prepended with formatted timestamp
                debugFn.apply(null, args)
            };

            return $delegate;
        }]);
    }])

;
