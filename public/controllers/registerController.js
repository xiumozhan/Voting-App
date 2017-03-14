testApp.controller('registerController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
    $scope.username;
    $scope.email;
    $scope.password;

    $scope.register = function() {
        $http({
            method: 'POST',
            url: '/api/users',
            data: {
                name: $scope.username,
                email: $scope.email,
                password: $scope.password
            }
        })
        .then(
            (response) => {
                console.log(response);
                $window.localStorage['token'] = response.data;
                $location.path('/profile');
            },
            (response) => {
                console.log(response);
                $scope.message = response.errmsg;
            }
        )
        .catch((err) => {
            console.log(err);
        });
    };
}]);
