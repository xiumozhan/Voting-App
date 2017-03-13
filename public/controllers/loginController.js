testApp.controller('loginController', ['$scope', '$http', function($scope, $http) {
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
        .then((response) => {
            console.log(response);
        }, (response) => {
            console.log(response);
        });
    }
}]);
