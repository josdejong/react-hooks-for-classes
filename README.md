# react-hooks-for-classes

_Apply the concept of hooks to React class components_

`react-hooks-for-classes` applies the concept of React functional hooks to classic React component classes. The great thing about Reacts hooks is that it allows you to separate your view logic from business logic and side effects. Before hooks, a common separation was _container components_ (for the view) and _presentational components_ (for the logic). In this approach, container components are part of the view. Hooks give a much cleaner separation since they are not part of the view, whilst they can tap into the life cycle methods of your application.

A downside of React hooks is that they _look_ like regular, pure functions, but they are the opposite of that: they are intended to keep state and handle side effects. Hooks do not have explicit life cycle methods, making it hard to understand when your hook will be executed and with what state. Hooks are bound to special rules and limitations, such as not being able to dynamically create hooks on the fly. They can be hard to deal with due to tricky pitfalls like stale closures, which can be hard to understand and debug.

`react-hooks-for-classes` allows you to create hooks with explicit life cycle methods (mount, update, unmount) and state. This makes it easy to understand what is happening, and gives you 100% control over the behavior of your hooks. The class based hooks have no special rules or limitations that you need to be aware of. It's all plain and simple JavaScript, no magic. This makes the class based hooks play nice with other (non-React) API's.

To summarize the pros and cons of class based hooks:

- Pros:
  - Much easier to understand
  - No magic, no special rules, no tricky pitfalls. Just normal JavaScript.
  - Plays nice with declarative API's like timers, async functions, and data fetching.
  - Performs well by default. No need for `useCallback` and mechanisms like that.
- Cons:
  - The code is more verbose
  - It is not a mainstream solution
  - There are some hacks needed under the hood to make this work, until this solution is baked in React itself ;)


# Install

Install via npm:

```
npm install react-hooks-for-classes
```

Import in your code:

```ts
import { ReactClassHook, mountHook, unmountHook } from 'react-hooks-for-classes'
```

# Usage

See the folder [/demo](https://github.com/josdejong/react-hooks-for-classes/tree/main/demo) in the github project for an extensive example.

Create a `ReactClassHook` with the life cycle methods you need: `hookDidMount`, `hookDidUpdate`, `hookWillUnmount`. The class has a property `this.props`, which is refreshed at any update. You can create your own state in the class, like `this.timer` in the following example.

```ts
import { ReactClassHook } from 'react-hooks-for-classes' 

export interface IntervalHookProps {
  interval: number
  onTick: () => void
}

export class IntervalHook extends ReactClassHook<IntervalHookProps> {
  private timer: number = -1

  hookDidMount () {
    this.start()
  }

  hookDidUpdate (prevProps: IntervalHookProps) {
    if (this.props.interval !== prevProps.interval) {
      this.start()
    }
  }

  hookWillUnmount () {
    window.clearInterval(this.timer)
  }

  start () {
    window.clearInterval(this.timer)
    this.timer = window.setInterval(() => this.props.onTick(), this.props.interval)
  }
}
```

A regular React class component is instantiated by passing `props` to the constructor. Unlike that, a `ReactClassHook` expects a callback function `getProps()` as argument for the constructor. This allows updating the hook's properties before every update.

```ts
const myIntervalHook = new IntervalHook(() => ({
  interval: 1000, // milliseconds
  onTick: () => {
    console.log(`Time: ${time}`)
  }
}))
```

The instantiated hook can be dynamically mounted and unmounted in a React class:

```ts
import React from 'react'
import { mountHook, unmountHook } from 'react-hooks-for-classes'
import { IntervalHook } from './hooks/IntervalHook'

interface DemoProps {}

interface DemoState {
  time: string
}

export default class Demo extends React.PureComponent<DemoProps, DemoState> {
  constructor (props: DemoProps) {
    super(props)

    this.state = {
      time: ''
    }
  }

  componentDidMount () {
    const myIntervalHook = new IntervalHook(() => ({
      interval: 1000, // milliseconds
      onTick: () => {
        const time = new Date().toISOString()
        this.setState({ time })
        console.log(`Time: ${time}`)
      }
    }))
    
    // use mountHook and unmountHook at any moment
    mountHook(this, myIntervalHook)
  }

  render() {
    return (
      <div>
        Time: {this.state.time}
      </div>
    )
  }
}
```


# Development

Start a watcher to build the library:

```
npm start
```

Build the library:

```
npm run build
```

To start the demo (first start the watcher for the library itself):

```
cd demo
npm start
```


# License

ISC
