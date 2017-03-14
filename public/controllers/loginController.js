testApp.controller('loginController', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
    $scope.usernameOrEmail;
    $scope.password;

    $scope.login = function() {
        $http({
            method: 'POST',
            url: '/api/login',
            data: {
                usernameOrEmail: $scope.usernameOrEmail,
                password: $scope.password
            }
        })
        .then(
            (response) => {
                console.log(response);
                console.log(response.data);
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
