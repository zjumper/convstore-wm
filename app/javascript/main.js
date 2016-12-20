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
wmApp.controller('centerCtl', ['$scope', '$http', 'cartService', 'Product', function($scope, $http, cartService, Product) {
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

    $scope.addToCart = function(id, price) {
      // console.log(id);
      cartService.add(id, price);
    };
}]);

/**
 * Nav pane controller
 */
wmApp.controller('footerCtl', ['$scope', '$http', 'cartService', function($scope, $http, cartService) {

  // var img = $location.search().pic;
  // if(img) {
  //   img = img.substring(0, img.length - 1) + '46';
  //   $scope.headimgurl = img;
  // } else $scope.headimgurl = "/img/user-icon.png";
  // $scope.openid = $location.search().openid;
  // if($location.search().nickname)
  //   $scope.nickname = $location.search().nickname;
  // else $scope.nickname = "匿名";

  // get user info from server
  $http.get('/api/getUserInfo').success(function(data) {
    // console.log(data);
    // var user = JSON.parse(data);
    var user = data;
    var img = user.headimgurl;
    if(img) {
      img = img.substring(0, img.length - 1) + '46';
      $scope.headimgurl = img;
    } else $scope.headimgurl = "/img/user-icon.png";
    $scope.openid = user.openid;
    if(user.nickname)
      $scope.nickname = user.nickname;
    else $scope.nickname = "匿名";
  });

  $scope.cart = cartService.cart;
  $scope.$on('cart.added', function(event){
    $scope.cart = cartService.cart;
    console.log($scope.cart);
  });

}]);
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

/**
 * Cart service
 */
wmApp.service('cartService', ['$rootScope', '$http', function($rootScope, $http) {
  var service = {
    cart: {
      'products': {},
      'total': {
        'num': 0,
        'amount': 0
      }
    },
    add: function(id, price) {
      // console.log(id);
      if(service.cart.products[id]) {
        service.cart.products[id].num += 1;
      } else {
        service.cart.products[id] = {};
        service.cart.products[id].num = 1;
        service.cart.products[id].price = price;
      }
      service.cart.total.num += 1;
      service.cart.total.amount += price;
      $rootScope.$broadcast('cart.added');
    },
    getUserInfo: function(cb) {
      $http.get('/api/getUserInfo').success(function(data) {
        var user = JSON.parse(data);
        cb(user);
      });
    }
  };
  return service;
}]);
