import React from 'react'
import { mountHook, unmountHook } from 'react-hooks-for-classes'
import { FetchHook, FetchHookStatus } from './hooks/FetchHook'
import { IntervalHook } from './hooks/IntervalHook'

interface DemoProps {}

interface DemoState {
  expr: string
  interval: number
  time: string

  fetchStatus: FetchHookStatus
}

export default class Demo extends React.PureComponent<DemoProps, DemoState> {
  private myIntervalHook: IntervalHook | undefined
  constructor (props: DemoProps) {
    super(props)

    this.state = {
      expr: '3 + sqrt(4)',
      interval: 1000,
      time: '',

      fetchStatus: {
        loading: false,
        error: null,
        data: null
      }
    }

    console.log('Demo.constructor()')
  }

  componentDidMount () {
    console.log('Demo.componentDidMount()')

    const myFetchHook = new FetchHook(() => ({
      url:  `https://api.mathjs.org/v4/?expr=${encodeURIComponent(this.state.expr)}`,
      onChange: ({ loading, data, error }) => {
        this.setState({
          fetchStatus: { loading, data, error }
        })
      }
    }))

    mountHook(this, myFetchHook)
  }

  componentDidUpdate (prevProps: DemoProps, prevState: DemoState) {
    console.log('Demo.componentDidUpdate()')
  }

  componentWillUnmount () {
    console.log('Demo.componentWillUnmount()')
  }

  onChangeExpression = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      expr: event.target.value
    })
  }

  onChangeInterval = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      interval: parseInt(event.target.value)
    })
  }

  startInterval = () => {
    this.stopInterval()

    this.myIntervalHook = new IntervalHook(() => ({
      interval: this.state.interval, // milliseconds
      onTick: () => {
        const time = new Date().toISOString()
        console.log(`Time: ${time}`)
        this.setState({ time })
      }
    }))

    // you can attach the hook anywhere at any moment
    // the hook will be invoked when props or state change
    // you can call unmountHook(this, myFetch) any moment to remove the hook again
    mountHook(this, this.myIntervalHook)
  }

  stopInterval = () => {
    if (this.myIntervalHook) {
      unmountHook(this, this.myIntervalHook)
      delete this.myIntervalHook
    }
  }

  render() {
    const { expr, interval, fetchStatus: { loading, error, data } } = this.state

    return (
      <>
        <p>
          Expression: <input type='text' value={expr} onChange={this.onChangeExpression} />
        </p>
        <p>
          Result: {
            loading
              ? 'loading...'
              : error
              ? ('Error: ' + error.toString())
              : data
          }
        </p>
        <p>
          <button onClick={this.startInterval}>Start interval</button>
          <button onClick={this.stopInterval}>Stop interval</button>
        </p>
        <p>
          Interval: <input type='text' value={interval}  onChange={this.onChangeInterval} />
        </p>
        <p>
          Time: {this.state.time}
        </p>
      </>
    )
  }
}
