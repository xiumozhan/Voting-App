testApp.controller('navController', ['$scope', '$window', '$location', 'jwtHelper', function($scope, $window, $location, jwtHelper) {

    $scope.signIn = () => {
        $location.path('/login');
    };

    $scope.signUp = () => {
        $location.path('/register');
    };

    $scope.logOut = function() {
        delete $window.localStorage['token'];

        if($window.localStorage['voted']) {
            delete $window.localStorage['voted'];
        }

        $scope.username = undefined;

        if($location.path() === '/profile') {
            $location.path('/');
        }
    };

    $scope.$watch(() => $window.localStorage['token'], (newValue, oldValue) => {
        if(newValue !== undefined) {
            const tokenPayload = jwtHelper.decodeToken($window.localStorage['token']);
            $scope.username = tokenPayload.user.name;
        }
    });
}]);
