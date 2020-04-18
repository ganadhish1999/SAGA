# Known Issues

* __Database__: Post table has subforum and community id foreign keys... Normalized?
* __Registration,__ __Create Post__: The commas and typing overall in Bootstrap Tags input
* __Create Post__: HTML doesn't show multiple files upload
* SQL retrieval for about gives an error
* __Home Page__: For logged in users, the home page doesn't show any other posts other than from his interests/qualifications (and about)
* __Chat__: Initial load of chat page gives error (although this is masked when a username is provided in the url)
* __Chat__: Lazy loading of messages in chat works, but it scrolls to the top every time, very fast. So next time when the messages need to be loaded, user needs to scroll down so that 'Beginning' goes out of viewport, then scroll up again