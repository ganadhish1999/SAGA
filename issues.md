# Known Issues

* __Database__: Post table has subforum and community id foreign keys... Normalized?
* __Registration,__ __Create Post__: The commas and typing overall in Bootstrap Tags input
* __Create Post__: HTML doesn't show multiple files upload
* SQL retrieval for about gives an error
* __Home Page__: For logged in users, the home page doesn't show any other posts other than from his interests/qualifications (and about) -- __solved__
* __Chat__: Lazy loading of messages in chat works, but it scrolls to the top every time, very fast. So next time when the messages need to be loaded, user needs to scroll down so that 'Beginning' goes out of viewport, then scroll up again
* __Lazy Loading__: doesn't work if the footer is in the window view at the start
* __Chat__: Initial load of chat page currently uses a workaround. See /chat route for details.
* __Chat__: User boxes in chatUserList on chat page not shown correctly
* __Chat__: Chat messages are not getting ordered correctly.