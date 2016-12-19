'use strict';

var wmApp = angular.module('wmApp', ['ui.router', 'ui.layout', 'ui.bootstrap', 'angoose.client']);
/**
 * UI-Router configuration
 **/
wmApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            views: {
              '': { templateUrl: 'views/main.html' },
              'nav@home': {
                templateUrl: 'views/nav.html',
                controller: 'navCtl'
              },
              'center@home': {
                templateUrl: 'views/center.html',
                controller: 'centerCtl'
              },
              'footer@home': {
                templateUrl: 'views/footer.html',
                controller: 'footerCtl'
              },
            }
        })
        .state('about', {
            url: '/about',
            views: {
              '': { templateUrl: 'views/about.html' },
              'nav@about': {
                templateUrl: 'views/nav.html',
                controller: 'navCtl'
              }
            }

        });

});

/**
 * Nav pane controller
 */
wmApp.controller('navCtl', function($scope){
  $scope.categories = [{id:0, label:'热餐', link:'#home'},
    {id:1, label:'餐饮', link:'#about'},
    {id:2, label:'食品', link:'#daily'},
    {id:2, label:'百货', link:'#daily'},
    {id:3, label:'其他', link:'#other'}];
});

/**
 * Main pane controller
 */
wmApp.controller('centerCtl', ['$scope', '$http', 'SampleUser', 'Product', function($scope, $http, SampleUser, Product) {
  // $scope.products = [{id:0, label:'热餐', pic:'box.png', price:1.00, link:'#home'},
  //   {id:1, label:'煮雨颜文字君玛格丽特手印饼（蛋黄&抹', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:3, label:'其他', pic:'box.png', price:1.00, unit:'个', link:'#other'}];

  $scope.products = Product.$query({});

    // $scope.$broadcast('dataloaded');
    // for(var i = 2; i < 22; i ++) {
    //   var p = new Product({
    //     id: i,
    //     name: '产品名称' + i,
    //     price: 1.5 * i,
    //     unit: '个',
    //     stock: 20 + i,
    //     pcode: '1234567890123' + i,
    //     qcode: '12345678' + i,
    //     pic: 'box.png',
    //     desc: '测试产品' + i
    //   });
    //   // var pp = Product.$get({'id':'1'});
    //   // console.log(pp);
    //   // console.log(pp.name);
    //   // console.log(pp.id);
    //   p.save(function(err, result){
    //     console.log(p._id);
    //   }, function(err){
    //     console.log(err);
    //   });
    // }

}]);

/**
 * Nav pane controller
 */
wmApp.controller('footerCtl', function($scope){

});
//
// wmApp.directive('format-currency', ['$timeout', function($timeout) {
//   return {
//     link: function($scope, element, attrs) {
//       $scope.$on('dataloaded', function() {
//         $timeout(function () {
//           //jquery code and plugins
//           console.log('......');
//           $('.price').formatCurrency({symbol: '￥'});
//         }, 0, false);
//       });
//     }
//   };
// }]);
