testApp.controller('profileController', ['$scope', '$window', '$location', 'jwtHelper', '$http', function($scope, $window, $location, jwtHelper, $http) {
    const tokenPayload = jwtHelper.decodeToken($window.localStorage['token']);
    console.log(tokenPayload);

    $scope.username = tokenPayload.user.name;
    // $scope.polls = tokenPayload.user.polls;

    $scope.logOut = function() {
        delete $window.localStorage['token'];
        $location.path('/');
    };

    const getPollsCreatedByUser = () => {
        if(tokenPayload) {
            $http({
                method: 'GET',
                url: '/api/user/polls',
                params: {
                    id: tokenPayload.user.id
                }
            })
            .then((polls) => {
                $scope.polls = polls.data;
                console.log($scope.polls);
            }, (fail) => {
                console.log(fail);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };

    getPollsCreatedByUser();

    $scope.goToPoll = function(id) {
        $location.path(`/poll/${id}`);
    };

    $scope.createPoll = function() {
        $http({
            method: 'POST',
            url: '/api/polls',
            data: {
                question: $scope.pollQuestion,
                user: {
                    name: $scope.username
                }
            }
        })
        .then((response) => {
            const polls = response.data.polls;
            console.log('newly created poll:');
            console.log(polls);
            $location.path(`/poll/${polls[polls.length - 1]}`);
        }, (fail) => {
            console.log(fail);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    $scope.deletePoll = function(id) {
        $http({
            method: 'DELETE',
            url: `/api/poll/${id}`
        })
        .then((response) => {
            console.log(response);
        }, (fail) => {
            console.log(fail);
        })
        .catch((err) => {
            console.log(err);
        });
    };
}]);
