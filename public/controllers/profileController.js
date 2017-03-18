testApp.controller('profileController', ['$scope', '$window', '$location', 'jwtHelper', '$http', function($scope, $window, $location, jwtHelper, $http) {
    const tokenPayload = jwtHelper.decodeToken($window.localStorage['token']);
    console.log(tokenPayload);

    $scope.username = tokenPayload.user.name;
    $scope.added = [];
    // $scope.polls = tokenPayload.user.polls;

    $scope.logOut = function() {
        delete $window.localStorage['token'];

        if($window.localStorage['voted']) {
            delete $window.localStorage['voted'];
        }

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
        let request;
        request = {
            method: 'POST',
            url: '/api/polls',
            data: {
                question: $scope.pollQuestion,
                user: {
                    name: $scope.username
                }
            }
        };

        if($scope.added.length > 0) {
            request.data.options = $scope.added;
        }

        $http(request)
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

            $scope.polls.splice($scope.polls.findIndex((poll) => {
                return poll._id === id;
            }), 1);

        }, (fail) => {
            console.log(fail);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    $scope.addOption = (option) => {
        $scope.added.push(option);
    };

}]);
