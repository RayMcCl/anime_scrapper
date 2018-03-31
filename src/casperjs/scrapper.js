/** --- Modules --- **/
var fs = require('fs');
var casper = require('casper').create();

/** --- Global Variables --- **/
var URL = "https://myanimelist.net/topanime.php?limit=";
var INCREMENT = 50;
var INTERVAL = 1000;
var MAX = 10000;
var LOG_FILE = 'data.json';

var output = [];
var cur = 0;

// Initialize the casper instance with the provided URL
casper.start(URL + cur);

// Once casper has loaded the page, begin 
casper.then(function() {
	console.log('Starting Scan');
	openPage.apply(this);
});

// Run the casper task
casper.run();

function openPage () {
	
	// Wait for a given interval of time to avoid IP blocking
	casper.wait(INTERVAL, function() {});
	
	console.log('Checking Page:', cur, '-' ,cur + 50);

	// If the current page is below the maximum
	if(cur < MAX) {
		
		casper.thenOpen(URL + cur, function () {

			// Scan the next page in the queue
			scanPage.apply(this);

			// Increase the current page value by the increment value
			cur += INCREMENT;

			// Open the next page in the queue
			openPage.apply(this);
		});
	} else {
		console.log('Finished');
	}
}

function scanPage () {
	
	// Initialize the data container
	var data = {};

	// Retrieve the associated element information for each of the data elements on the page
	data.images = this.getElementsInfo('.top-ranking-table .ranking-list img');
	data.information = this.getElementsInfo('.top-ranking-table .ranking-list .detail .information');
	data.ranks = this.getElementsInfo('.top-ranking-table .ranking-list .rank');
	data.scores = this.getElementsInfo('.top-ranking-table .ranking-list .score .text');
	data.titles = this.getElementsInfo('.top-ranking-table .ranking-list .detail div:nth-child(2) .hoverinfo_trigger');
	
	// Parse the retrieved data
	parseData(data);
	
	// Write the full of the output to the log file
	fs.write(LOG_FILE, JSON.stringify(output), 'w');
}

function parseData (data){
	
	for(var k in data){
		if(data[k].length !== data.titles.length){
			
			this.echo('Lengths Dont Match :(');
			break;
		}
	}

	for(var i = 0; i < data.titles.length; i++){
		
		var sectionedInformation = data.information[i] ? data.information[i].html.split('<br>') : ['1 (1), 2, 3, 4'];

		//logObject(data.information[i]);
		console.log(data.information[i].html);
		logObject(sectionedInformation);

		var anime = {
			startingDate: getStartingDate(sectionedInformation),
			endingDate: getEndingDate(sectionedInformation),
			episodes: getEpisodes(sectionedInformation),
			imgPath: getImgPath(data.images[i]),
			link: getLink(data.titles[i]),
			members: getMembers(sectionedInformation),
			rank: getRank(data.ranks[i]),
			score: getScore(data.scores[i]),
			title: getTitle(data.titles[i]),
			type: getType(sectionedInformation)
		};

		output.push(anime);
	}
}

function logObject (obj) {
	console.log('{');
	for(var k in obj){
		console.log('\t', k, ':', obj[k]);
	}
	console.log('}');
}

/** --- Cleaner Functions --- **/
function getEpisodes (val) {
	var episodes = val[0].split('(')[1];
	return episodes.substring(0, episodes.length - 1).trim();
}

function getType (val) {
	return val[0].split('(')[0].trim();
}

function getStartingDate (val) {
	return val[1].split('-')[0].trim();
}

function getEndingDate (val) {
	return val[1].split('-')[1].trim();
}

function getMembers (val) {
	return val[2].trim();
}

function getImgPath (val) {
	return val.attributes.hasOwnProperty('data-src') ? val.attributes['data-src'] : 'none';
}

function getLink (val) {
	return val.attributes.hasOwnProperty('href') ? val.attributes['href'] : 'none';
}

function getRank (val) {
	return val.text.trim();
}

function getScore (val){
	return val.text.trim();
}

function getTitle (val){
	return val.text.trim();
}
