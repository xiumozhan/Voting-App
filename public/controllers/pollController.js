testApp.controller('pollController', ['$scope', '$routeParams', '$http', '$window', '$timeout', function($scope, $routeParams, $http, $window, $timeout) {
    const pollId = $routeParams.id;
    const ctx = document.getElementById('votingResult').getContext('2d');
    const getAllOptions = () => {
        if(pollId) {
            $http({
                method: 'GET',
                url: `/api/poll/${pollId}`,
            })
            .then((poll) => {
                console.log('the newly created poll:');
                console.log(poll);
                const pollObj = poll.data;
                $scope.title = pollObj.question;
                $scope.options = pollObj.options;

                generateResultChart();

            }, (fail) => {
                console.log(fail);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };

    const generateResultChart = () => {
        let labels;

        labels = $scope.options.map((option) => option.name);
        labels.forEach((label, i) => {
            if(label.length > 20) {
                labels[i] = label.match(/.{1,20}/g);
            }
        });

        return votingResult = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '# of votes',
                        data: $scope.options.map((option) => option.count),
                        backgroundColor: '#66c2ff'
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }],
                    xAxes: [{
                        display: true,
                        gridLines: {
                            drawOnChartArea: true
                        }
                    }]
                }
            }
        });
    };

    getAllOptions();

    $scope.voted = $window.localStorage['voted'] || false;
    $scope.added = [];
    $scope.selection = {
        selected: undefined
    }

    $scope.$watch('voted', (newValue, oldValue) => {
        $timeout(() => {
            $scope.voted = false;
            $window.localStorage['voted'] = false;
        }, 10 * 1000);
    });

    $scope.addOption = (option) => {
        $scope.added.push(option);
    };

    $scope.removeOption = (index) => {
        $scope.added.splice(index, 1);
    }

    $scope.submitAddedOptions = () => {
        if($scope.added.length > 0) {
            let added;
            if($scope.added.length === 1) {
                added = $scope.added[0];
            } else {
                added = $scope.added;
            }

            $http({
                method: 'POST',
                url: `/api/poll/${pollId}`,
                data: {
                    options: added
                }
            })
            .then((poll) => {
                const pollObj = poll.data.poll;
                $scope.options = pollObj.options;
                $scope.added = [];

                generateResultChart();
            }, (fail) => {
                console.log(fail);
                $scope.errorMessage = fail;
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };

    $scope.vote = function() {
        const index = $scope.selection.selected;
        const id = $scope.options[index]._id;
        $http({
            method: 'PUT',
            url: `/api/option/${id}`
        })
        .then((option) => {
            const optionObj = option.data;
            const newCount = optionObj.count;
            console.log(newCount);

            $scope.options[index].count = newCount;

            $window.localStorage['voted'] = true;
            $scope.voted = true;
            $scope.selection.selected = undefined;

            generateResultChart();
        }, (fail) => {
            console.log(fail);
        })
        .catch((err) => {
            console.log(err);
        });
    };
}]);
