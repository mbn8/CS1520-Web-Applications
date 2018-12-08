// Function that takes in input to determine whether it's Total Gross, Total By Studio, or Opening Gross
// and handles the inputs accordingly
function getHighest(arr, elemID, avgID, isTotal, grossString) {
    var grossMovies = document.getElementById(elemID);
    var grossAvg = document.getElementById(avgID);

    // reset these elements to default whenever the method is called
    grossMovies.textContent = "";
    grossAvg.textContent = "";

    var reduceArray = new Array(10).fill(0);    // create the array that will be reduced for the average
    const reducer = (accumulator, currentValue) => accumulator + currentValue;      // reducer to calculate sum

    // sort the arr argument in descending order
    arr.sort(function (a, b) {
        // if the function is ordering by total gross
        if (isTotal)
            return b.total_gross - a.total_gross;

        // if the function is not ordering by total gross (i.e. ordering by opening weekend)
        return b.opening_gross - a.opening_gross;
    });

    topTen = arr.slice(0, 10);      // topTen only has the top 10 results from the sorted arr

    // Use forEach to display the ordered list of movies
    // Populate the reduceArray with gross values at the corresponding indexes
    topTen.forEach(function (item, idx, arr) {
        var newEntry = document.createElement('li');

        entryString = "Title: " + item.title + "<br/>" + grossString;

        if (isTotal) {
            entryString += formatNumbers(item.total_gross, true);
            reduceArray[idx] = item.total_gross;
        }
        else {
            entryString += formatNumbers(item.opening_gross, true);
            reduceArray[idx] = item.opening_gross;
        }

        newEntry.innerHTML = entryString;
        grossMovies.append(newEntry);
    });


    // If the user clicks the empty select option, the topTen length will be zero
    // If topTen.length == 0, then don't show an average gross
    var average = "";
    if (topTen.length != 0) {
        var average = reduceArray.reduce(reducer) / topTen.length;
        var average = Number(average).toFixed(2);
        average = formatNumbers(average, true);
    }
    grossAvg.textContent = average;
}


// Problem 1: Display the top 10 highest grossing films
function highestGrossing() {
    var moviesCopy = movies.slice()             // create a copy of the movies array to mutate
    getHighest(moviesCopy, "gross-movies", "gross-average", true, "Total Gross: ");
}

// Problem 2: Display the top 10 highest grossing films *by studio*
function populateStudios() {
    const studios = Array.from(new Set(movies.map(movie => movie.studio)));     // populate unique studios into an array
    var studioElem = document.getElementById("studio-select");

    // create a default empty option
    var option = document.createElement("option");
    option.textContent = "";
    studioElem.append(option);

    // Use forEach to populate the select HTML tag with the studio options
    studios.forEach(function (item, idx, arr) {
        option = document.createElement("option");
        option.textContent = item;
        studioElem.append(option);
    });
}

function highestByStudio() {

    var studioElem = document.getElementById('studio-select');
    var moviesCopy = movies.slice()

    studioElem.addEventListener('change', function () {
        var name = document.getElementById("studio-name");
        if (this.value == "")
            name.textContent = "Studio";
        else
            name.textContent = this.value;

        var filterMovies = studioFilter(this.value);
        const filteredMovies = moviesCopy.filter(filterMovies);
        getHighest(filteredMovies, "studio-movies", "studio-average", true, "Total Gross: ");
    });

}

// Closure function for filtering based on studio name
var studioFilter = function (name) {
    return function (x) {
        return x.studio == name;
    }
}

// Problem 3: Display the top 10 highest opening* weekend grossing films
function highestOpening() {
    var moviesCopy = movies.slice()
    getHighest(moviesCopy, "opening-movies", "opening-average", false, "Opening Gross: ");
}

// Custom event handler fired once the movie table is appended to the window
window.addEventListener('tableCreated', function (e) {
    populateStudios();
    highestGrossing();
    highestOpening();
    highestByStudio();
});