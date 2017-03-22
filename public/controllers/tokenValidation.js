testApp.run(['$rootScope', '$location', '$window', '$http', function($rootScope, $location, $window, $http) {

    $http.defaults.headers.common.Authorization = 'Bearer ' + $window.localStorage.token;
    $rootScope.$watch(() => $window.localStorage.token, (newToken, oldToken) => {
        $http.defaults.headers.common.Authorization = 'Bearer ' + newToken;
    });

    $rootScope.$on('$routeChangeStart', (event, nextRoute, currentRoute) => {
        console.log(nextRoute, currentRoute);
        if(nextRoute.access !== undefined && nextRoute.access.restricted && !$window.localStorage.token) {
            event.preventDefault();
            $location.path('/');
        }
        if($window.localStorage.token && nextRoute.access.restricted) {

            $http.post('/api/token', {
                token: $window.localStorage['token']
            })
            .then(
                (response) => {
                    console.log(response);
                },
                (response) => {
                    delete $window.localStorage['token'];
                    $location.path('/login');
                }
            )
            .catch((err) => {
                if(err) {
                    console.log(err);
                }
            });
        }
    });
}])
