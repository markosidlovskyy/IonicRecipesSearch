
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {

		
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller("ToDoCtrl",function($scope, $ionicModal, $ionicPopup, $http, $sce){
	
    $scope.recipes=[];

        $http({
            method: 'GET',
            url : 'http://food2fork.com/api/search?key=ac912fa38d17101e80a440ae239d6a94'
        })
        .success(function(data){
      angular.forEach(data.recipes, function(data){
                       $scope.recipes.push(data)
                      });  
            roundedRank($scope.recipes);
    })
    .error(function(response){
   var alertPopup = $ionicPopup.alert({
     title: "Server isn't responsing" ,
     template: 'Internall error'
   });
            
    });
    
    
    $scope.search = function(searchString){
         $http({
            method: 'GET',
            url : 'http://food2fork.com/api/search?key=ac912fa38d17101e80a440ae239d6a94',
             params:{
                 'q': searchString
             }
        })
        .success(function(data){           
             $scope.recipes=[];
      angular.forEach(data.recipes, function(data){
          $scope.recipes.push(data)
                      });
             roundedRank($scope.recipes);
    })
.error(function(response){
   var alertPopup = $ionicPopup.alert({
     title: "Server isn't responsing" ,
     template: 'Internall error'
   });
         });
    }
    
    $scope.recipeModal=$ionicModal.fromTemplateUrl('recipe.html',{
        scope: $scope,
        animation: 'slide-in-right'
    }).then(function(modal){
       $scope.recipeModal=modal; 
    });    
    
    $scope.openRecipe=function(id)
    {
        var recipeId=$scope.recipes[id].recipe_id;
         $http({
            method: 'GET',
            url : 'http://food2fork.com/api/get?key=ac912fa38d17101e80a440ae239d6a94',
             params:{
                 'rId': recipeId
             }
        })
        .success(function(data){   
             console.log(data);
var recipe=data.recipe;
      $scope.selectedRecipe={
            title: recipe.title,
            image_url: recipe.image_url,
            social_rank:'rank: ' + parseFloat(recipe.social_rank).toFixed(2),
          ingredients: recipe.ingredients,
          source_url: recipe.source_url,
          publisher: recipe.publisher
        }
             
    })
          .error(function(response){
   var alertPopup = $ionicPopup.alert({
     title: "Server isn't responsing" ,
     template: 'Internall error'
   });
         });
        $scope.recipeModal.show();
    };
    
    roundedRank=function(data){
        for(var i=0;i<data.length;i++)
                 {
                     $scope.recipes[i].social_rank = parseFloat(data[i].social_rank).toFixed(2).toString();
                 }
    }
    
    $scope.closeRecipe=function()
    {
      $scope.recipeModal.hide();  
    };
    
	 $scope.GotoLink = function (url) {
		 console.log(url);
    window.open(url,'_system');
  };
	
    $scope.$on('modal.hidden', function() {
  // Execute action
  $scope.selectedRecipe = {};
});
})
