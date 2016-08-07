$(document).ready(function()
{
	// init trains data from stringified json stored in localstorage under 'trains'
	var trains = JSON.parse(localStorage.getItem('trains')) || [];

	// populates rows with data if 'trains' data is not null
	if(trains != null)
	{
		// since trains data is stored in an array, it iterates through all entries
		for(var i = 0; i < trains.length; i++)
		{
			// train variable represents single train in the trains array
			var train = trains[i];
			// calls the populate row method to add a row for the train to the table
			populateRow(train);
		}
	}

	// action to be performed when the train form is submitted
	$('#trainForm').submit(function()
	{
		// each variable is assigned and then added to an array that represents relative data for the train
		var trainName = getInputVal($('#trainName'));
		var destination = getInputVal($('#destination'));
		var firstTrainTime = getInputVal($('#firstTrainTime'));
		var frequency = getInputVal($('#frequency'));
		var trainData = [trainName, destination, frequency, firstTrainTime];

		// push the trainData just received to the train array to be stored in localstorage
		trains.push(trainData);

		// adds or updates any data in localstorage for trains
		localStorage.setItem('trains', JSON.stringify(trains));

		// calls populate row with current trainData array to immediately add it to the trains table
		populateRow(trainData);

		// resets the form inputs and prevents the page from reloading
		this.reset();
		return false;
	});

	// takes an array with trainData and adds a row to the table
	function populateRow(trainArray)
	{
		// creates jQuery object of trainTable and a train row and then appends it to the trainTable
		var trainTable = $('#trainTable tbody');
		var trainTableRow = $('<tr>');
		trainTable.append(trainTableRow);

		// iterates through the first 3 array elements to populate the train name, destination and frequency
		for(var i = 0; i < 3; i++)
		{
			trainTableRow.append($('<td>').text(trainArray[i]));
		}

		// calculates the next arrival by calling the findNextArrival function and passes in a momentjs object with an added format
		// to preserve it as a momentjs object since adding no format defaults to javascript Date object and was causing issues.
		// References the index of the first train time and frequency directly in the trainArray and adds it as a td to the current tr
		var nextArrival = findNextArrival(moment(trainArray[3], 'HH:mm'), trainArray[2]);
		trainTableRow.append($('<td>').text(nextArrival.format('HH:mm')));

		// calculates minutes away from next arrival using momentjs diff function and makes it return the answer in minutes and appends it to the current tr
		var minutesAway = nextArrival.diff(moment(), 'minutes');
		trainTableRow.append($('<td>').text(minutesAway));
	}

	// calculates the next arrival time
	function findNextArrival(firstTrainTime, frequency)
	{
		// inits next arrival time as the firstTrainTime
		var nextArrival = firstTrainTime;

		// while nextArrival time is before the current time, keep adding to the frequency until
		// nextArrival time is in the future
		while(nextArrival.isBefore(moment()))
		{
			// adds frequency to nextArrival time in minutes
			nextArrival = nextArrival.add(frequency, 'm');
		}

		return nextArrival;
	}

	// convenience method to return the trimmed value of an input
	function getInputVal(input)
	{
		return input.val().trim();
	}
});