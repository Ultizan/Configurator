'use strict';

angular.module('bmw1App')
  .controller('AssettreeCtrl', function ($scope,$http,socket) {
    $scope.assets = [];
    $scope.clas = [];
    $scope.tree = [];
    $scope.objBAC = [];
    $scope.objAsset = {};
    $scope.objClass = {};
//------Init Tree Views-----------
    $http.get('/api/assets/asset').success(function(assets) {
      $scope.assets = assets;
      $scope.tree = $scope.asseets;
      //socket.syncUpdates('asset', $scope.assets);
    }).
    error(function(data, status, headers, config) {
      console.log('Failure-http get assets');

    });

    $http.get('/api/assets/class').success(function(classes) {
      $scope.clas = classes;
      console.log(classes);
      console.log('Success');
      //socket.syncUpdates('asset', $scope.assets);
    }).
    error(function(data, status, headers, config) {
      console.log('Failure-http get classes');
    });
//-------Add Load Functions ---------
    $scope.loadTreeItem = function(){
      var treeID = $scope.leftTree.currentNode.data.ID;
      var type = $scope.leftTree.currentNode.type;

      if(type === 'Asset'){
        $http.get('/api/assets/asset/' + treeID).success(function(asset){
          $scope.objAsset = asset;
        }).
        error(function(data,status, headers, config){
          console.log('Failure-http get asset');
        })
      }else if(type === 'AssetClass'){
        $http.get('/api/assets/class/' + treeID).success(function(objClass){
          $scope.objClass = objClass;
        }).
        error(function(data,status, headers, config){
          console.log('Failure-http get class');
        });
      }
    };
    $scope.loadBAC = function(){
        $http.get('/api/xls/bac').success(function(BAC){
          $scope.objBAC = BAC;
        }).
        error(function(data,status, headers, config){
          console.log('Failure-http get asset');
        });

    }



    //Add snap button functions for treeview side panel
    var snapper = new Snap({
       element: document.getElementById('content')
    });
    var snapperNavBar = new Snap({
       element: document.getElementById('navbar')
    });

    addEvent(document.getElementById('open-left'), 'click', function(){
      snapper.open('left');
    });
    console.log('Controller Loaded');
    //console.log($scope.assets);      
  });
  
var addEvent = function addEvent(element, eventName, func) {
  if (element.addEventListener) {
      return element.addEventListener(eventName, func, false);
    } else if (element.attachEvent) {
        return element.attachEvent("on" + eventName, func);
    }
};

/* Prevent Safari opening links when viewing as a Mobile App */
(function (a, b, c) {
    if(c in b && b[c]) {
        var d, e = a.location,
            f = /^(a|html)$/i;
        a.addEventListener("click", function (a) {
            d = a.target;
            while(!f.test(d.nodeName)) d = d.parentNode;
            "href" in d && (d.href.indexOf("http") || ~d.href.indexOf(e.host)) && (a.preventDefault(), e.href = d.href)
        }, !1)
    }
})(document, window.navigator, "standalone");