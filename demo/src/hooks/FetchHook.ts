import { ReactClassHook } from 'react-hooks-for-classes'

export interface FetchHookStatus {
  loading: boolean
  error: Error | null
  data: string | null
}

export interface FetchHookProps {
  url: string
  onChange: (status: FetchHookStatus) => void
}

/**
 * Usage:
 *
 *     const myFetchHook = new FetchHook(() => ({
 *       url: '...',
 *       onChange: ({ loading, data, error }) => {
 *         // ... do something, typically this.setState({ ... })
 *       }
 *     }))
 *
 *     mountHook(this, myFetchHook)
 *     unmountHook(this, myFetchHook)
 */
export class FetchHook extends ReactClassHook<FetchHookProps> {
  private mounted: boolean = false

  hookDidMount () {
    console.log('FetchHook.hookDidMount()')

    this.mounted = true
    this.fetchUrl(this.props.url)
  }

  hookDidUpdate (prevProps: FetchHookProps) {
    console.log('FetchHook.hookDidUpdate()')

    if (this.props.url !== prevProps.url) {
      this.fetchUrl(this.props.url)
    }
  }

  hookWillUnmount () {
    console.log('FetchHook.hookWillUnmount()')

    this.mounted = false
  }

  fetchUrl (url: string) {
    if (this.mounted) {
      this.props.onChange({ loading: true, error: null, data: null })
    }

    // TODO: cancel previous request when still in progress
    window.fetch(url)
      // TODO: fetch JSON when response type is application/json
      .then(response => response.text())
      .then(data => {
        if (this.mounted) {
          this.props.onChange({ loading: false, error: null, data })
        }
      })
      .catch(error => {
        if (this.mounted) {
          this.props.onChange({ loading: false, error, data: null })
        }
      })
  }
}
