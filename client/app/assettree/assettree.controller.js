'use strict';

angular.module('bmw1App')
  .controller('AssettreeCtrl', function ($scope,$http,socket) {
    $scope.assets = [];
    $scope.tree = [];
    $scope.props = [];
//------Init Tree Views-----------
    $http.get('/api/assets/asset').success(function(assets) {
      $scope.assets = assets;
      $scope.tree = $scope.assets;
      //socket.syncUpdates('asset', $scope.assets);
    }).
    error(function(data, status, headers, config) {
      console.log('Failure-http get assets');

    });

    /*$http.get('/api/assets/class').success(function(classes) {
      $scope.clas = classes;
      console.log(classes);
      console.log('Success');
      //socket.syncUpdates('asset', $scope.assets);
    }).
    error(function(data, status, headers, config) {
      console.log('Failure-http get classes');
    });*/
//-------Add Load Functions ---------
    $scope.loadTreeItem = function(){
      var aID = $scope.leftTree.currentNode.data.ID,
          uID = $scope.leftTree.currentNode.data.CustomIdentifier,
          cID = $scope.leftTree.currentNode.data.EquipmentClassID;
      console.log($scope.leftTree.currentNode);
      console.log(uID);
      console.log(aID);
      console.log(cID);
      if(typeof aID !== 'undefinded'){
        async.parallel([
          function(callback){
            $http.get('/api/assets/asset/' + aID).success(function(asset){
            callback(null,asset);
            }).          
            error(function(data,status, headers, config){
              console.log('Failure-http get asset');
              callback('Failure-http get asset',null)
            });
          },
          function(callback){
            if(typeof cID !== 'undefinded' & cID !== null){
              $http.get('/api/xls/bac/' + uID).success(function(BAC){
                callback(null,BAC);
              }).
              error(function(data,status, headers, config){
                console.log('Failure-http get BAC');
              });
            }else{
              callback(null,null);
            }
          },
          function(callback){
            if(typeof cID !== 'undefinded' & cID !== null){
              $http.get('/api/assets/class/' + cID).success(function(asset){
                callback(null,asset);
              }).          
              error(function(data,status, headers, config){
                console.log('Failure-http get Class');
                callback('Failure-http get Class',null)
              });
            }else{
              callback(null,null);
            }
          }
        ],
        function(err,results){
          if(err){
            console.log(err);
          }else{
            $scope.props = combine(results[0],results[1],results[2]);
          }
        });
      }
    };
    $scope.collapseRow = function(item){
      if(item.show){  
        item.show = false;
      }else{
        item.show = true;
      }
    }
    $scope.boolAND = function(arr){
      for(var i = 0;i < arr.length; i++ ){
        if(!(arr[i])){
          return false;
        }
      }
      return true;
    }
    $scope.showBAC = function(){
      for(var i = 0; i < $scope.props.length; i++){
        for(var p in $scope.props[i].properties){
          if(typeof $scope.props[i].properties[p].values[1] === 'string'){
            if($scope.props[i].properties[p].values[1].indexOf('/?') === -1){
              $scope.props[i].properties[p].show = false;
            }else{
              $scope.props[i].properties[p].show = true;
            }
          }else{
            $scope.props[i].properties[p].show = false;
          }
        }
      }

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

function combine(props,bac,cProps){
  console.log([props,bac,cProps])
  var alias,pVal,cProp,n,m,
      ret = [],
      arr,ap,cp,bp;
  for(var j = 0; j< props.length;j++){
    arr = {
      properties:{},
      show:true
    };
    ap = props[j];
    cp = {};
    bp = {};
    for(var i = 0;i< cProps.length; i++){
      cProp = cProps[i];
      if(cProp.Name === ap.Name){
        for(var p in cProp){
          if(cProp.hasOwnProperty(p)){
            pVal = cProp[p];
            cp[p] = pVal;
            if(pVal !== null){
              pVal = pVal.toString();
              n = pVal.search('\\/\\?');
              m = pVal.search('\\?\\/');
              if(n != -1 & m != -1){
                pVal = pVal.replace('/?','');
                pVal = pVal.replace('?/','');
                //console.log(pVal);
                bp[p] = bac[pVal];
              }else{
                bp[p] = '';
              }
              //console.log(p + ':' + bp[p]);
            }
          }
        }
      }
    }
    for(var p in ap){
      arr.properties[p]={
        values:[ap[p],cp[p],bp[p]],
        show:true
      };
    }
    ret.push(arr);
  }  
  console.log(ret);
  return ret;
}