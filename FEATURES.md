# Features

Features are what the software should do.

## User features

"This software should allow a user to..."

| Name                                                             | Tag                      |
| ---------------------------------------------------------------- | ------------------------ |
| Render files in grid view                                        | #view                    |
| Render files in list view                                        | #view                    |
| Filter files by folder                                           | #filter                  |
| Filter files by favorite property                                | #filter                  |
| Render files by pagination                                       | #view                    |
| Sort by title: asc, desc                                         | #sort                    |
| Sort by modification date: asc, desc                             | #sort                    |
| Filter by creation date: 1 day, 1 week, 2 weeks                  | #filter                  |
| Filter by modification date: 1 day, 1 week, 2 weeks              | #filter                  |
| Filter by a frontmatter property                                 | #filter                  |
| Filter by a group of frontmatter properties                      | #filter                  |
| Reorder the view list                                            | #reorder                 |
| Reorder property group list                                      | #reorder #property-group |
| Filter by search                                                 | #filter                  |
| Add property filter group                                        | #create                  |
| Delete a property filter group                                   | #delete #property-filter |
| Match when property doesn't exist toggle                         | #filter #property-filter |
| Add a property filter                                            | #create #property-filter |
| Delete a property filter                                         | #delete #property-filter |
| Select a condition for property filters                          | #filter #property-filter |
| Select and/or operators for property filters                     | #filter #property-filter |
| Search for tag when clicked                                      | #search                  |
| Search for property when clicked                                 | #search                  |
| Left/right buttons to allow a user to scroll between tags        | #accessibility           |
| Show file preview when mouse hovers link and ctrl/cmd is pressed | #accessibility #preview  |
| Set title wrapping: normal, break-word                           | #render #settings        |
| Set page size                                                    | #render #settings        |
| Set property for modification date                               | #filter #settings        |
| Set properties for creation date                                 | #filter #settings        |
| Set a url property                                               | #settings                |
| Set a favorite property                                          | #settings                |
| Set custom text properties                                       | #settings                |
| Set the log level                                                | #settings                |
| Move focus with left and right arrows                            | #accessibility           |

## Event callbacks

Responses to an action that happens outside of the vault view.

| Source action             | Response action  |
| ------------------------- | ---------------- |
| File is deleted           | Refresh the view |
| Folder is deleted         | Refresh the view |
| File is renamed           | Refresh the view |
| Folder is renamed         | Refresh the view |
| File is modified          | Refresh the view |
| Plugin setting is changed | Refresh the view |

## Routine tasks

Tasks that are preformed on a reoccurring basis.

| Name                           | Frequency      |
| ------------------------------ | -------------- |
| Update time values for filters | Every 1 minute |
