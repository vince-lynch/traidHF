app.controller("homepageController", function($scope) {
  $scope.model = 'Hello WOrld';

  console.log('reached homepageController')

  $scope.soldTokens = 0;
  $scope.totalSupply = 1000;

  $scope.titleText = "!!!!!";


});
