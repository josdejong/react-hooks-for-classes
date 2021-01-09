import { ReactClassHook } from 'react-hooks-for-classes'

export interface IntervalHookProps {
  interval: number
  onTick: () => void
}

/**
 * Usage:
 *
 *     const myIntervalHook = new IntervalHook(() => ({
 *       interval: 1000, // milliseconds
 *       onTick: () => {
 *         // ... do something
 *       }
 *     }))
 *
 *     mountHook(this, myIntervalHook)
 *     unmountHook(this, myIntervalHook)
 */
export class IntervalHook extends ReactClassHook<IntervalHookProps> {
  private timer: number = -1

  hookDidMount () {
    console.log('IntervalHook.hookDidMount()')

    this.start()
  }

  hookDidUpdate (prevProps: IntervalHookProps) {
    console.log('IntervalHook.hookDidUpdate()')

    if (this.props.interval !== prevProps.interval) {
      this.start()
    }
  }

  hookWillUnmount () {
    console.log('IntervalHook.hookWillUnmount()')

    window.clearInterval(this.timer)
  }

  start () {
    window.clearInterval(this.timer)
    this.timer = window.setInterval(() => this.props.onTick(), this.props.interval)
  }
}
