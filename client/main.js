"use strict";

import { Meteor } from 'meteor/meteor';
import angularMeteor from 'angular-meteor';
import ngMessages from 'angular-messages';
import { Accounts } from 'meteor/accounts-base';
// import { SearchHist } from '../collections/db.js'

	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_ONLY',
	});
	// import phantomjsWrapper from 'phantomjs-wrapper';

	angular.module('info', [
		angularMeteor, 'ngMaterial', 'ngMessages', 'accounts.ui'
	])
		.controller('SearchCtrl', SearchCtrl)
		.directive('savedSearch', searchy)

	function onReady() {
		angular.bootstrap(document, ['info']);
	}

	// Saved Directive
	function searchy() {
		return {
			restrict: 'E',
			templateUrl: 'client/templates/partials/saved.html',
			controller: 'SearchCtrl'
		};

	}
	const SearchHist = new Mongo.Collection('searches');

	// Main Controller
	function SearchCtrl($timeout, $q, $scope, $rootScope) {

		// $reactive(this).attach($scope);

		$scope.searches = SearchHist.find().fetch();
		console.log($scope.searches);

		var self = this;
		self.selectedItem = null;
		self.searchText = null;
		self.querySearch = querySearch;

		$scope.master = {};
		$scope.master.searches = [];


		$scope.helpers({
			isUser: function() {
				return !Meteor.userId()
			}
		})

		$scope.search = function(querys) {


			var name = querys.split(" ");
			var firstName = name[0];
			var lastName = name[1];

			// URLS
			var ancestryURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.ancestry.com%2Fname-origin%3Fsurname%3D" + lastName + "'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22topContainer%22%5D%2Fsection%5B1%5D%2Fdiv%2Fdl%5B1%5D%2Fdd'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
			var piplURL = "https://pipl.com/search/?q="+ firstName + "+" + lastName + "&l=&sloc=&in=5"
			var spokeoURL = "http://www.spokeo.com/" + firstName + "-" + lastName;
			var whitepagesURL = "http://www.whitepages.com/name/" + firstName + "-" + lastName;
			var inteliusURL  = "http://www.intelius.com/search/people/" + firstName + "-" + lastName;
			var nameURL = "https://namechk.com/"

			$scope.result = {};

			$.getJSON(ancestryURL, function(result){
				var ancestry = result.query.results.dd;
				$(".ancestry").add("<h3>" + ancestry + "</h3>");
			});

			//*[@id="match_results"

			$scope.hidestatus = false;
			$scope.master.searches.push(querys);

			var check = _.isEmpty(SearchHist.find({
				'name': querys
			}).fetch());

			if (check) {

				SearchHist.insert({
					'name': querys
				});
			}

			// $(".search-button").click();

			$scope.searches = SearchHist.find().fetch();
			$scope.expandedBool = true;

			// Post
			$scope.current = $scope.master.searches.length - 1;

		}

		$scope.removeDB = function(){
			Meteor.call('dbEmpty');
			$scope.searches = "";
		}

		$scope.scrollInfo = function() {

		$("body").animate({
			scrollTop: $("#info").offset().top
		}, 1000);

		}

		$scope.search2 = function(query) {

			console.log(query);
			$scope.searches = SearchHist.find().fetch();
			$scope.newMaster = _.sortBy($scope.searches, 'name');
			console.log($scope.newMaster);

			$scope.querys = $scope.newMaster[query].name;
			console.log($scope.querys);
			$scope.expandedBool = true;

			// Post
			$scope.current = $scope.master.searches.length - 1;

		}

		$(".search").keypress(function(event) {
			var key = event.which;

			if (key == 13){
				$(".search-button").click();
			}
		});


		$scope.title1 = 'Button';
		$scope.title4 = 'Warn';
		$scope.isDisabled = true;
		$scope.googleUrl = 'http://google.com';
		$scope.hidestatus = true;

	}

	function querySearch(query) {
		var results = query ? self.states.filter(createFilterFor(query)) : [];
		return results;
	}
