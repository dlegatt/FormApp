'use strict';

gbApp.controller('GuestBookController',
    function GuestBookController($scope, guestBookData) {
        $scope.entry = {};
        $scope.errors = {};
        $scope.entries = guestBookData.getAllEnties();
        $scope.sign = function (entry) {
            $scope.errors = {};
            guestBookData.newEntry(entry)
                .$promise.then(
                function(response) {
                    console.log('success', response);
                    $scope.entries.push(response);
                    $scope.entry = null;
                },
                function(response) {
                    console.log('failure', response);

                    for (var error in response.data.errors) {
                        $scope.errors[response.data.errors[error].field] =
                            response.data.errors[error].message;
                    }
                    console.log($scope.errors);
                }
            )
        };
        $scope.delete = function(entry) {
            guestBookData.deleteEntry(entry.id);
            var index = $scope.entries.indexOf(entry);
            if (index > -1) {
                $scope.entries.splice(index,1);
            }
        }
    }
);