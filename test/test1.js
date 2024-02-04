import { Evented } from "../src/core/Events.js";
// Sample object using Evented class
const sampleObject = new Evented();

// Add event listener when the "Add Event Listener" button is clicked
document.getElementById('addEventButton').addEventListener('click', () => {
	// Add event listener to the sample object
	sampleObject.on('sampleEvent', (data) => {
		console.log('Event fired', data);
	});
});

// Remove event listener when the "Remove Event Listener" button is clicked
document.getElementById('removeEventButton').addEventListener('click', () => {
	// Remove event listener from the sample object
	sampleObject.off('sampleEvent');
});

// Fire event when the "Fire Event" button is clicked
document.getElementById('fireEventButton').addEventListener('click', () => {
	// Fire event from the sample object
	sampleObject.fire('sampleEvent', { message: 'This is a sample event' });
});
