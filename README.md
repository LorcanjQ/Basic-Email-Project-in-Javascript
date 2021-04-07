# Standard Email Programme using Javascript and JSON database
For a run through of the features look at: https://youtu.be/VWBr-PDVmWc where i have given a voice over.

This is just a rudimentary Javascript/JSON project which allowed me to get an introduction to the language. 
Most importantly, unlike the previous projects I had done, only one html page is loaded for the whole website.
Instead of having to reload a new page for each new email, or whether it was a inbox/sent mail/archived list, 
the javascript displays different information, llall on the one html page, depending on what the user's actions
have been. A particularly interesting "trick" used with the javascript here is that the program doesn't actually 
know who the user is when they are logged in. The JSON database has recorded "recipients" and "senders", and 
organises each relevant email folder accordingly. The way the emails are then displayed by each email folder 
depends only on what email folder (inbox/sent mail etc) the user happens to be in at the time.
