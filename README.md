ember_node_player
=================

Node + Ember without Ember Data and with relationships

Description:
  This application is a perfect example of Ember without Ember Data but with promises through Ember.RVSP. App's architecture has a simple relationships "has-many -> belongs-to" (album has many tracks, tracks belongs to album). Displays a
good example of using Ember components such as Ember.Component, template reusing with the custom controller, simple server-side
using Express + Mongoose. However, this project has one unfinished part - GridFS implementation. It's almost implemented,
excepting part where GridFS writeFile method asks for path, and using it (C:/fakepath....) results to "file not found". Actually,
I hadn't enough time to investigate this issue, if you'll have - please share your thoughts with me - pointhomefinal@gmail.com.

Stack of technologies:
- Client-side: Ember 
- Server-side: Node(express)
- DB: MongoDB(mongoose)
- File Storage: GridFS (commented, not finished)
- Task Runner: Gulp

Have fun!
