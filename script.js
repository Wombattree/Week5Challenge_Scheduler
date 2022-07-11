var timeBlockListElement = $("#timeBlockList");
var workTimeSlider = $("#workTimeSlider");
var workTimeElement = $("#workTime");
var currentDayElement = $("#currentDay");

var workingHoursStart = 9;
var workingHoursEnd = 17;

var eventSlots = [];

var eventSlot =
{
    eventTime: 0,
    eventText: ""
}

function Init()
{
    SetDay();
    CreateTimeSlots();
    LoadEvents();
}

function SetDay()
{
    currentDayElement.text("Today is the " + moment().format("Do of MMMM"));
}

function CreateTimeSlots()
{
    let numberOfSlots = workingHoursEnd - workingHoursStart;
    let currentHour = moment().format("HH");
    
    for (let i = 0; i < numberOfSlots; i++)
    {
        let newListItem = $("<li data-slottime='" + (workingHoursStart + i) + "' class='timeBlock row'>");
        let newListLabel = $("<div class='timeBlockLabel col-2 col-xl-1'>");
        let newListDisplay = $("<input type='text' class='timeBlockDisplay col-8 col-xl-10'>");
        let newListSave = $("<div class='timeBlockSave col-2 col-xl-1'>");
        
        let slotHour = workingHoursStart + i;
        let slotTime = moment(slotHour, "hh");
        newListLabel.text(slotTime.format("h a"));
        newListSave.text("Save Event");

        if (slotHour < currentHour) newListDisplay.addClass("past");
        else if (slotHour > currentHour) newListDisplay.addClass("future");
        else newListDisplay.addClass("present");

        newListLabel.appendTo(newListItem);
        newListDisplay.appendTo(newListItem);
        newListSave.appendTo(newListItem);

        newListItem.appendTo(timeBlockListElement);

        let newSavedEvent = Object.create(eventSlot)
        newSavedEvent.eventTime = slotHour;
        eventSlots.push(newSavedEvent);

        $(newListSave).click(SaveEvent);
    }
}

function SaveEvent()
{
    let listElement = $(this).closest("li");
    let liTime = $(listElement).data("slottime");

    for (let i = 0; i < eventSlots.length; i++) 
    {
        if (eventSlots[i].eventTime == liTime)
        {
            let eventText = $(listElement).children("input").val();
            eventSlots[i].eventText = eventText;
            localStorage.setItem("eventSlots", JSON.stringify(eventSlots));
        }
    }
}

function LoadEvents()
{
    let savedEventSlots = JSON.parse(localStorage.getItem("eventSlots"));

    if (savedEventSlots != null)
    {
        for (let i = 0; i < eventSlots.length; i++) 
        {
            for (let j = 0; j < savedEventSlots.length; j++) 
            {
                if (eventSlots[i].eventTime == savedEventSlots[j].eventTime)
                {
                    let eventLIElement = $("li").filter(function()
                    {
                        return $(this).data("slottime") == eventSlots[i].eventTime;
                    }).first();
    
                    let eventTextElement = $(eventLIElement).children("input");
                    eventTextElement.val(savedEventSlots[j].eventText);
                    eventSlots[i].eventText = savedEventSlots[j].eventText;
                }
            }
        }
    }
}

Init();