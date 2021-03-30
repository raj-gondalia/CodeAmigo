const fetch = require('node-fetch');

const url = 'https://codeforces.com/api/problemset.problems';

const problemLinks = [];


// Generates Problem Links
async function generateProblemLink(room) {
    
    for (i = 0; i < 6; i++) {
        problemLinks.push("");
    }

    const problemInfo = getProblemInfo(room);

    await getLink(problemInfo.minRating, problemInfo.maxRating, problemInfo.index);
}


// Sends the problem link based on room rating
function getProblemLink(room) {

    index = getProblemInfo(room).index;
    
    return problemLinks[index];
}

// Creates problem Links
async function getLink(minRating, maxRating, position) {
    
    const response = await fetch(url);

    const data = await response.json();

    if (data.status === 'OK') {
        const problems = data.result.problems;

        while (1) {
            index = getRandomInteger(0, problems.length);
            if (problems[index].rating >= minRating && problems[index].rating <= maxRating) {
                problemLinks[position] = `https://codeforces.com/problemset/problem/${problems[index].contestId}/${problems[index].index}`;
                console.log(problemLinks[position]);
                break;
            }
        }

    }
}


// Generates random number (min, max]
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Returns room rating and the index of link in the array
function getProblemInfo(room) {
    var problemInfo;
    switch (room) {
        case '0-800':
            problemInfo = {
                index: 0,
                minRating: 0,
                maxRating: 800
            };
            break;
        case '800-1200':
            problemInfo = {
                index: 1,
                minRating: 800,
                maxRating: 1200
            };
            break;
        case '1200-1600':
            problemInfo = {
                index: 2,
                minRating: 1200,
                maxRating: 1600
            };
            break;
        case '1600-1800':
            problemInfo = {
                index: 3,
                minRating: 1600,
                maxRating: 1800
            };
            break;
        case '1800-2000':
            problemInfo = {
                index: 4,
                minRating: 1800,
                maxRating: 2000
            };
            break;
        case '2000-2200':
            problemInfo = {
                index: 5,
                minRating: 2000,
                maxRating: 2200
            };
            break;
    }
    return problemInfo;
}

module.exports = {
    getProblemLink,
    generateProblemLink
}