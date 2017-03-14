testApp.controller('loginController', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
    $scope.usernameOrEmail;
    $scope.password;
    $scope.showErrorMessage = false;

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
                $scope.showErrorMessage = false;
            },
            (response) => {
                console.log(response);
                $scope.showErrorMessage = true;
                $scope.message = 'Incorrected Username/Email or Password';
            }
        )
        .catch((err) => {
            console.log(err);
        });
    };
}]);
