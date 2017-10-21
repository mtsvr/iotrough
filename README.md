# IOTrough

Web App client for the IOTrough system.

## TO DO

Add backend that connects with the local database and hosts the front-end

## Requirements

- NodeJS >= v6.6.0
- npm >= 30.10.7

## Installation

For development:

First:
```
npm install
```
When being asked by `semantic-ui`'s install script to give location, enter `app/semantic`.

Then, we should build `semantic-ui` dist files:

```
cd app/semantic
../../node_modules/gulp/bin/gulp.js build
```

To check if everything builds correctly, go back to project root directory, and run

```
npm run build
```

## Usage

For running a webpack development server just

```
npm start
```
and point your browser to `localhost:8080`.

Due to `semantic-ui` way to refer assets, Webpack will interpret them as a module but it won't find a way to load it (as explained in this [comment](https://github.com/Semantic-Org/Semantic-UI/issues/3533#issuecomment-186520229)).  Until they change the urls in a webpack friendly way, we can only load the specific semantic modules we're using in the component, for example:

```jsx
import React from 'react';

import '../../semantic/dist/components/button.css';

export default class Todo extends React.Component {
    render() {
        return <button className="ui button">Follow </button>;
    }
}
```


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
