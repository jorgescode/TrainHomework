$(document).ready(function()
{
	var trains = JSON.parse(localStorage.getItem('trains')) || [];
	console.log(trains);

	if(trains != null)
	{
		for(var i = 0; i < trains.length; i++)
		{
			var train = trains[i];
			console.log(train);
			populateRow(train);
		}
	}

	$('#trainForm').submit(function()
	{
		var trainName = getInputVal($('#trainName'));
		var destination = getInputVal($('#destination'));
		var firstTrainTime = getInputVal($('#firstTrainTime'));
		var frequency = getInputVal($('#frequency'));
		var nextArrival = findNextArrival(moment(firstTrainTime, 'HH:mm'), frequency);
		var minutesAway = nextArrival.diff(moment(), 'minutes');

		var trainData = [trainName, destination, frequency, nextArrival.format('HH:mm'), minutesAway];

		trains.push(trainData);

		localStorage.setItem('trains', JSON.stringify(trains));
		console.log(JSON.parse(localStorage.getItem('trains')));

		populateRow(trainData);

		this.reset();
		return false;
	});

	function populateRow(trainArray)
	{
		var trainTable = $('#trainTable tbody');
		var trainTableRow = $('<tr>');
		trainTable.append(trainTableRow);

		for(var i = 0; i < trainArray.length; i++)
		{
			trainTableRow.append($('<td>').text(trainArray[i]));
		}
	}

	function findNextArrival(firstTrainTime, frequency)
	{
		var nextArrival = firstTrainTime.add(frequency, 'm');

		while(nextArrival.isBefore(moment()))
		{
			nextArrival = nextArrival.add(frequency, 'm');
		}

		return nextArrival;
	}

	function getInputVal(input)
	{
		return input.val().trim();
	}
});